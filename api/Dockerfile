FROM node:lts-alpine
WORKDIR /srv/app
COPY . .
RUN npm install
EXPOSE 8080
CMD ["node", "src/index.js"]