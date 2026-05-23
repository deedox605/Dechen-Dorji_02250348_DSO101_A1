FROM node:20-alpine

WORKDIR /app

# Copy backend package files from the correct path
COPY practical3/todo-app/backend/package*.json ./

# Install dependencies
RUN npm install

# Copy all backend files
COPY practical3/todo-app/backend/ ./

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]