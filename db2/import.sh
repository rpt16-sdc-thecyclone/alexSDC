#!/bin/bash
# Need to do above bin bash so file knows to run as bash
# remember chmod +x file to give execute permission
# looks like so long as we call import.sh in /alexSDC, not /alexSDC/db2 the cwd is alexSDC so --file will work.
# run the script w/ ./db2/import.sh
echo "MongoImport shell script"
mongoimport --db=review1 --collection=productsTable --type=csv --fields=id,name,productCondition,seller,prop1,prop2,prop3 --file=./productsTable.csv
mongoimport --db=review1 -c=productsTable --type=csv --fields=id,name,productCondition,seller,prop1,prop2,prop3 --file=./productsTable2.csv
echo "productTable finished"
mongoimport --db=review1 -c=reviewFeedback --type=csv --fields=id,reviewId,userId,isHelpful --file=./reviewFeedbackCSV.csv
echo "reviewFeedback finished"
mongoimport --db=review1 -c=userTable --type=csv --fields=id,names --file=./userTable.csv
echo "userTable finished"
mongoimport --db=review1 -c=reviewTable --type=csv --fields=id,ratings,title,description,report,isProductPropGood1Good,isProductPropGood2Good,isProductPropGood3Good,created_on,userId,productId --file=./reviewTable1.csv
mongoimport --db=review1 -c=reviewTable --type=csv --fields=id,ratings,title,description,report,isProductPropGood1Good,isProductPropGood2Good,isProductPropGood3Good,created_on,userId,productId --file=./reviewTable2.csv
mongoimport --db=review1 -c=reviewTable --type=csv --fields=id,ratings,title,description,report,isProductPropGood1Good,isProductPropGood2Good,isProductPropGood3Good,created_on,userId,productId --file=./reviewTable3.csv
mongoimport --db=review1 -c=reviewTable --type=csv --fields=id,ratings,title,description,report,isProductPropGood1Good,isProductPropGood2Good,isProductPropGood3Good,created_on,userId,productId --file=./reviewTable4.csv
mongoimport --db=review1 -c=reviewTable --type=csv --fields=id,ratings,title,description,report,isProductPropGood1Good,isProductPropGood2Good,isProductPropGood3Good,created_on,userId,productId --file=./reviewTable5.csv
mongoimport --db=review1 -c=reviewTable --type=csv --fields=id,ratings,title,description,report,isProductPropGood1Good,isProductPropGood2Good,isProductPropGood3Good,created_on,userId,productId --file=./reviewTable6.csv
echo "finished reviews and all importing"