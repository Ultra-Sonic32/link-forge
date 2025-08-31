# Use official Node.js image
FROM node:22.16.0

# Set working directory inside container
WORKDIR /app

# Copy only package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the server source code
COPY . .

# Expose server port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
