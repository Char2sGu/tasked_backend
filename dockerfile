FROM node:15-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src/ src/
RUN npm run build \
    && DB_PATH=data/db.sqlite3 npm run start-db:prod init


FROM node:15-alpine AS production
EXPOSE 3000
VOLUME /app/data
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i --production
COPY --from=build /app/dist/ dist/
COPY --from=build /app/data/ data/
CMD npm run start:prod
