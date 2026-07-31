# frontend/Dockerfile
# ====================
# Builds a Docker image for the React frontend (development mode)

FROM node:20-alpine

WORKDIR /app

# Copy package files first (for Docker layer caching)
COPY package.json .

# Install npm packages
RUN npm install

# Copy all frontend code
COPY . .

EXPOSE 3000

# Start the Vite development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
