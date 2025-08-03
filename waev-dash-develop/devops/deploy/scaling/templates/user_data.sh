#!/bin/bash

mkdir -p /etc/ecs

cat <<'EOF' >> /etc/ecs/ecs.config
ECS_CLUSTER=${cluster_name}
ECS_ENABLE_CONTAINER_METADATA=true
ECS_LOGLEVEL=debug
ECS_ENABLE_SPOT_INSTANCE_DRAINING=true
EOF

yum update -y

systemctl enable --now --no-block ecs.service
