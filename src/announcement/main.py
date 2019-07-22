import requests
import schedule
import pyttsx3 as pyttsx
import colorlog
import time
import os
import pickle
import json
import datetime
import logging

TRIGGER_AT_MINUTES = [
                      30,
                      45,
                      55,
                     ]

LOG_LEVEL = logging.INFO
LOG_FILENAME = 'closing_announcements.log'

API_KEY = os.environ['FABMAN_API_KEY']
SPACE = os.environ['FABMAN_SPACE']

# Logger
log = logging.getLogger()
log.setLevel(LOG_LEVEL) 

fmt = ("%(asctime)s %(levelname)s -> %(message)s")
datefmt = '%Y-%m-%d %H:%M:%S'
logging.basicConfig(level=LOG_LEVEL, filename=LOG_FILENAME, format=fmt, datefmt=datefmt)
logging.getLogger('schedule').setLevel(logging.WARNING)

# Color logger (only on terminal for now)
# logging.config.fileConfig(colorlog)

handler = colorlog.StreamHandler()
handler.setFormatter(colorlog.ColoredFormatter(
                    '%(log_color)s%(levelname)s:%(name)s:%(message)s'))
logger = colorlog.getLogger()
logger.addHandler(handler)

logging.info('program started')

def get_opening_hours():
    headers = {'Accept': 'application/json',
               'Authorization': 'Bearer {}'.format(API_KEY)}
    r = requests.get('https://fabman.io/api/v1/spaces/{}/opening-hours'
                     .format(SPACE), headers=headers)
    if r.status_code == 200 and r.json():
        with open('data.pickle', 'wb') as f:
            pickle.dump(r.json(), f, pickle.HIGHEST_PROTOCOL)
        logging.info('Fetching opening hours')
    else:
        logging.warning('Unable to fetch opening hours')

def announce_closing(minutes):
    engine = pyttsx.init()
    if minutes == 0:
        engine.say('Attention! CoMotion Makerspace is now closed.'
                   'Unless authorized, please pack your belongings and exit.'
                   'Thank you, and have a fantastic evening!')
        logging.info('Announced MakerSpace closed')
    else:
        minutes_to_close = 60 - minutes
        engine.say('Attention! CoMotion Makerspace will close in {} minutes.'.format(minutes_to_close))
        logging.info('Announced pre-closing time: {} minutes before'.format(minutes_to_close))
    engine.runAndWait()

def check_announcement_time():
    data = None
    try:
        with open('data.pickle', 'rb') as f:
            data = pickle.load(f)
    except (OSError, IOError):
        print('could not find closing time data'
              '\nnow running get_opening_hours')
        get_opening_hours()
    if data:
        current = datetime.datetime.now()
        today = datetime.datetime.isoweekday(current)
        for d in data:
            if d['dayOfWeek'] == today:
                closing = datetime.datetime.strptime(d['untilTime'], '%H:%M')
                # print('Closing @ {}:{}\nCurrent time is {}:{}'
                #       .format(closing.hour, closing.minute,
                #       current.hour, current.minute))
                
                # add edge case for first min of closing hour
                if closing.hour - current.hour == 0 or \
                (closing.hour + 1 - current.hour == 0 and current.minute == 0):
                    if current.minute in TRIGGER_AT_MINUTES or current.minute == 0:
                        announce_closing(current.minute)

def once():
    logging.info('running once time is {}'.format(time.strftime("%m-%d-%Y @ %H:%M%p")))
    engine = pyttsx.init()
    engine.say('Announcements are now active!')
    engine.runAndWait()
once()

schedule.every().day.at('03:00').do(get_opening_hours)
schedule.every().minute.at(':00').do(check_announcement_time)

while True:
    schedule.run_pending()
    time.sleep(1)