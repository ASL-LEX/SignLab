FROM node:16-alpine AS signlab

# Copy over the source
WORKDIR /usr/src/signlab
COPY . .

# Install required packages and build for prod
RUN apk update && \
    npm install && \
    npm run build:prod

EXPOSE 3000

CMD npm run start:prod
