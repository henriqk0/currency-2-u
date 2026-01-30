#!/bin/sh

# waits mongo accept simple connections
until mongosh --host mongo --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
  echo "Waiting MongoDB..."
  sleep 2
done

# starts replica set only if it doesn't exist
cfg=$(mongosh --host mongo --quiet --eval "try { rs.conf() } catch(e) { print('NO_CONFIG') }")
if echo "$cfg" | grep -q "NO_CONFIG"; then
  echo "Initializing Replica Set..."
  mongosh --host mongo --eval 'rs.initiate({_id:"rs0", members:[{_id:0, host:"mongo:27017"}]})'
else
  echo "Replica Set already initialized"
fi
