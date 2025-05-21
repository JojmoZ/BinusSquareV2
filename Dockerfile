FROM node

WORKDIR /myweb

COPY package.json /myweb

RUN npm install

COPY . /myweb

EXPOSE 5173

CMD ["sh", "-c", "npx drizzle-kit migrate && npm run dev"]
