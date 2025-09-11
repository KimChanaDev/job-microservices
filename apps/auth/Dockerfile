FROM node:24.7-slim as builder
WORKDIR /workspace
COPY package*.json ./
COPY tsconfig*.json ./
COPY eslint.config.mjs ./
COPY nest-cli.json ./

COPY apps/auth ./apps/auth
COPY libs/common ./libs/common
COPY libs/graphql ./libs/graphql
COPY libs/grpc ./libs/grpc
COPY libs/prisma ./libs/prisma

RUN apt-get update && apt-get install -y \
    protobuf-compiler \
    openssl \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*
RUN npm install
RUN npm run prisma:generate
RUN npm run generate-ts-proto
RUN npm run build:auth


FROM node:24.7-slim as runner
WORKDIR /app
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    libssl3 \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /workspace/package.json ./
COPY --from=builder /workspace/package-lock.json ./
COPY --from=builder /workspace/dist ./dist
COPY --from=builder /workspace/apps/auth/prisma ./prisma
COPY --from=builder /workspace/apps/auth/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

RUN npm ci --omit=dev
COPY --from=builder /workspace/node_modules/@prisma/client/auth ./node_modules/@prisma/client/auth

ENV NODE_ENV=
ENV APP_VERSION=
ENV AUTH_DATABASE_URL=
ENV AUTH_PORT=
ENV JWT_SECRET=
ENV JWT_EXPIRATION_MS=

ENTRYPOINT ["./entrypoint.sh"]
CMD ["npm", "run", "start:auth:prod" ]