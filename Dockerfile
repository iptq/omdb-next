FROM node:18
ENV NEXT_TELEMETRY_DISABLED=1

RUN mkdir /app
WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
RUN npm ci

COPY . /app
RUN npm run build