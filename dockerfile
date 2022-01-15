FROM node:16-alpine
WORKDIR /app
EXPOSE 3000
ARG proxy=
COPY package.json package-lock.json ./
RUN npm config set proxy=${proxy}
RUN npm i --production
COPY dist/ dist/
CMD node dist/main
