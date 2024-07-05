#!/bin/sh
while true; do
  java -jar /app/app.jar
  # Sleep for a while before attempting to restart the JAR
  sleep 10
done
