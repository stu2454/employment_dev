# Use Node.js base image
FROM node:16

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./

#Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port and start the server
EXPOSE 5005

#command to start the server
CMD ["node", "server.js"]

