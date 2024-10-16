FROM node:20.12.2
WORKDIR /usr/src/app

COPY . .
WORKDIR /usr/src/app/Backend
RUN npm install

EXPOSE 3000
RUN apt-get update && apt-get install -y ffmpeg

CMD ["npm","run","build"]
WORKDIR /usr/src/app/Backend/dist
RUN ls
CMD ["node","index.js"]



