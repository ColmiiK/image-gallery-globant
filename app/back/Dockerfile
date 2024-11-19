FROM node:latest
WORKDIR /usr/src/app
COPY . .
WORKDIR js
RUN npm install
EXPOSE 5000
CMD ["node", "api.js"]
