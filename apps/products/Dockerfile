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
RUN npm install

COPY tsconfig*.json ./
COPY eslint.config.mjs ./
COPY nest-cli.json ./

COPY apps/products ./apps/products
COPY libs/common ./libs/common

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

RUN npm install --workspace=apps/products \
    --workspace=libs/common \
    --omit=dev && \
    npm cache clean --force

COPY --from=builder /workspace/dist ./dist

ENV NODE_ENV=
ENV PULSAR_SERVICE_URL=
ENV PRODUCTS_APP_VERSION=
ENV PRODUCTS_PORT=

CMD ["npm", "run", "start:products:prod" ]