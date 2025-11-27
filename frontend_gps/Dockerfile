# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with memory limit and cache mount
RUN --mount=type=cache,target=/root/.npm \
    NODE_OPTIONS="--max-old-space-size=2048" npm ci --prefer-offline --no-audit --omit=dev

# Copy source code
COPY . .

# Build with Vite (outputs to 'dist' folder) with memory limit
RUN NODE_OPTIONS="--max-old-space-size=2048" npm run build

# Production stage
FROM nginx:alpine

# Copy built files from Vite build (dist folder)
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
