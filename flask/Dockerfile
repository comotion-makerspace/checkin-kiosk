FROM alpine:latest

RUN apk add --update --no-cache \ 
    python3-dev \
    gcc \
    build-base \
 && pip3 install --upgrade pip

WORKDIR /app

COPY . /app

RUN pip3 --no-cache-dir install -r requirements.txt

ENV APP_SETTINGS=/app/.macs_flask_server.cfg

# USER app
# ENV USER=app

EXPOSE 5000

ENTRYPOINT [ "python3" ]
CMD ["main.py"]