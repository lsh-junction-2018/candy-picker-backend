#!/bin/bash
# My first script

cp -R ../candy-picker-frontend/build/* deploy/public

cd deploy

gcloud app deploy

spawn gcloud app deploy # Replace with your command.
expect "Do you want to continue (Y/n)?" { send "Y\r" }

rm -rf ../dist
rm -rf ../deploy