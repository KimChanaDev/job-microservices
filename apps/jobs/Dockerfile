##################################
# Stage 1: Build the application #
##################################
FROM node:24.7-slim as builder
WORKDIR /workspace

RUN apt-get update && apt-get install -y \
    protobuf-compiler \
    openssl \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY apps/jobs/package*.json ./apps/jobs/
COPY libs/common/package*.json ./libs/common/
COPY libs/graphql/package*.json ./libs/graphql/
COPY libs/grpc/package*.json ./libs/grpc/
COPY libs/pulsar/package*.json ./libs/pulsar/
COPY libs/prisma/package*.json ./libs/prisma/
RUN npm install

COPY tsconfig*.json ./
COPY eslint.config.mjs ./
COPY nest-cli.json ./

COPY apps/jobs ./apps/jobs
COPY libs/common ./libs/common
COPY libs/graphql ./libs/graphql
COPY libs/grpc ./libs/grpc
COPY libs/pulsar ./libs/pulsar
COPY libs/prisma ./libs/prisma

RUN npm run prisma:generate:jobs
RUN npm run generate-ts-proto
RUN npm run build:jobs

##################################
# Stage 2: Run the application   #
##################################
FROM node:24.7-slim as runner
WORKDIR /app
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    libssl3 \
    postgresql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY apps/jobs/package*.json ./apps/jobs/
COPY libs/common/package*.json ./libs/common/
COPY libs/graphql/package*.json ./libs/graphql/
COPY libs/grpc/package*.json ./libs/grpc/
COPY libs/pulsar/package*.json ./libs/pulsar/
COPY libs/prisma/package*.json ./libs/prisma/

RUN npm install --workspace=apps/jobs \
    --workspace=libs/common \
    --workspace=libs/graphql \
    --workspace=libs/grpc \
    --workspace=libs/pulsar \
    --workspace=libs/prisma \
    --omit=dev && \
    npm cache clean --force

COPY --from=builder /workspace/dist ./dist
COPY --from=builder /workspace/apps/jobs/prisma ./prisma
COPY --from=builder /workspace/node_modules/@prisma/client/jobs ./node_modules/@prisma/client/jobs
COPY --from=builder /workspace/apps/jobs/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

ENV NODE_ENV=
ENV JOBS_APP_VERSION=
ENV JOBS_PORT=
ENV PULSAR_SERVICE_URL=
ENV AUTH_GRPC_URL=
ENV JOBS_GRPC_URL=
ENV JOBS_DATABASE_URL=

CMD ["npm", "run", "start:jobs:prod" ]