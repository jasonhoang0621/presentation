FROM node:16 AS source-image
WORKDIR /app

COPY . .
RUN yarn install

RUN yarn build
FROM socialengine/nginx-spa:latest

COPY --from=source-image /app/build /app
RUN chmod -R 777 /app
EXPOSE 80