# Use Node.js base image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install
RUN npm install web-vitals


# Copy application code
COPY . .

# Expose the port and start the app
EXPOSE 3000
CMD ["npm", "start"]
