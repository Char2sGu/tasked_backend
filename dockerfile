FROM node:16
ARG proxy=
ARG expose=3000
EXPOSE ${expose}
COPY ["package.json", "package-lock.json", "./"]
RUN npm config set proxy=${proxy} && npm i --production
COPY ["dist/", "dist/"]
COPY [".env", "./"]
RUN node dist/scripts/db init
CMD node dist/src/main
