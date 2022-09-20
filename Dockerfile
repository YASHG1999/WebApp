FROM node:16
MAINTAINER Node Backend Team
WORKDIR /auth-service/src/app
COPY . .
RUN npm install
RUN npm run build
CMD [ "node", "dist/src/main" ]
