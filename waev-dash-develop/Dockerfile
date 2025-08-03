FROM node:18

# set the working directory
WORKDIR /usr/src/app

# copy over the context
COPY . .

# install the dependencies
RUN npm install --legacy-peer-deps

# run the server
CMD ["npm", "start"]
