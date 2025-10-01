# Job Microservices Platform

A microservices-based job management platform built with NestJS, featuring authentication, job management, task execution, and product services.

## 🏗️ Architecture Overview

This platform consists of 4 main microservices with inter-service communication through gRPC and Apache Pulsar message queue.

![Alt text](assets/diagram.svg)

### Microservices

1. **Auth Service** (Port: 3000) - Authentication and authorization
   - JWT token management
   - User registration and login
   - **gRPC Endpoint**: Provides authentication validation to other services

2. **Jobs Service** (Port: 3001) - Job posting and management
   - Job search
   - Job application handling
   - **Pulsar Publisher**: Publishes jobs to message queue for processing
   - **gRPC Client**: Communicates with Auth Service for user validation

3. **Executor Service** (Port: 3002) - Task execution engine
   - Process background jobs from Pulsar queue
   - Task queue management
   - Distributed task processing
   - **Pulsar Consumer**: Consumes jobs from message queue
   - **gRPC Client**: Communicates with Products Service for product operations

4. **Products Service** (Port: 3003) - Product catalog management
   - **gRPC Endpoint**: Provides create product services to other microservices

### 🔄 Inter-Service Communication

#### gRPC Communication Patterns

```
Auth Service (gRPC Server)
└── Provides: Authentication validation

Jobs Service (gRPC Server + gRPC Client + Pulsar Publisher)
├── Provides: Job acknowledgment services
├── Calls: Auth Service (user validation)
└── Publishes: Job messages to Pulsar

Products Service (gRPC Server)
└── Provides: Product creation and management

Executor Service (gRPC Client + Pulsar Consumer)
├── Consumes: Pulsar job messages
├── Calls: Products Service (create product)
└── Calls: Jobs Service (job acknowledgment)
```

#### Message Queue Flow (Apache Pulsar)

```
Jobs Service → Pulsar Topics → Executor Service

Topics:
• fibonacci-jobs: Fibonacci calculation tasks
• load-products-jobs: Product loading operations

Flow:
1. Jobs Service creates job → Stores in PostgreSQL
2. Jobs Service publishes message → Pulsar Topic
3. Executor Service consumes message → Processes job
4. Executor Service calls Products/Jobs gRPC → Updates status
```

#### Database Architecture

```
PostgreSQL Databases:
├── auth (Auth Service)
│   └── users
│
├── jobs (Jobs Service)
│   └── jobs
│
└── products (Products Service)
    ├── products
    └── categories
```

### Communication Matrix

| Service      | Communicates With  | Protocol      | Purpose                        |
| ------------ | ------------------ | ------------- | ------------------------------ |
| **Auth**     | ← Jobs Service     | gRPC          | User authentication validation |
| **Jobs**     | → Auth Service     | gRPC          | Validate user permissions      |
| **Jobs**     | → Pulsar           | Message Queue | Publish job tasks              |
| **Jobs**     | ← Executor         | gRPC          | Job acknowledgment             |
| **Executor** | ← Pulsar           | Message Queue | Consume job tasks              |
| **Executor** | → Products Service | gRPC          | Product operations             |
| **Executor** | → Jobs Service     | gRPC          | Update job status              |
| **Products** | ← Executor         | gRPC          | Product creation               |

### 🎯 Use Case Scenarios

#### Scenario 1: User Creates a Fibonacci Job

```
1. User → Auth Service: POST /jobs/graphql (createUser mutation, login mutation)
2. User → Jobs Service: POST /jobs/graphql (executeJob Fibonacci mutation)
3. Jobs Service → Auth Service: gRPC Authenticate(token)
4. Auth Service → Jobs Service: User validation response
5. Jobs Service → PostgreSQL: Store job record
6. Jobs Service → Pulsar: Publish fibonacci-job message
7. Executor Service ← Pulsar: Consume fibonacci-job
8. Executor Service: Process fibonacci calculation
9. Executor Service → Jobs Service: gRPC AcknowledgeJob(job_id)
10. Jobs Service → PostgreSQL: Update job status to completed
```

#### Scenario 2: Bulk Product Loading

```
1. User → Auth Service: POST /auth/graphql (createUser mutation, login mutation)
2. User → Jobs Service: POST /jobs/uploads/file (upload assets/products.json example file)
3. User → Jobs Service: POST /jobs/graphql (executeJob LoadProducts mutation)
4. Jobs Service → Auth Service: gRPC Authenticate(token)
5. Jobs Service → PostgreSQL: Store load-products job
6. Jobs Service → Pulsar: Publish load-products-job message
7. Executor Service ← Pulsar: Consume load-products-job
8. Executor Service → Products Service: gRPC CreateProduct(product_data)
9. Products Service → PostgreSQL: Store product records
10. Executor Service → Jobs Service: gRPC AcknowledgeJob(job_id)
11. Jobs Service → PostgreSQL: Update job status to completed
```

#### Scenario 3: User Authentication Flow

```
1. Client → Auth Service: POST /auth/graphql (credentials)
2. Auth Service → PostgreSQL: Validate user credentials
3. Auth Service → Client: JWT token response
4. Client → Any Service: API call with JWT token
5. Any Service → Auth Service: gRPC Authenticate(token)
6. Auth Service → Any Service: User identity + permissions
```

### Shared Libraries

- **Common** - Shared utilities and configurations
- **GraphQL** - GraphQL schema and resolvers
- **gRPC** - Inter-service communication proto definitions
- **Prisma** - Database ORM for PostgreSQL
- **Pulsar** - Message queue client and configurations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Minikube (for Kubernetes deployment)
- Helm 3+ (for Kubernetes deployment)

## 💻 Development Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd job-microservices
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create `.env` files for each service based on `.env.example` files in each app directory.

## 🐳 Running with Docker Compose

### Development Environment

```bash
# Start all services in development mode
docker compose up

# Start with rebuild
docker compose up --build

# Run in background
docker compose up -d
```

### Docker Services Include:

- PostgreSQL Database
- Apache Pulsar (Message Queue)
- All 4 microservices

## 📦 Running with NPM (Local Development)

### Start Require Services

```bash
# Start PostgreSQL and Pulsar
docker compose up -f docker-compose.local.yaml -d
```

### Database Operations

```bash
# Generate Prisma clients
npm run prisma:generate:auth
npm run prisma:generate:jobs

# Run migrations
npm run full-migrate
```

### Start All Services Concurrently

```bash
# Start all services in development mode
npm run start:dev
```

### Or Start Individual Services

```bash
# Auth Service
npm run start:auth

# Jobs Service
npm run start:jobs

# Executor Service
npm run start:executor

# Products Service
npm run start:products
```

### Or Production Mode

```bash
# Build all services
npm run build:all

# Start in production mode
npm run start:auth:prod
npm run start:jobs:prod
npm run start:executor:prod
npm run start:products:prod
```

## ☸️ Running with Kubernetes (Minikube + Helm)

### 1. Setup Minikube

```bash
# Start minikube
minikube start

# Enable ingress addon
minikube addons enable ingress

# Get minikube IP
minikube ip
```

### 2. Deploy with Helm

#### Install Dependencies

```bash
# Install chart dependencies
cd charts/jobber
helm dependency update
```

#### Deploy to Kubernetes

```bash
# Install the complete stack
helm install jobber ./charts/jobber -n jobber --create-namespaces

# Install with custom values
helm install jobber ./charts/jobber -n jobber --create-namespaces -f values.yaml

# Install with AWS values (if deploying to AWS)
helm install jobber ./charts/jobber -n jobber --create-namespaces -f values-aws.yaml

# Upgrade deployment
helm upgrade jobber ./charts/jobber -n jobber
```

#### Monitor Deployment

```bash
# Check pods status
kubectl get po -n jobber

# Check services
kubectl get svc -n jobber

# Check ingress
kubectl get ing -n jobber

# View logs
kubectl logs -f deployment/auth-service
kubectl logs -f deployment/jobs-service
kubectl logs -f deployment/executor-service
kubectl logs -f deployment/products-service
```

### 3. Access Services

#### Local Development (Minikube)

```bash
# Get minikube service URLs
minikube service list

# Access specific service
minikube service auth-http --url -n jobber
minikube service jobs-http --url -n jobber
```

#### Port Forwarding

```bash
# Forward auth service
kubectl port-forward service/auth-service 3001:3001 -n jobber

# Forward jobs service
kubectl port-forward service/jobs-service 3002:3002 -n jobber

# Forward executor service
kubectl port-forward service/executor-service 3003:3003 -n jobber

# Forward products service
kubectl port-forward service/products-service 3004:3004 -n jobber
```

## 🛠️ Development Commands

### gRPC

```bash
# Generate TypeScript types from proto files
npm run generate-ts-proto
```
