FROM alpine:latest

RUN apk add --update --no-cache \ 
    python3-dev \
 && pip3 install --upgrade pip

WORKDIR /home/webhook

COPY . /home/webhook

RUN pip3 --no-cache-dir install -r requirements.txt

RUN set -x \
    && adduser -h /home/webhook -D -u 6739 webhook

USER webhook
ENV USER=webhook

ENTRYPOINT [ "python3" ]
CMD ["main.py"]