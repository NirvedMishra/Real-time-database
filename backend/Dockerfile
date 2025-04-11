# Use official Node.js LTS
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY . .

# Expose the port your app listens on
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
