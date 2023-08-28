## Angular Builder
FROM node:18-alpine as builder

# NOTE: Building has to take place at the top level due to the use of the
#       shared package. In the future, when the shared package is no longer
#       needed, building can take place directly in the client package
WORKDIR /app/
COPY . .

# Take in build arguments
ARG PRODUCTION
ARG GRAPHQL_ENDPOINT
ARG ASL_LEX_ID

ENV PRODUCTION ${PRODUCTION}
ENV GRAPHQL_ENDPOINT ${GRAPHQL_ENDPOINT}
ENV ASL_LEX_ID ${ASL_LEX_ID}

# Build code
RUN npm install --force &&\
    npm run build:prod

## NGINX Server
FROM nginx:1.25-alpine

COPY client/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/client/dist /usr/share/nginx/html

CMD ["/bin/bash", "-c", "nginx -g 'daemon off;'"]
