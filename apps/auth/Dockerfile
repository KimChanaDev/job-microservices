FROM node:24.7-slim as builder
WORKDIR /workspace
RUN apt-get update && apt-get install -y \
    protobuf-compiler \
    openssl \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY apps/auth/package*.json ./apps/auth/
COPY apps/jobs/package*.json ./apps/jobs/
COPY apps/executor/package*.json ./apps/executor/
RUN npm install

COPY tsconfig*.json ./
COPY eslint.config.mjs ./
COPY nest-cli.json ./

COPY apps/auth ./apps/auth
COPY libs/common ./libs/common
COPY libs/graphql ./libs/graphql
COPY libs/grpc ./libs/grpc
COPY libs/prisma ./libs/prisma

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

COPY package*.json ./
COPY apps/auth/package*.json ./apps/auth/
RUN npm install --workspace=apps/auth --omit=dev && npm cache clean --force

COPY --from=builder /workspace/dist ./dist
COPY --from=builder /workspace/apps/auth/prisma ./prisma
COPY --from=builder /workspace/node_modules/@prisma/client/auth ./node_modules/@prisma/client/auth
COPY --from=builder /workspace/apps/auth/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

ENV NODE_ENV=
ENV AUTH_JWT_SECRET=
ENV AUTH_JWT_EXPIRATION_MS=
ENV AUTH_APP_VERSION=
ENV AUTH_DATABASE_URL=
ENV AUTH_PORT=

ENTRYPOINT ["./entrypoint.sh"]
CMD ["npm", "run", "start:auth:prod" ]