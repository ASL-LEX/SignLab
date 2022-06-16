######################### Build the Angular Client ############################
FROM node:16-alpine AS angular-builder
WORKDIR /usr/src/client
COPY client ./

# Install npm packages and compile the Angular code
RUN npm install @angular/cli && npm install && npm run build
###############################################################################


########################## Setup the Server ###################################
FROM node:8 AS signlab

# Copy over the server source to the container
WORKDIR /usr/src/signlab
COPY . /usr/src/signlab/

# Copy over the build Angular code
COPY --from=angular-builder /usr/src/dist/ ./dist
RUN apt-get update

#Needed to connect to MongoDB
RUN apt-get install -y netcat
RUN npm install

EXPOSE 9000

CMD sh docker_run.sh
