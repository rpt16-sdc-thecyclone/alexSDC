FROM node:12-slim
WORKDIR /vaishu-service
COPY ./package.json ./ 
RUN npm install
COPY . .
# EXPOSE 3004
COPY wait-for-it.sh /wait-for-it.sh
# CMD ["npm", "run", "docker-build"]
RUN chmod +x ./wait-for-it.sh
