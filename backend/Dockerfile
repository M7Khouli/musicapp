FROM ubuntu:latest

# Install required dependencies
RUN apt-get update && \
    apt-get install -y curl

# Install NVM
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Add NVM executable directory to the PATH
ENV NVM_DIR /root/.nvm
ENV PATH $NVM_DIR/versions/node/v$(cat $NVM_DIR/alias/default)/bin:$PATH

# Load NVM on bash shell startup
RUN echo 'source $NVM_DIR/nvm.sh' >> /root/.bashrc

# Set default Node.js version
ENV NODE_VERSION 18.16.0
RUN /bin/bash -c "source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm alias default $NODE_VERSION"

# Specify compatible npm version for Node.js 18.16.0
ENV NPM_VERSION 9.5.1
RUN /bin/bash -c "source $NVM_DIR/nvm.sh && npm install -g npm@$NPM_VERSION"


# Install any Ubuntu packages you need
RUN apt-get update && \
    apt-get install -y libchromaprint-tools 

# Install nodemon using NPM
RUN /bin/bash -c "source $NVM_DIR/nvm.sh && npm install -g nodemon"

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json
COPY package.json ./

# Install project dependencies
RUN /bin/bash -c "source $NVM_DIR/nvm.sh && npm install"

# Copy the rest of the application code
COPY . .

# Expose the port your app will run on
EXPOSE 3000

# Command to run your Node.js application
CMD ["/bin/bash", "-c", "source $NVM_DIR/nvm.sh && node server.js"]