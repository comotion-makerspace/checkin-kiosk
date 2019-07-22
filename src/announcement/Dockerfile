FROM alpine:latest

RUN apk add --update --no-cache \ 
    python3-dev \
    gcc \
    build-base \
    espeak \
 && pip3 install --upgrade pip

WORKDIR /home/announcement

COPY . /home/announcement

RUN pip3 --no-cache-dir install -r requirements.txt

# RUN set -x \
#     && adduser -h /home/announcement -D -u 6739 announcement

# USER announcement
# ENV USER=announcement

ENTRYPOINT [ "python3" ]
CMD ["main.py"]