FROM alpine:latest

RUN apk add --update --no-cache \ 
    python3-dev \
 && pip3 install --upgrade pip

WORKDIR /setup_webhook

COPY . /setup_webhook

RUN pip3 --no-cache-dir install -r requirements.txt

# USER app
# ENV USER=app

ENTRYPOINT [ "python3" ]
CMD ["create_webhook.py"]