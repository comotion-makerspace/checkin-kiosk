import requests
import schedule
import time
import os

groups_cert = os.environ.get['GROUPS_CERT']
groups_key = os.environ.get['GROUPS_KEY']
groups_root = os.environ.get['GROUPS_CERT_ROOT']


schedule.every().day.at("10:30").do(job)
schedule.every(5).minutes.do(job)

while True:
    schedule.run_pending()
    time.sleep(60)