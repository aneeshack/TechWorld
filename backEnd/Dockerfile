# Use Node.js as the base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose port 8000 (your backend port)
EXPOSE 8000

# Set environment variable for production
ENV NODE_ENV=production

# Start the application with nodemon for development
CMD ["npm", "start"]
