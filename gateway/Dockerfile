FROM node:18-alpine

# Copy over the source
WORKDIR /usr/src/gateway
COPY . .
RUN npm install && \
    npm run build

# Expose the endpoint
EXPOSE 3002

# Run the production build
CMD npm run start:prod
