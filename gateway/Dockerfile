FROM node:16-alpine AS NIST

# Copy over the source
WORKDIR /usr/src/gateway
COPY . .
RUN apk update && \
    npm install && \
    npm run build

# Expose the endpoint
EXPOSE 3001

# Run the production build
CMD npm run start:prod
