## Angular Builder
FROM node:18-alpine as builder

WORKDIR /app
COPY . .

# Take in build arguments
ARG PRODUCTION
ARG GRAPHQL_ENDPOINT
ARG ASL_LEX_ID

ENV PRODUCTION ${PRODUCTION}
ENV GRAPHQL_ENDPOINT ${GRAPHQL_ENDPOINT}
ENV ASL_LEX_ID ${ASL_LEX_ID}

# Build code
RUN npm install &&\
    npm run build:prod

## NGINX Server
FROM nginx:1.25-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["/bin/bash", "-c", "nginx -g 'daemon off;'"]
