// src/services/errors.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string = 'API_ERROR'
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends ApiError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class ServerError extends ApiError {
  constructor(
    public status: number,
    message: string
  ) {
    super(message, `SERVER_${status}`);
    this.name = 'ServerError';
  }
}

export class ValidationError extends ApiError {
  constructor(
    message: string,
    public fields: Record<string, string[]> = {}
  ) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = '未授权访问') {
    super(message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}
