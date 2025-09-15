import { Plugin as EnvelopPlugin } from '@envelop/core';
import { Logger } from '@nestjs/common';
import { print } from 'graphql';
import { v4 as uuidv4 } from 'uuid';


export function gqlLoggingPlugin(): EnvelopPlugin {
    const logger = new Logger('GraphQLLogger');

    return {
        onParse() {
            const startTime = Date.now();
            return ({ result, context }) => {
                if (result && typeof result === 'object' && 'kind' in result) {
                    (context as any)._requestStartTime = startTime; // Store request start time in context


                    const request = (context as any)?.req;

                    if (request) {
                        const headers = request.headers || {};
                        const userAgent = headers['user-agent'] || 'unknown';
                        const ip = headers['x-forwarded-for'] || headers['x-real-ip'] || request.ip || 'unknown';
                        (context as any)._clientInfo = { userAgent, ip }; // Store client info for later use
                        (context as any)._headers = headers; // Store headers for later use
                    }
                }
            };
        },

        onExecute() {
            return {
                onExecuteDone({ result, args }) {
                    const executionStartTime = Date.now();
                    const context = args.contextValue;
                    const requestStartTime = (context as any)?._requestStartTime || executionStartTime;
                    const clientInfo = (context as any)?._clientInfo;
                    const headers = (context as any)?._headers;

                    const query = args.document ? print(args.document) : 'Unknown';
                    const variables = args.variableValues;
                    const executionEndTime = Date.now();
                    const requestId = uuidv4();
                    const message = {
                        requestId,
                        headers: headers || {},
                        query: `${query.substring(0, 200)}${query.length > 200 ? '...' : ''}`,
                        variables: (variables && Object.keys(variables).length > 0) ? variables : {},
                        clientIp: clientInfo?.ip || 'unknown',
                        durations: `${executionEndTime - requestStartTime}ms`,
                    }

                    logger.log(message);

                    // Check for GraphQL errors
                    if (result && 'errors' in result && result.errors && result.errors.length > 0) {
                        logger.warn(`[ERROR] Execution completed with ${result.errors.length} GraphQL error(s):`);
                        result.errors.forEach((error, index) => {
                            logger.warn(`  ${index + 1}. ${error.message}`);
                            if (error.path) {
                                logger.debug(`     Path: ${error.path.join('.')}`);
                            }
                            if (error.locations) {
                                logger.debug(`     Location: Line ${error.locations[0]?.line}, Column ${error.locations[0]?.column}`);
                            }
                        });
                    }

                    // Handle subscription results
                    // const operationName = args.document?.definitions?.[0]?.['name']?.value || 'Anonymous';
                    // if (result && typeof result === 'object' && Symbol.asyncIterator in result) {
                    //     logger.log(`3 ==> [SUBSCRIPTION] Subscription started: ${operationName}`);
                    //     return;
                    // }

                    // Performance alerts
                    // if (totalDuration > 1000) {
                    //     logger.warn(`3 ==> [SLOW] Slow Query Alert: ${operationName} took ${totalDuration}ms`);
                    // } else if (totalDuration > 500) {
                    //     logger.log(`3 ==> [MEDIUM] Medium Query: ${operationName} took ${totalDuration}ms`);
                    // } else {
                    //     logger.log(`3 ==> [FAST] Fast Query: ${operationName} took ${totalDuration}ms`);
                    // }

                    // Calculate response size for regular queries
                    // const responseSize = JSON.stringify(result).length;
                    // logger.log(`3 ==> [SIZE] Response Size: ${responseSize} bytes`);

                    // Large response warning
                    // if (responseSize > 1024 * 1024) { // 1MB
                    //     logger.warn(`3 ==> [LARGE] Large Response Warning: ${operationName} returned ${Math.round(responseSize / 1024)}KB`);
                    // }

                    // Log successful operations with data summary
                    // if (!result.errors || result.errors.length === 0) {
                    //     if (result.data) {
                    //         const dataKeys = Object.keys(result.data).join(', ');
                    //         logger.debug(`3 ==> [DATA] Response data fields: ${dataKeys}`);
                    //     }
                    // }
                }
            };
        }
    };
}

// Request logging plugin that captures HTTP request details
export function createHttpRequestLoggerPlugin(): EnvelopPlugin {
    const logger = new Logger('HttpRequestLogger');

    return {
        onParse() {
            return ({ context }) => {
                const request = (context as any)?.req;
                if (request) {
                    const timestamp = new Date().toISOString();

                    // Extract and sanitize headers
                    const headers: Record<string, string> = {};
                    Object.keys(request.headers || {}).forEach(key => {
                        if (key.toLowerCase().includes('authorization') ||
                            key.toLowerCase().includes('cookie') ||
                            key.toLowerCase().includes('token')) {
                            headers[key] = '***MASKED***';
                        } else {
                            headers[key] = request.headers[key];
                        }
                    });

                    const requestInfo = {
                        timestamp,
                        method: request.method || 'POST',
                        url: request.url || '/',
                        userAgent: headers['user-agent'] || 'unknown',
                        ip: headers['x-forwarded-for'] || headers['x-real-ip'] || request.ip || 'unknown',
                        contentType: headers['content-type'] || 'unknown',
                        contentLength: headers['content-length'] || '0',
                        host: headers['host'] || 'unknown'
                    };

                    logger.log(`[REQUEST] HTTP Request: ${requestInfo.method} ${requestInfo.url}`);
                    logger.debug(`[CLIENT] Client: ${requestInfo.userAgent}`);
                    logger.debug(`[IP] IP: ${requestInfo.ip}`);
                    logger.debug(`[HOST] Host: ${requestInfo.host}`);
                    logger.debug(`[CONTENT-TYPE] Content-Type: ${requestInfo.contentType}`);
                    logger.debug(`[CONTENT-LENGTH] Content-Length: ${requestInfo.contentLength} bytes`);
                    logger.debug(`[TIMESTAMP] Timestamp: ${requestInfo.timestamp}`);

                    // Store detailed request info for correlation
                    (context as any)._httpRequestInfo = requestInfo;
                }
            };
        }
    };
}