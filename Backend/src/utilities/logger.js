import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ═══════════════════════════════════════════════════════════════
// Create logs directory if it doesn't exist
// ═══════════════════════════════════════════════════════════════
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// ═══════════════════════════════════════════════════════════════
// Custom format for console (colorful and readable)
// ═══════════════════════════════════════════════════════════════
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    
    // Add metadata if exists
    const metaData = { ...metadata };
    delete metaData.service;
    delete metaData.environment;
    
    if (Object.keys(metaData).length > 0) {
      msg += `\n${JSON.stringify(metaData, null, 2)}`;
    }
    
    return msg;
  })
);

// ═══════════════════════════════════════════════════════════════
// Custom format for files (JSON)
// ═══════════════════════════════════════════════════════════════
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// ═══════════════════════════════════════════════════════════════
// Create the logger
// ═══════════════════════════════════════════════════════════════
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: {
    service: 'portfolio-tracker-api',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Console transport (only in development)
    ...(process.env.NODE_ENV !== 'production' ? [
      new winston.transports.Console({
        format: consoleFormat
      })
    ] : []),
    
    // File transport - all logs
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // File transport - only errors
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: fileFormat,
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
  
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log')
    })
  ],
  
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log')
    })
  ],
  
  exitOnError: false,
});

// ═══════════════════════════════════════════════════════════════
// Stream for Morgan (HTTP logger)
// ═══════════════════════════════════════════════════════════════
export const stream = {
  write: (message) => {
    logger.http(message.trim());
  }
};

// ═══════════════════════════════════════════════════════════════
// Export logger
// ═══════════════════════════════════════════════════════════════
export { logger };
export default logger;