FROM node:lts-alpine
WORKDIR /srv/app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 8080
CMD ["node", "build/index.js"]