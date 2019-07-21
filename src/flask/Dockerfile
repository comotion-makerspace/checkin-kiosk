FROM alpine:latest

RUN apk add --update --no-cache \ 
    python3-dev \
    gcc \
    build-base \
 && pip3 install --upgrade pip

WORKDIR /home/flask

COPY . /home/flask

RUN pip3 --no-cache-dir install -r requirements.txt

RUN set -x \
    && adduser -h /home/flask -D -u 6738 flask

USER flask
ENV USER=flask

EXPOSE 5000

ENTRYPOINT [ "python3" ]
CMD ["main.py"]