#!/bin/bash

npm run build
cd build
mv index.html index.php
rsync -a . root@treepadcloud.com:/var/www/treepadcloud.com/curBuild
