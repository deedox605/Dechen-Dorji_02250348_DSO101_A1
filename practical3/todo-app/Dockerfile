# Use Node.js LTS on Alpine Linux for small image size
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all application files
COPY . .

# Run tests during build (optional but recommended)
RUN npm test || true

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]