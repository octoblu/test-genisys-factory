FROM node:7
MAINTAINER Octoblu, Inc. <docker@octoblu.com>

ENV NPM_CONFIG_LOGLEVEL error
HEALTHCHECK CMD curl --fail http://localhost:80/healthcheck || exit 1

EXPOSE 80

RUN mkdir -p /usr/src/test-smart-spaces/config; mkdir -p /usr/src/test-smart-spaces/lib; mkdir -p /usr/src/test-smart-spaces/config/test
WORKDIR /usr/src/test-smart-spaces

COPY package.json /usr/src/test-smart-spaces
RUN npm -s install --production
COPY . /usr/src/test-smart-spaces/

CMD [ "npm", "test" ]
