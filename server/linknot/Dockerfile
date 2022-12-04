FROM node:latest

WORKDIR '/app'

COPY package.json .
COPY tsconfig.json .

ENV NODE_TLS_REJECT_UNAUTHORIZED 0

RUN npm install

COPY . .

CMD ["npm", "start"]
