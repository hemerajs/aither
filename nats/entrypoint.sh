#!/bin/sh

set -e

CONFIG_FILE="/etc/gnatsd.conf"

if [ -n "$NATS_CLUSTER_USER" ]; then
    sed -i "s/user: .*/user: $NATS_CLUSTER_USER/" $CONFIG_FILE
fi

if [ -n "$NATS_CLUSTER_PASSWORD" ]; then
    sed -i "s/password: .*/password: $NATS_CLUSTER_PASSWORD/" $CONFIG_FILE
fi

if [ -n "$NATS_CLUSTER_TIMEOUT" ]; then
    sed -i "s/timeout: .*/timeout: $NATS_CLUSTER_TIMEOUT/" $CONFIG_FILE
fi

if [ -n "$NATS_SERVICE_NAME" ]; then

    # get current IPs
    CURRENT_IP=`hostname -i | awk '{print $1}'`
    # fetch IPs from service members excepted CURRENT_IP
    CLUSTER_IPS=`nslookup tasks.$NATS_SERVICE_NAME | awk '{print $3}' | awk 'NF' | sed "/$CURRENT_IP/d"`

    # we check if we are the only/first node live
    if [ `echo "$CLUSTER_IPS" | wc -l` = 0 ]; then
        CLUSTER_ADDRESS="[]"
    else
        # format CLUSTER_IPS for use in nats
        CLUSTER_MEMBERS=`echo "$CLUSTER_IPS" | sed "s|.*|nats-route://$NATS_CLUSTER_USER:$NATS_CLUSTER_PASSWORD@&:6222|" | head -c -1 | tr '\n' ','`
        # we set cluster address with found service members
        CLUSTER_ADDRESS="[$CLUSTER_MEMBERS]"
    fi

    sed -i "s|routes = .*|routes = $CLUSTER_ADDRESS|" $CONFIG_FILE
fi

exec "$@"