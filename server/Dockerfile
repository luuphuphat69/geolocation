# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory inside the container to the app's folder
WORKDIR /server

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's code into the container
COPY . .

# Expose the port that the Vite development server will run on
EXPOSE 3000

# Start the Vite development server
CMD ["npm", "start"]