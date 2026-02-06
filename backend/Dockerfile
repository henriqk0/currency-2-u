FROM node:20-slim

RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    --no-install-recommends

RUN curl -fSsL https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor | tee /usr/share/keyrings/google-chrome.gpg > /dev/null \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list

RUN apt-get update && apt-get install -y \
    google-chrome-stable \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

COPY package*.json ./

RUN npm install -g pnpm
RUN pnpm install --prod

RUN npx puppeteer browsers install chrome

COPY . .

RUN pnpm prisma generate

RUN pnpm run build
