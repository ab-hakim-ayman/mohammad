export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile?: boolean;
  logFilePath?: string;
  enableJSON: boolean;
}

const DEFAULT_CONFIG: LoggerConfig = {
  level: process.env.NODE_ENV === "production" ? LogLevel.INFO : LogLevel.DEBUG,
  enableConsole: true,
  enableJSON: process.env.NODE_ENV === "production",
};

// 🟢 চেক করি কোডটি সার্ভারে রান হচ্ছে নাকি ব্রাউজারে
const isServer = typeof window === "undefined";

class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error | unknown, context?: Record<string, any>): void {
    let errorObj: Error | undefined;

    if (error instanceof Error) {
      errorObj = error;
    } else if (error) {
      errorObj = new Error(String(error));
    }

    this.log(LogLevel.ERROR, message, { ...context, error: errorObj });
  }

  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.FATAL, message, { ...context, error });
  }

  child(context: Record<string, any>): Logger {
    const childLogger = new Logger(this.config);
    const originalLog = childLogger.log.bind(childLogger);

    childLogger.log = (
      level: LogLevel,
      message: string,
      additionalContext?: Record<string, any>
    ) => {
      originalLog(level, message, { ...context, ...additionalContext });
    };

    return childLogger;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    if (level < this.config.level) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    if (context?.error) {
      entry.error = context.error;
      delete context.error;
    }

    this.output(entry);
  }

  private output(entry: LogEntry): void {
    if (!this.config.enableConsole) {
      return;
    }

    const levelName = LogLevel[entry.level];
    const prefix = `[${levelName}] ${entry.timestamp}`;

    if (this.config.enableJSON) {
      console.log(JSON.stringify(entry));
    } else {
      // 🟢 ফিক্স: সার্ভার সাইডে ANSI কালার ব্যবহার করবে, ক্লায়েন্ট সাইডে ক্লিন কনসোল লগার আউটপুট দিবে
      if (isServer) {
        const style = this.getColorStyle(entry.level);
        console.log(`${style}%s\x1b[0m`, prefix, entry.message);
      } else {
        const browserStyle = this.getBrowserStyle(entry.level);
        console.log(`%c${prefix} ${entry.message}`, browserStyle);
      }

      if (entry.context && Object.keys(entry.context).length > 0) {
        console.log(" Context:", entry.context);
      }

      if (entry.error) {
        console.error(" Error:", entry.error);
        if (entry.error.stack) {
          console.error(" Stack:", entry.error.stack);
        }
      }
    }
  }

  private getColorStyle(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return "\x1b[36m";
      case LogLevel.INFO:
        return "\x1b[32m";
      case LogLevel.WARN:
        return "\x1b[33m";
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        return "\x1b[31m";
      default:
        return "\x1b[0m";
    }
  }

  // 🟢 ব্রাউজার কনসোলের জন্য CSS স্টাইলিং
  private getBrowserStyle(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return "color: #06b6d4; font-weight: bold;";
      case LogLevel.INFO:
        return "color: #10b981; font-weight: bold;";
      case LogLevel.WARN:
        return "color: #f59e0b; font-weight: bold;";
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        return "color: #ef4444; font-weight: bold;";
      default:
        return "color: inherit;";
    }
  }

  startTimer(name: string): LoggerTimer {
    return new LoggerTimer(this, name);
  }
}

class LoggerTimer {
  private logger: Logger;
  private name: string;
  private startTime: number;

  constructor(logger: Logger, name: string) {
    this.logger = logger;
    this.name = name;
    this.startTime = Date.now();
  }

  end(context?: Record<string, any>): void {
    const duration = Date.now() - this.startTime;
    this.logger.debug(`${this.name} completed in ${duration}ms`, context);
  }

  elapsed(): number {
    return Date.now() - this.startTime;
  }
}

export const logger = new Logger();

export const createLogger = (config?: Partial<LoggerConfig>) => new Logger(config);

export function logRequest(request: Request, context?: Record<string, any>) {
  const url = new URL(request.url);
  const method = request.method;

  logger.info(`${method} ${url.pathname}`, {
    method,
    path: url.pathname,
    query: Object.fromEntries(url.searchParams),
    ...context,
  });
}

export function logError(error: Error, context?: Record<string, any>) {
  logger.error(error.message, error, context);
}