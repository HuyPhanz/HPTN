# Build BASE
FROM node:18-alpine as BASE
LABEL author=""

WORKDIR /app
COPY package.json yarn.lock ./
RUN apk add --no-cache git \
    && yarn install \
    && yarn cache clean

# Build Image
FROM node:18-alpine AS BUILD
LABEL author=""

WORKDIR /app
COPY --from=BASE /app/node_modules ./node_modules
COPY . .
RUN apk add --no-cache curl \
  && curl -sf https://gobinaries.com/tj/node-prune | sh -s -- -b /usr/local/bin \
  && apk del curl \
  && apk add --no-cache git curl \
  && yarn build \
  && cd .next/standalone \
  && node-prune

# Build production
FROM node:18-alpine AS PRODUCTION
LABEL author=""

WORKDIR /app

COPY --from=BUILD /app/public ./public
COPY --from=BUILD /app/next.config.js ./

# Set mode "standalone" in file "next.config.js"
COPY --from=BUILD /app/.next/standalone ./
COPY --from=BUILD /app/.next/static ./.next/static
COPY --from=BUILD /app/.next/server ./.next/server

EXPOSE 3000
CMD ["node", "server.js"]
