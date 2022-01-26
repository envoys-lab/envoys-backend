ARG NODE_VERSION=16-alpine3.14
FROM node:${NODE_VERSION} AS build

WORKDIR /usr/src/app
COPY . .

RUN npm install
RUN npm run build

FROM node:${NODE_VERSION} AS runtime

RUN apk update && apk upgrade

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/app

COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/package-lock.json ./

RUN npm install --only=production

COPY --from=build /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
