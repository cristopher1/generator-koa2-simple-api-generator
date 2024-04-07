# Base image. This image is not deterministic. A deterministic image use syntax like the following:
# node:16.13.2@sha256:2033f4cc18f9d8b5d0baa7f276aaeffd202e1a2c6fe9af408af05a34fe68cbfb
# See: https://candrews.integralblue.com/2023/09/always-use-docker-image-digests/
FROM node:<%- nodeVersion %> AS base

# Image used in development stage
FROM base AS development

# Install development tools, for example nano
RUN apt-get update && apt-get install -y \
    nano

# Set current work directory
WORKDIR /usr/src/<%- projectFolderName %>

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies using package.json and package-lock.json
RUN npm ci

# Copy all elements into the created project to the image's filesystem
COPY . ./

# Default port
EXPOSE 3000

# Entrypoint
ENTRYPOINT [ "./docker-entrypoint.sh" ]

# Run the API
CMD [ "npm", "run", "dev" ]
