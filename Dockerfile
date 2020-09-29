FROM node:10
WORKDIR /usr/snk/app
COPY ./build .
EXPOSE 3000
CMD ["node", "index.js"]