#!/bin/bash
cd /home/robert/oppettidr/root/console
./yiic xyz bolagetApi
./yiic cron deleteOldOpenHours
./yiic nordea
./yiic xyz swedbank
./yiic lidl