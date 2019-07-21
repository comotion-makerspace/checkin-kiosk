from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
import requests
import os


app = Flask(__name__)
socketio = SocketIO(app)

app.secret_key = os.environ['FLASK_SECRET_KEY']
FLASK_TOKEN = os.environ['FLASK_TOKEN']
FABMAN_RESOURCE_ID = os.environ['FABMAN_RESOURCE_ID']
STAFF_URL = os.environ['STAFF_URL']
FLASK_PORT = os.environ['FLASK_PORT']

def parse_activity_webhook(request):
    '''
    Attempts to parse a Fabman JSON response contained in a webhook
    when a member activates a Fabman bridge with their key card.

    Returns a dict with the member's name and their status -> "allowed", "denied", or "keyAssigned"
    '''
    try:
        if request.args.get('token') == FLASK_TOKEN:
            if request.method == "POST":
                body = request.get_json(force=True) # need force...
                try:
                    if body['type'] == 'resourceLog_created' and body['details']['resource']['id'] == int(FABMAN_RESOURCE_ID):
                        log_type = body['details']['log']['type']
                        if log_type in ('allowed', 'denied', 'keyAssigned'):
                            if body['details']['log']['member']:
                                name = body['details']['member']['firstName']
                                member_number = body['details']['member']['memberNumber']
                                return name, log_type, member_number
                            else:
                                return 'Unknown', 'denied'                        
                        else:
                            print("Error parsing json response for log_type - cannot determine type e.g. allowed, denied")
                            return None
                    elif body['type'] == 'test':
                        name = body['details']['createdBy']['firstName']
                        return name, 'allowed'
                except KeyError:
                    print("ERROR PARSING FABMAN JSON RESPONSE; please examine logs for further info")
                    return None
        else:
            print("UNAUTHORIZED REQUEST MADE") # Check your token - is it present & valid?
            return None

    except Exception as e:
        print(e)

@app.route("/webhook", methods=["POST"])
def get_member_access():
    member_data = parse_activity_webhook(request)
    print('received some data: {}'.format(member_data) )
    if member_data:
        emit('member check-in', {'data': member_data[:2]}, namespace='/', broadcast=True)
        requests.post('{}/staff?token={}'
                    .format(STAFF_URL, FLASK_TOKEN),
                    json={'data': member_data[-1]})
    return 'done', 200

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=FLASK_PORT)