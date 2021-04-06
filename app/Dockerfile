##################################BUILDER#########################################
FROM node

RUN \
    mkdir -p /app

COPY package*.json /app/

WORKDIR /app/

RUN \
    npm install

COPY . .

ARG CHANNEL_ID
ARG TOKEN
RUN \
    sed -i "s#__CHANNEL_ID__#${CHANNEL_ID}#g" ./dist/configuration.js && \
    sed -i "s#__TOKEN__#${TOKEN}#g" ./dist/configuration.js

EXPOSE 3000

CMD ["node", "./dist/app"]