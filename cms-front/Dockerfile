# Use official Node.js image
FROM node:20

# Set working directory in container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose port
EXPOSE 3000

# Command to start the app
CMD ["npm", "run", "start:dev"]
