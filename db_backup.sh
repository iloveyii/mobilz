cd /home/db_backup
mobilz=mobilz_$(date +"%m_%d_%Y").sql
mysqldump -uroot -proot mobilz > $mobilz
gzip -f $mobilz

softhem_blog=softhem_blog_$(date +"%m_%d_%Y").sql
mysqldump -uroot -proot softhem_blog > $softhem_blog
gzip -f $softhem_blog

oppettidr=oppettidr_$(date +"%m_%d_%Y").sql
mysqldump -uroot -proot oppettidr > $oppettidr
gzip -f $oppettidr

umeaservice=umeaservice_$(date +"%m_%d_%Y").sql
mysqldump -uroot -proot 4umeaservice > $umeaservice
gzip -f $umeaservice
