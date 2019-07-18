from flask import Flask, request
import requests
import socketio
import pickle
import time
import os
import sys
import logging

GROUPS_CERT = '.{}{}'.format(os.sep, os.environ['GROUPS_CERT'])
GROUPS_KEY = '.{}{}'.format(os.sep, os.environ['GROUPS_KEY'])
GROUPS_ROOT = '.{}{}'.format(os.sep, os.environ['GROUPS_CERT_ROOT'])
GROUP = os.environ['GROUPS_GROUP']

app = Flask(__name__)

def staff_checkin(netid):
    ''' Determines what to do when a staff is checking in '''
    # TODO: determine what things to do...
    return '{} -> staff'.format(netid)

@app.route("/staff", methods=["POST"])
def is_staff_member(**kwargs):
    ''' Determines if the netid matches a netid in the list of staff '''
    netid = kwargs.get('netid', None)
    if not netid:
        netid = request.get_json()['data']
    members = None
    try:
        with open('data.pickle', 'rb') as f:
            members = pickle.load(f)
    except (OSError, IOError) as e:
        print(e)
        get_staff_members()
        is_staff_member(netid=netid)
    if members:
        if netid in \
            [ m['id'] for m in members['data'] if m['type'] == 'uwnetid' ]:
                return staff_checkin(netid)
        else:
            return '{} -> not staff'.format(netid)

def get_staff_members():
    try:
        with requests.Session() as s:
            s.cert = (GROUPS_CERT, GROUPS_KEY)
            s.verify = GROUPS_ROOT
            r = s.get('https://iam-ws.u.washington.edu:7443/group_sws/v3/group/{}/effective_member'
                  .format(GROUP))
            if r.status_code == 200:
                with open('data.pickle', 'wb') as f:
                    pickle.dump(r.json(), f, pickle.HIGHEST_PROTOCOL)
                # logging.info('Fetching Groups\' staff members')
                print('Fetching Groups\' staff members')
            else:
                print('ERROR, could not get Groups\' members')
                sys.exit(1)
    except Exception as e:
        print(e)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)