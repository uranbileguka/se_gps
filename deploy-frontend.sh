#!/bin/bash
# Deploy GPS Frontend - Run this ON YOUR SERVER

echo "🚀 Building GPS Frontend Docker Image..."

cd /home/ubuntu/apps/se_gps/frontend_gps

# Build the image
docker build -t gps_frontend:local .

# Tag it for use
docker tag gps_frontend:local gps_frontend:latest

echo "✅ Build complete!"
echo ""
echo "Now update docker-compose.yml to use: gps_frontend:latest"
echo "Then run: docker-compose up -d gps_frontend"
