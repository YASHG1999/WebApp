FROM node:16
MAINTAINER Node Backend Team
WORKDIR /auth-service/src/app
COPY . .
RUN npm install
RUN npx prisma migrate deploy --preview-feature
RUN npm run build
CMD [ "node", "dist/main" ]
