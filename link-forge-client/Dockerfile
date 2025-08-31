# Build Stage
FROM node:20.19.0 AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build Angular app
COPY . .
RUN npm run build

# Production Stage
FROM node:20.19.0-alpine
WORKDIR /app

# Serve Angular app using http-server
RUN npm install -g http-server
COPY --from=builder /app/dist/link-forge-client /app/dist

EXPOSE 4200
CMD ["http-server", "dist", "-p", "4200", "-c-1"]
