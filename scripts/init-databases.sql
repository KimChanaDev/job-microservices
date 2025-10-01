-- Create databases for each microservice
CREATE DATABASE auth;
CREATE DATABASE jobs;
CREATE DATABASE products;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE auth TO postgres;
GRANT ALL PRIVILEGES ON DATABASE jobs TO postgres;
GRANT ALL PRIVILEGES ON DATABASE products TO postgres;