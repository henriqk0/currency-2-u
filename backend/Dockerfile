FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm
RUN pnpm install --prod

COPY . .

RUN pnpm prisma generate

CMD ["npm", "run", "dev"]

