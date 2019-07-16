FROM node:10

VOLUME /build ./build

WORKDIR /app

COPY package.json .
RUN npm install
COPY . .

CMD npm run-script ng -- build --prod --outputPath /build

