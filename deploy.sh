#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
cd $DIR
echo deleting /tmp/oppettidr
rm -rf /tmp/oppettidr /tmp/oppettidr.tar.gz
echo running hg archive
hg archive /tmp/oppettidr
cd /tmp
echo compressing
tar zcvf oppettidr.tar.gz oppettidr
echo creating tunnel
ssh -f 10.100.100.1 -L 22222:83.233.254.203:22 -N
echo scping
scp -P 22222 oppettidr.tar.gz localhost:~