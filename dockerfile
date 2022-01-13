FROM node:16
ARG proxy=
ARG expose=3000
EXPOSE ${expose}
COPY . .
RUN npm config set proxy=${proxy} && npm i --production
CMD npm run start:prod
