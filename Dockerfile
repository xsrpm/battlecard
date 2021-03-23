FROM node:lts-alpine3.13 AS builder
WORKDIR /srv/app
COPY . .
RUN npm install
RUN npm run build
FROM nginx:alpine
LABEL maintainer="xsrpm"
COPY --from=builder /srv/app/dist /usr/share/nginx/html