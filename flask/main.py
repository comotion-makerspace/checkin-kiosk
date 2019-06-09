from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
# import json
from functions import fabmanRequest, getFabmanMembers
# import pickle


app = Flask(__name__)
app.config.from_envvar('APP_SETTINGS')

# LOGIC

# # TODO: pickle can be in a path name defined in env vars
# def get_all_fabman_members():
#     '''
#     Fetches all fabman members, then adds them to a dictionary with their ID and firstName as key/value respectively, which is then pickled
#     '''
#     data = getFabmanMembers()
#     id_name_dict = dict([ (data[i]['id'],data[i]['firstName']) for i in range(0, len(data)) ])
#     # logging.error(id_name_dict)
#     with open('data.pickle', 'wb') as f:
#         pickle.dump(id_name_dict, f, pickle.HIGHEST_PROTOCOL)

# def get_fabman_member_first_name(memberNumber):
#     '''
#     Returns Fabman member number from fabman using the supplied UW netID
#     '''
#     # TODO: Should this be returning a fabman user object?
#     # TODO: REMOVE THE SECRET and use ENVIRONMENT VARS
#     response = fabmanRequest("https://fabman.io/api/v1/members/{}".format(memberNumber), "get")
#     if response.status_code == 200:
#         print("GET FABMAN MEMBER WAS CALLED")
#         return json.loads(response.text)["firstName"]
#     else:
#         print("fabman member number: " + memberNumber + 'unable to be retrieved!')
#         return ""

def parse_activity_webhook(request):
    '''
    Attempts to parse a Fabman JSON response contained in a webhook
    when a member activates a Fabman bridge with their key card.

    Returns a dict with the member's name and their status -> "allowed", "denied", or "keyAssigned"
    '''
    try:
        if request.args.get('token') == app.config['FLASK_TOKEN']:
            if request.method == "POST":
                body = request.get_json(force=True) # I tested printing the content headers and wasn't
                                                    # able to get the Content-Type: application/json from Fabman, so we force parsing as json here
                try:
                    # TODO: look @ "resourceLog_created" on fabman docs to see if there's somethin' else i need to look @
                    if body['type'] == "resourceLog_created" and body['details']['resource']['name'] == app.config['FABMAN_RESOURCE_NAME']:
                        log_type = body['details']['log']['type']
                        if log_type in ("allowed", "denied", "keyAssigned"):
                            
                            # try:
                            #     with open('data.pickle', 'rb') as f:
                            #         data = pickle.load(f)
                            # except FileNotFoundError:
                            #     get_all_fabman_members()
                            #     with open('data.pickle', 'rb') as f:
                            #         data = pickle.load(f)
                            # fabman_member_id = body['details']['member']['id']
                            # name = data.get(fabman_member_id) or get_fabman_member_first_name(str(fabman_member_id)) #TODO: rethink this string going into that function...
                            name = body['details']['member']['firstName']
                            return name, log_type
                        else:
                            print("Error parsing json response for body['type']['log']['type'] - cannot determine type e.g. allowed, denied")
                except KeyError:
                    print("ERROR IN FABMAN JSON RESPONSE")
                    pass
                # return jsonify(request.json)
        else:
            # TODO: learn how to raise exceptions properly...
            print("UNAUTHORIZED") # Check your token - is it present & valid?
            pass
    except Exception as e:
        print(e)



# SOCKET.IO


socketio = SocketIO(app)
# @socketio.on('message')
# def handleMessage(msg):
# 	print('Message: ' + msg)
# 	send(msg, broadcast=True)

# @socketio.on('my event')
# def handleMessage(msg):
# 	# print('Message: ' + msg)
# 	emit('my response', {'data': msg['data']})

@socketio.on('connect')
def test_connect():
    emit('member check-in', {'data': ('Connected', 'GET')})

# @socketio.on('member check-in')
# def handleMessage(data):
#     emit('member check-in', {'data': data})

# FLASK

@app.route('/', methods=["GET"])
def index():
    return render_template('index.html', async_mode=socketio.async_mode)

# @socketio.on('member check-in')
@app.route("/webhook", methods=["POST"])
def get_member_access():
    member_data = parse_activity_webhook(request)
    emit('member check-in', {'data': member_data}, namespace='/', broadcast=True)
    # socketio.on_event('member check-in', my_function_handler)
    return 'done', 200

if __name__ == '__main__':
    socketio.run(app)
    # app.run()