# Use official Node.js 18 image on Alpine Linux
# Alpine = small (~170MB), secure, production-ready
FROM node:18-alpine

# Set working directory inside container
# All subsequent commands run from /app
WORKDIR /app

# Copy package files FIRST (for layer caching)
# Dependencies change rarely — cache this layer so
# code changes don't trigger a full npm reinstall
COPY package*.json ./

# Install dependencies using npm ci (clean install)
# npm ci = deterministic, faster, designed for CI/Docker
RUN npm ci

# Copy application source code
# Comes AFTER npm ci so code changes don't bust the dependency cache
COPY . .

# Expose port 5000
# Documents which port the app listens on inside the container
EXPOSE 5000

# Command to start the server
CMD ["node", "server.js"]
