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
echo scping
scp oppettidr.tar.gz oppettidr.se:~
