FROM node:20.12.2
WORKDIR /usr/src/app

COPY . .
WORKDIR /usr/src/app/Backend
RUN npm install

EXPOSE 5173

CMD ["npm","run","dev"]



