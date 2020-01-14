# we are deploying using node.js version 10.16
FROM node:10.16.0
# our image will install our app at this location in the container
WORKDIR /usr/src/app
# it will copy or file structure into the container at the /usr/src/app location
COPY . .
# install all of our dependencies:
RUN npm install
# open our port to 4000 for the applicaiton to run:
EXPOSE 4000
# once everythign is installed into the container we run npm start to start our express server:
CMD ["npm", "run", "aws"]