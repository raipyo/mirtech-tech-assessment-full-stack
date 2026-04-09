FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy everything else including pages, components, utils
COPY . .

# Expose port and start
EXPOSE 3000
CMD ["npm", "run", "dev"]