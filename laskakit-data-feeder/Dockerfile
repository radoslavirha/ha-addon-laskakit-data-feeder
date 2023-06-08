ARG BUILD_FROM
FROM $BUILD_FROM

LABEL maintainer="radoslav.irha@gmail.com"

ENV LANG C.UTF-8

WORKDIR /home/app

RUN apk add --no-cache \
    nodejs \
    yarn \
    vips-dev \
    python3 make g++
RUN yarn global add node-gyp

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]