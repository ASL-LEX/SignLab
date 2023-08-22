FROM node:18-alpine AS signlab

ARG PRODUCTION
ARG GRAPHQL_ENDPOINT
ARG ASL_LEX_ID

ENV PRODUCTION ${PRODUCTION}
ENV GRAPHQL_ENDPOINT ${GRAPHQL_ENDPOINT}
ENV ASL_LEX_ID ${ASL_LEX_ID}

# Copy over the source
WORKDIR /usr/src/signlab
COPY . .

# Install required packages and build for prod
RUN apk update && \
    npm install && \
    npm run build:prod

EXPOSE 3000

CMD npm run start:prod
