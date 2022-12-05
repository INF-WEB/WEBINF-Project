# FROM node:latest

# WORKDIR '/app'

# COPY package.json .
# COPY tsconfig.json .

# ENV NODE_TLS_REJECT_UNAUTHORIZED 0

# RUN npm install

# COPY . .

# CMD ["npm", "start"]

FROM ubuntu:latest

RUN apt update && apt install -y default-jdk

RUN apt install -y curl
#RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
#RUN command -v nvm
#CMD ["nvm" "install --lts"]
RUN apt install -y nodejs
RUN apt install -y npm

COPY package.json .
COPY tsconfig.json .

ENV NODE_TLS_REJECT_UNAUTHORIZED 0

RUN npm install

COPY . .
CMD ["npm", "start"]
#CMD ["nvm" "install --lts"]
