FROM registry.redhat.io/ubi8/nodejs-14

ARG BUILD_COMMIT=unknown

WORKDIR /opt/app-root/src

COPY package.json package-lock.json /opt/app-root/src/

RUN npm ci --only=production --ignore-scripts

COPY . /opt/app-root/src

RUN npm i typescript@4.3.5 && npm run compile

EXPOSE 4000
ENV NODE_ENV=production \
    BUILD_COMMIT=${BUILD_COMMIT}

CMD [ "node", "dist/src/app.js" ]
