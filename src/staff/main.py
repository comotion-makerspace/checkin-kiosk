import requests
import schedule
import time
import os

groups_cert = os.environ['GROUPS_CERT']
groups_key = os.environ['GROUPS_KEY']
groups_root = os.environ['GROUPS_CERT_ROOT']
group = os.environ['GROUPS_GROUP']

def get_staff_members(netid):
    if netid in [ m['id'] for m in members['data'] \
    if m['type'] == 'uwnetid' ]:
        checkin(netid)


schedule.every().day.at("4:00").do(get_staff_members)
schedule.every(5).minutes.do(job)

while True:
    schedule.run_pending()
    time.sleep(60)