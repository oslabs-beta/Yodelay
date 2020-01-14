FROM node:13.5.0
WORKDIR /usr/src/app
COPY . .
RUN npm i
EXPOSE 4000
CMD ["npm", "start"]
