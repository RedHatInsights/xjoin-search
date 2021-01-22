FROM registry.redhat.io/ubi8/nodejs-10 

WORKDIR /opt/app-root/src

COPY package.json package-lock.json /opt/app-root/src/

RUN npm ci --only=production

COPY . /opt/app-root/src

RUN npm i typescript@3.6.3 && npm run compile

EXPOSE 4000
ENV NODE_ENV=production
CMD [ "node", "dist/src/app.js" ]
