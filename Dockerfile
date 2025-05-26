FROM node

WORKDIR /myweb

COPY package.* /myweb
RUN npm install

COPY . /myweb
COPY .env .env


EXPOSE 5173

CMD ["npm","run","dev"]
