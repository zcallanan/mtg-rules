FROM node:16-alpine3.14

# Expose port 3000
EXPOSE 3000

WORKDIR /usr/src/app

# Copy project
COPY . .

# Install packages
RUN npm install

# Create prod build
RUN npm run build

# Start next server
CMD npm run start
