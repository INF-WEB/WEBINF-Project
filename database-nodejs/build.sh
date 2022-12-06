#!/bin/bash
#cd ../
pwd
echo "===== deleting previously compiled typescript ====="
rm -r -f js
echo "===== compiling typescript files ===== "
tsc *.ts --outDir js
#--module system  --outFile o.js
echo "===== removing temporary db files ===== "
rm -f /Users/matiesclaesen/Documents/repos/WEBINF-Project/database-nodejs/database/*
echo "===== starting debug session ===== "
node --inspect js/database.js