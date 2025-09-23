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
COPY apps/products/package*.json ./apps/products/
COPY libs/common/package*.json ./libs/common/
COPY libs/grpc/package*.json ./libs/grpc/
RUN npm install

COPY tsconfig*.json ./
COPY eslint.config.mjs ./
COPY nest-cli.json ./

COPY apps/products ./apps/products
COPY libs/common ./libs/common
COPY libs/grpc ./libs/grpc

RUN npm run generate-ts-proto
RUN npm run build:products

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
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY apps/products/package*.json ./apps/products/
COPY libs/common/package*.json ./libs/common/
COPY libs/grpc/package*.json ./libs/grpc/

RUN npm install --workspace=apps/products \
    --workspace=libs/common \
    --workspace=libs/grpc \
    --omit=dev && \
    npm cache clean --force

COPY apps/products/drizzle.config.ts ./apps/products/drizzle.config.ts
COPY apps/products/drizzle ./apps/products/drizzle

COPY --from=builder /workspace/dist ./dist

ENV NODE_ENV=
ENV PULSAR_SERVICE_URL=
ENV PRODUCTS_APP_VERSION=
ENV PRODUCTS_PORT=
ENV PRODUCTS_DATABASE_URL=
ENV PRODUCTS_GRPC_URL=

CMD ["npm", "run", "start:products:prod" ]