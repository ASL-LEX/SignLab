FROM node:18-alpine AS signlab

# Copy over the source
WORKDIR /app/
COPY . .

# Install required packages and build for prod
RUN npm install && \
    npm run build:prod --workspace=server

EXPOSE 3000

CMD npm run start:prod --workspace=server
