FROM node:18-buster-slim AS production

WORKDIR /app

RUN apt-get update && apt-get install -y openssl

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3001

CMD ["npm","run","start"]