ARG proxy=


FROM node:15-alpine AS build
WORKDIR /app
COPY package.json package-lock.json tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src/ src/
ARG proxy
RUN npm config set proxy=${proxy} \
    && npm i \
    && npm run build


FROM node:15-alpine AS production
EXPOSE 3000
WORKDIR /app
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/dist/ dist/
ARG proxy
RUN npm config set proxy=${proxy} \
    && npm i --production
CMD npm run start:prod
