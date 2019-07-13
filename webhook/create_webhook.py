import os
import sys
import requests
import json
import time
from datetime import datetime
from pytz import timezone


API_KEY = os.environ['FABMAN_API_KEY']
SPACE = os.environ['FABMAN_SPACE']
FLASK_TOKEN = os.environ['FLASK_TOKEN_NGROK']

def get_tunnel_url(count):
    tunnel_url = None
    while count < 10:
        try:
            count += 1
            r = requests.get(os.environ['GET_TUNNEL_URL'])
            if r.status_code == 200:
                tunnel_url = r.json()['public_url']
                break
        except Exception:
            print('Could not connect to tunnel server! Retrying in ten seconds.')
            time.sleep(10)
            continue
    return tunnel_url
    
def delete_previous_webhooks(headers):
    ''' Deletes previous, now unused, webhooks used at the front desk via Fabman API '''
    r = requests.get('https://fabman.io/api/v1/webhooks', headers=headers)
    data = r.json()
    for w in data:
        try:
            if w['notes'] == 'FRONT_DESK_WEBHOOK':
                r = requests.delete('https://fabman.io/api/v1/webhooks/{}'.format(w['id']), headers=headers)
        except KeyError:
            print('Could not grab or parse webhook json from Fabman API')

def create_new_webhook(tunnel_url, headers):
    ''' Creates a new webhook for the front desk via Fabman API '''
    la_tz = timezone('America/Los_Angeles')
    sea_time = datetime.now(la_tz)
    data = {'account': SPACE,
            'url': '{}/webhook?token={}'.format(tunnel_url,FLASK_TOKEN),
            'label': 'prod. - front desk check-in - generated {}'.format(sea_time.strftime("%m-%d-%Y @ %H:%M%p")),
            'notes': 'FRONT_DESK_WEBHOOK',
            'state': 'active',
            'categories': ['resourceLog'],
            }
    r = requests.post('https://fabman.io/api/v1/webhooks', json=json.dumps(data), headers=headers)
    return r.status_code == 201


def main():
    tunnel_url = get_tunnel_url(0)
    headers = {'Accept': 'application/json',
               'Authorization': 'Bearer {}'.format(API_KEY)}
    if tunnel_url:
        delete_previous_webhooks(headers)
        if create_new_webhook(tunnel_url, headers):
            print('Success! Fabman webhook updated.')
        else:
            print('Could not update fabman webhook. There is a problem.')
            sys.exit(1)
    else:
        print('Could not get a URL from the tunnel to create fabman webhook; \
Please check that the tunnel is up and try again.')

main()