# Use Node 22 LTS
FROM node:22

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Generate Prisma client (if using Prisma)
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expose port your app listens on
EXPOSE 3000

# Start the app
CMD ["node", "dist/server.js"]
