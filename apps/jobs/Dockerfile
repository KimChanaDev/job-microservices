FROM node:24.7-slim as builder
WORKDIR /workspace

RUN apt-get update && apt-get install -y \
    protobuf-compiler \
    openssl \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY eslint.config.mjs ./
COPY nest-cli.json ./

COPY apps/jobs ./apps/jobs
COPY libs/common ./libs/common
COPY libs/graphql ./libs/graphql
COPY libs/grpc ./libs/grpc
COPY libs/pulsar ./libs/pulsar
RUN npm run generate-ts-proto
RUN npm run build:jobs


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
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /workspace/dist ./dist

ENV NODE_ENV=
ENV JOBS_APP_VERSION=
ENV JOBS_PORT=
ENV PULSAR_SERVICE_URL=

CMD ["npm", "run", "start:jobs:prod" ]