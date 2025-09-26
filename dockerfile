# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (leverage Docker cache)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your code
COPY . .

# Expose port (matches server.js)
EXPOSE 8000

# Set environment variables at runtime
ENV NODE_ENV=production

# Start your backend
CMD ["node", "src/server.js"]
