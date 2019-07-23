from flask import Flask, request
from flask_apscheduler import APScheduler
import requests
import pickle
import time
import datetime
import os
import sys
import json
from pathlib import Path

# TODO: Check get_closing_hours and is_closing_time
# TODO: Add type and get data for volunteers in UW Groups

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
FABMAN_API_KEY = os.environ['FABMAN_API_KEY']
FABMAN_SPACE = os.environ['FABMAN_SPACE']
HOME = str(Path.home())
SLACK_WEBHOOK_URL = os.environ['SLACK_WEBHOOK_URL']

@scheduler.task('cron', id='get_staff_members', day='*', hour='4')
def get_staff_members():
    try:
        with requests.Session() as s:
            s.cert = (GROUPS_CERT, GROUPS_KEY)
            s.verify = GROUPS_ROOT
            r = s.get('https://iam-ws.u.washington.edu:7443/group_sws'
                      '/v3/group/{}/effective_member'.format(GROUP))
            fmt_time=time.strftime("%m-%d-%Y @ %H:%M%p")
            if r.status_code == 200:
                with open('{}{}members.pickle'.format(HOME, os.sep), 'wb') as f:
                    pickle.dump(r.json(), f, pickle.HIGHEST_PROTOCOL)
                print('{}, successfully fetched staff from UW Groups'
                      .format(fmt_time),file=sys.stderr)
                return '{}, successfully fetched staff from UW Groups'.format(fmt_time)
            else:
                print('{}, ERROR: could not fetch staff from UW Groups'
                      '\nPlease restart this container by turning the computer'
                      ' off and on again'
                      '\nAlso ensure there is an Internet connection &'
                      ' UW Groups API is up'
                      .format(fmt_time),file=sys.stderr)
                sys.exit(1)
    except Exception as e:
        print(e, file=sys.stderr)

@scheduler.task('cron', id='get_opening_hours', day='*', hour='5')
def get_opening_hours(**kwargs):
    count = kwargs.get('count', 0)
    headers = {'Accept': 'application/json',
               'Authorization': 'Bearer {}'.format(FABMAN_API_KEY)}
    r = requests.get('https://fabman.io/api/v1/spaces/{}/opening-hours'
                     .format(FABMAN_SPACE), headers=headers)
    if r.status_code == 200 and r.json():
        with open('{}{}hours.pickle'.format(HOME, os.sep), 'wb') as f:
            pickle.dump(r.json(), f, pickle.HIGHEST_PROTOCOL)
        print('Fetched opening hours', file=sys.stderr)
    elif count < 5:
        count += 1
        sleep_time = kwargs.get('sleep_time', 2)
        time.sleep(sleep_time)
        sleep_time = sleep_time**2
        get_opening_hours(count=count, sleep_time=sleep_time)
    else:
        print('Unable to call get_opening_hours',file=sys.stderr)

def post_slack(**kwargs):
    data = None
    netid = kwargs.get('netid', None)
    if netid:
        message = None
        if kwargs.get('checkin', None):
            message = 'checking-in!'
        if kwargs.get('checkout', None):
            message = 'checking-out!'
        data = {"text":"{} is {}".format(netid, message)}
    if kwargs.get('all_members', None):
        data = {"text":"All members checking out for MakerSpace closing time"}
    headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
    r = requests.post(SLACK_WEBHOOK_URL, data=json.dumps(data), headers=headers)

def staff_checkin(netid):
    ''' Determines what to do when a staff is checking in
        Also checks if the staff is checking in during opening hours'''
    # TODO: Add first name to this code
    # TODO: add hooks for test MSFT Teams bot here
    print('{} -> staff'.format(netid),file=sys.stderr)
    post_slack(netid=netid, checkin=True)
    return '{} -> staff'.format(netid)

def staff_checkout(**kwargs):
    netid = kwargs.get('netid', None)
    if not netid:
        all_staff = kwargs.get('all_staff', None)
        # TODO: add a condition here for if we have any staff/volunteers present in our pickle
        if all_staff:
            print('checking out out all staff')
            # TODO add hooks for checkout from MSFT Teams bot here
            post_slack(all_members=True)
        else:
            print('cannot call staff_checkout without keyword args', file=sys.stderr)
    else:
        # TODO add hooks for checkout from MSFT Teams bot here
        print('checking out {}'.format(netid), file=sys.stderr)
        post_slack(netid=netid, checkout=True)

@scheduler.task('cron', id='is_closing_time', minute='*')
def is_closing_time():
    '''Checks if it's closing time and if it is checkout all staff'''
    try:
        with open('{}{}hours.pickle'.format(HOME, os.sep), 'rb') as f:
            opening_hours = pickle.load(f)
        current = datetime.datetime.now()
        today = datetime.datetime.isoweekday(current)
        for d in opening_hours:
            if d['dayOfWeek'] == today:
                closing = datetime.datetime.strptime(d['untilTime'], '%H:%M')
                if (closing.hour - current.hour == 0) \
                and (closing.minute - current.minute == 0):
                # TODO: for closing hours they'll be checked out
                # but if the space is closed that day they won't be.
                    staff_checkout(all_staff=True)
    except (OSError, IOError):
        print('{} could not run is_closing_time.'
              '\nnow running get_opening_hours...'
              .format(time.strftime("%m-%d-%Y @ %H:%M%p")), file=sys.stderr)
        get_opening_hours()
        is_closing_time()

@app.route("/staff", methods=["POST"])
def is_staff_member(**kwargs):
    ''' Determines if the netid matches a netid in the list of staff '''
    try:
        count = kwargs.get('count', 0)
        if request.args.get('token') == FLASK_TOKEN:
            # get netid from previous call or request
            netid = kwargs.get('netid', None)
            if not netid:
                netid = request.get_json()['data']
            members = None
            try:
                with open('{}{}members.pickle'.format(HOME, os.sep), 'rb') as f:
                    members = pickle.load(f)
            except (OSError, IOError):
                if count > 5:
                    print('could not get data from UW Groups for netid {}'.format(netid),file=sys.stderr)
                else:
                    count += 1
                    sleep_time = kwargs.get('sleep_time', 2)
                    time.sleep(sleep_time)
                    sleep_time = sleep_time**2
                    get_staff_members()
                    is_staff_member(netid=netid, count=count, sleep_time=sleep_time)

            if members:
                if netid in \
                    [ m['id'] for m in members['data'] if m['type'] == 'uwnetid' ]:
                        return staff_checkin(netid)
                else:
                    print('{} -> not staff'.format(netid),file=sys.stderr)
                    return '{} -> not staff'.format(netid)

    except Exception as e:
        print('Could not verify staff member from a post request to /staff: {}\n{}'
              .format(request.values, e),file=sys.stderr)


if __name__ == '__main__':
    scheduler.init_app(app)
    scheduler.start()
    app.run(host='0.0.0.0', port=FLASK_PORT_STAFF)