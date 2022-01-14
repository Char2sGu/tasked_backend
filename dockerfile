FROM node:16
ARG proxy=
ARG expose=3000
EXPOSE ${expose}
COPY package.json package-lock.json ./
RUN npm config set proxy=${proxy} 
RUN npm i --production
COPY dist/ dist/
COPY .env ./
CMD node dist/main
