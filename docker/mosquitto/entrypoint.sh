#!/bin/sh
set -e

sed -e "s/__MQTT_REMOTE_HOST__/$MQTT_REMOTE_HOST/g" \
    -e "s/__MQTT_REMOTE_PORT__/$MQTT_REMOTE_PORT/g" \
    -e "s/__MQTT_REMOTE_USER__/$MQTT_REMOTE_USER/g" \
    -e "s/__MQTT_REMOTE_PASS__/$MQTT_REMOTE_PASS/g" \
    /mosquitto/config/mosquitto.conf.template > /tmp/mosquitto.conf

exec mosquitto -c /tmp/mosquitto.conf
