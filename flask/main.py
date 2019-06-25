from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit


app = Flask(__name__)
app.config.from_envvar('APP_SETTINGS')

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
                    if body['type'] == 'resourceLog_created' and body['details']['resource']['id'] == app.config['FABMAN_RESOURCE_ID']:
                        log_type = body['details']['log']['type']
                        if log_type in ('allowed', 'denied', 'keyAssigned'):
                            if body['details']['log']['member']:
                                name = body['details']['member']['firstName']
                                return name, log_type
                            else:
                                return 'Unknown', 'denied'                        
                        else:
                            print("Error parsing json response for log_type - cannot determine type e.g. allowed, denied")
                            return None
                    elif body['type'] == 'test':
                        name = body['details']['createdBy']['firstName']
                        return name, 'allowed'
                except KeyError:
                    print("ERROR IN FABMAN JSON RESPONSE please examine logs for further info")
                    return None
                
        else:
            # TODO: learn how to raise exceptions properly...
            print("UNAUTHORIZED") # Check your token - is it present & valid?
            return None

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

# @socketio.on('connect')
# def test_connect():
#     send('server successfully connected to client!')

# @socketio.on('member check-in')
# def handleMessage(data):
#     emit('member check-in', {'data': data})

# FLASK

@app.route("/webhook", methods=["POST"])
def get_member_access():
    member_data = parse_activity_webhook(request)
    if member_data:
        emit('member check-in', {'data': member_data}, namespace='/', broadcast=True)
    return 'done', 200

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0')