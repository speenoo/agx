FROM node:23 AS builder

WORKDIR /app
COPY . .
RUN npm install

ENV NODE_ENV=production
ENV PLATFORM=WEB

ARG CLICKHOUSE_URL

RUN npm run build
RUN ls /app/build

FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html
