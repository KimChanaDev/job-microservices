FROM node:24.7-slim as builder
WORKDIR /workspace
RUN apt-get update && apt-get install -y \
    protobuf-compiler \
    openssl \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY apps/executor/package*.json ./apps/executor/
COPY libs/common/package*.json ./libs/common/
COPY libs/grpc/package*.json ./libs/grpc/
COPY libs/pulsar/package*.json ./libs/pulsar/
RUN npm install

COPY tsconfig*.json ./
COPY eslint.config.mjs ./
COPY nest-cli.json ./

COPY apps/executor ./apps/executor
COPY libs/common ./libs/common
COPY libs/grpc ./libs/grpc
COPY libs/pulsar ./libs/pulsar

RUN npm run build:executor


FROM node:24.7-slim as runner
WORKDIR /app
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    libssl3 \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY apps/executor/package*.json ./apps/executor/
COPY libs/common/package*.json ./libs/common/
COPY libs/grpc/package*.json ./libs/grpc/
COPY libs/pulsar/package*.json ./libs/pulsar/
RUN npm install --workspace=apps/executor \
    --workspace=libs/pulsar \
    --workspace=libs/common \
    --workspace=libs/grpc \
    --omit=dev && \
    npm cache clean --force

COPY --from=builder /workspace/dist ./dist

ENV NODE_ENV=
ENV EXECUTOR_APP_VERSION=
ENV EXECUTOR_PORT=
ENV PULSAR_SERVICE_URL=
ENV PRODUCTS_GRPC_URL=
ENV JOBS_GRPC_URL=

CMD ["npm", "run", "start:executor:prod" ]