#!/bin/bash

#remember to chmod +x
echo 'Cassandra Copy Loading'
cqlsh -k review1 -e "
COPY userTable (id,names) FROM './userTable.csv' WITH HEADER = FALSE;
COPY productTable (id,name,productCondition,seller,prop1,prop2,prop3) FROM './productsTable.csv' WITH HEADER = FALSE;
COPY productTable (id,name,productCondition,seller,prop1,prop2,prop3) FROM './productsTable2.csv' WITH HEADER = FALSE;
COPY reviewFeedbackTable (id,reviewId,userId,isHelpful) FROM './reviewFeedbackCSV.csv' WITH HEADER = FALSE;
COPY reviewTable (id,ratings,title,description,report,isProductPropGood1Good,isProductPropGood2Good,isProductPropGood3Good,created_on,userId,productId) FROM './reviewTable1.csv' WITH HEADER = FALSE;
COPY reviewTable (id,ratings,title,description,report,isProductPropGood1Good,isProductPropGood2Good,isProductPropGood3Good,created_on,userId,productId) FROM './reviewTable2.csv' WITH HEADER = FALSE;
COPY reviewTable (id,ratings,title,description,report,isProductPropGood1Good,isProductPropGood2Good,isProductPropGood3Good,created_on,userId,productId) FROM './reviewTable3.csv' WITH HEADER = FALSE;
COPY reviewTable (id,ratings,title,description,report,isProductPropGood1Good,isProductPropGood2Good,isProductPropGood3Good,created_on,userId,productId) FROM './reviewTable4.csv' WITH HEADER = FALSE;
COPY reviewTable (id,ratings,title,description,report,isProductPropGood1Good,isProductPropGood2Good,isProductPropGood3Good,created_on,userId,productId) FROM './reviewTable5.csv' WITH HEADER = FALSE;
COPY reviewTable (id,ratings,title,description,report,isProductPropGood1Good,isProductPropGood2Good,isProductPropGood3Good,created_on,userId,productId) FROM './reviewTable6.csv' WITH HEADER = FALSE;
"
echo 'finished loading'
