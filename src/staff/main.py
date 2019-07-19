from flask import Flask, request
from flask_apscheduler import APScheduler
import requests
import pickle
import time
import os
import sys
from pathlib import Path

class Config(object):
    SECRET_KEY = os.environ['FLASK_SECRET_KEY']

app = Flask(__name__)
app.config.from_object(Config())
scheduler = APScheduler()

GROUP = os.environ['GROUPS_GROUP']
GROUPS_CERT = '.{}{}'.format(os.sep, os.environ['GROUPS_CERT'])
GROUPS_KEY = '.{}{}'.format(os.sep, os.environ['GROUPS_KEY'])
GROUPS_ROOT = '.{}{}'.format(os.sep, os.environ['GROUPS_CERT_ROOT'])
FLASK_PORT_STAFF = os.environ['FLASK_PORT_STAFF']
FLASK_TOKEN = os.environ['FLASK_TOKEN']
HOME = str(Path.home())

def staff_checkin(netid):
    ''' Determines what to do when a staff is checking in '''
    # TODO: add hooks for test MSFT Teams bot here
    print('{} -> staff'.format(netid),file=sys.stderr)
    return '{} -> staff'.format(netid)

@app.route("/staff", methods=["POST"])
def is_staff_member(**kwargs):
    ''' Determines if the netid matches a netid in the list of staff '''
    try:
        if request.args.get('token') == FLASK_TOKEN:
            # get netid from request or previous call
            netid = kwargs.get('netid', None)
            if not netid:
                netid = request.get_json()['data']
            members = None
            try:
                with open('{}{}data.pickle'.format(HOME, os.sep), 'rb') as f:
                    members = pickle.load(f)
            except (OSError, IOError) as e:
                print(e)
                # TODO: add a count here to prevent infinite loop
                # get_staff_members()
                # is_staff_member(netid=netid)
            if members:
                if netid in \
                    [ m['id'] for m in members['data'] if m['type'] == 'uwnetid' ]:
                        return staff_checkin(netid)
                else:
                    print('{} -> not staff'.format(netid),file=sys.stderr)
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
                      .format(fmt_time),file=sys.stderr)
                with open('{}{}data.pickle'.format(HOME, os.sep), 'wb') as f:
                    pickle.dump(r.json(), f, pickle.HIGHEST_PROTOCOL)
            else:
                print('{}, ERROR: could not fetch staff from UW Groups'
                      '\nPlease restart this container by turning the computer'
                      ' off and on again'
                      '\nAlso ensure there is an Internet connection &'
                      ' UW Groups API is up'
                      .format(fmt_time),file=sys.stderr)
                sys.exit(1)
    except Exception as e:
        print(e)

if __name__ == '__main__':
    scheduler.init_app(app)
    scheduler.start()
    get_staff_members()
    app.run(host='0.0.0.0', port=FLASK_PORT_STAFF)