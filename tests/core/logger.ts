export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  testName?: string;
  stepName?: string;
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = LogLevel.INFO;
  private logs: LogEntry[] = [];

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  public debug(message: string, data?: any, testName?: string, stepName?: string): void {
    this.log(LogLevel.DEBUG, message, data, testName, stepName);
  }

  public info(message: string, data?: any, testName?: string, stepName?: string): void {
    this.log(LogLevel.INFO, message, data, testName, stepName);
  }

  public warn(message: string, data?: any, testName?: string, stepName?: string): void {
    this.log(LogLevel.WARN, message, data, testName, stepName);
  }

  public error(message: string, data?: any, testName?: string, stepName?: string): void {
    this.log(LogLevel.ERROR, message, data, testName, stepName);
  }

  private log(level: LogLevel, message: string, data?: any, testName?: string, stepName?: string): void {
    if (level < this.logLevel) {
      return;
    }

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      testName,
      stepName
    };

    this.logs.push(logEntry);

    // Console output with colors
    const levelName = LogLevel[level];
    const color = this.getColorForLevel(level);
    const prefix = testName ? `[${testName}]` : '';
    const step = stepName ? ` - ${stepName}` : '';
    
    console.log(`${color}[${logEntry.timestamp}] ${levelName}${prefix}${step}: ${message}\x1b[0m`);
    
    if (data) {
      console.log(`${color}Data:`, JSON.stringify(data, null, 2), '\x1b[0m');
    }
  }

  private getColorForLevel(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return '\x1b[36m'; // Cyan
      case LogLevel.INFO:
        return '\x1b[32m'; // Green
      case LogLevel.WARN:
        return '\x1b[33m'; // Yellow
      case LogLevel.ERROR:
        return '\x1b[31m'; // Red
      default:
        return '\x1b[0m'; // Reset
    }
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public getLogsForTest(testName: string): LogEntry[] {
    return this.logs.filter(log => log.testName === testName);
  }

  public clearLogs(): void {
    this.logs = [];
  }

  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
