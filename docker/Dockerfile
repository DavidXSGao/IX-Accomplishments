# Use standard nodejs v8
FROM node:8

# Expose port 9001 which will be used to serve react app
EXPOSE 9001

# Expose port 9002 which will be used to serve react app server
EXPOSE 9002

# Set working directory to be /src inside container
WORKDIR /ix-accomplishments

# Copy application into /src directory of container
COPY / /ix-accomplishments

# Build time scripts. Each time src/data or package.json is modified
# docker-compose -f workstation.yaml build --no-cache
# needs to be run
RUN \
	npm install && \
	node scripts/createSeedUsers.js && \
	node scripts/generateImageUrl.js && \
	node scripts/renameImages.js
