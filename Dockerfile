######################### Build the Angular Client ############################
FROM node:18-alpine AS angular-builder
WORKDIR /usr/src/client
COPY client ./

# Install npm packages and compile the Angular code
RUN npm install @angular/cli && npm install && npm run build
###############################################################################


########################## Setup the Server ###################################
FROM node:18-alpine AS signlab

# Copy over the server source to the container
WORKDIR /usr/src/signlab
COPY . /usr/src/signlab/

# Copy over the build Angular code
COPY --from=angular-builder /usr/src/dist/ ./dist
RUN apk update

#Needed to connect to MongoDB
RUN apk add netcat-openbsd
RUN cd server && npm install

EXPOSE 9000

CMD sh docker_run.sh
