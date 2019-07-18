from flask import Flask, request
from flask_apscheduler import APScheduler
import requests
import socketio
import pickle
import time
import os
import sys
import logging

GROUP = os.environ['GROUPS_GROUP']
GROUPS_CERT = '.{}{}'.format(os.sep, os.environ['GROUPS_CERT'])
GROUPS_KEY = '.{}{}'.format(os.sep, os.environ['GROUPS_KEY'])
GROUPS_ROOT = '.{}{}'.format(os.sep, os.environ['GROUPS_CERT_ROOT'])

app = Flask(__name__)
# TODO: make all envvars passed via docker-compose
app.config.from_envvar('APP_SETTINGS_STAFF')

scheduler = APScheduler()

def staff_checkin(netid):
    ''' Determines what to do when a staff is checking in '''
    # TODO: add hooks for test MSFT Teams bot here
    return '{} -> staff'.format(netid)

@app.route("/staff", methods=["POST"])
def is_staff_member(**kwargs):
    ''' Determines if the netid matches a netid in the list of staff '''
    try:
        # ! test if token check is working...
        # ! setup requirements.txt to be correct
        if request.args.get('token') == app.config['FLASK_TOKEN']:
            # get netid from request or previous call
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
    except Exception as e:
        print(e)

@scheduler.task('cron', id='get_staff_members', day='*', hour='4')
def get_staff_members():
    try:
        with requests.Session() as s:
            s.cert = (GROUPS_CERT, GROUPS_KEY)
            s.verify = GROUPS_ROOT
            r = s.get('https://iam-ws.u.washington.edu:7443/group_sws/v3/group/{}/effective_member'
                  .format(GROUP))
            fmt_time=time.strftime("%m-%d-%Y @ %H:%M%p")
            if r.status_code == 200:
                print('{}, successfully fetched staff from UW Groups'
                      .format(fmt_time))
                with open('data.pickle', 'wb') as f:
                    pickle.dump(r.json(), f, pickle.HIGHEST_PROTOCOL)
            else:
                print('{}, ERROR: could not fetch staff from UW Groups'
                      '\nPlease restart this container by turning the computer'
                      ' off and on again'
                      '\nAlso ensure there is an Internet connection &'
                      ' UW Groups API is up'
                      .format(fmt_time))
                sys.exit(1)
    except Exception as e:
        print(e)

if __name__ == '__main__':
    scheduler.init_app(app)
    scheduler.start()
    app.run(host='0.0.0.0', port=app.config['FLASK_PORT_STAFF'])