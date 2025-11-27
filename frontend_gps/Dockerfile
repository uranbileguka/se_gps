# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with cache mount for faster rebuilds
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit

# Copy source code
COPY . .

# Build with Vite (outputs to 'dist' folder)
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from Vite build (dist folder)
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
