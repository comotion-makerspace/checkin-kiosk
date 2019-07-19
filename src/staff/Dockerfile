FROM alpine:latest

RUN apk add --update --no-cache \ 
    python3-dev \
    gcc \
    build-base \
    tzdata \
 && pip3 install --upgrade pip

WORKDIR /home/staff

COPY . /home/staff

RUN pip3 --no-cache-dir install -r requirements.txt

RUN set -x \
    && adduser -h /home/flask -D -u 6741 staff

USER staff
ENV USER=staff

EXPOSE 5001

ENTRYPOINT [ "python3" ]
CMD ["main.py"]