# syntax=docker/dockerfile:1.0.0-experimental

FROM node:14.17.4-alpine3.14 as build-stage

WORKDIR /app

RUN apk update && apk add yarn python3 py3-pip g++ make

COPY package.json ./

RUN yarn install

COPY . .

RUN yarn run build

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
