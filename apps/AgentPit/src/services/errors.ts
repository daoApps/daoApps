// src/services/errors.ts
export class ApiError extends Error {
  public code: string;

  constructor(
    message: string,
    code: string = 'API_ERROR'
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

export class NetworkError extends ApiError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR')
    this.name = 'NetworkError'
  }
}

export class ServerError extends ApiError {
  public status: number;

  constructor(
    status: number,
    message: string
  ) {
    super(message, `SERVER_${status}`)
    this.name = 'ServerError'
    this.status = status
  }
}

export class ValidationError extends ApiError {
  public fields: Record<string, string[]>;

  constructor(
    message: string,
    fields: Record<string, string[]> = {}
  ) {
    super(message, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
    this.fields = fields
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = '未授权访问') {
    super(message, 'UNAUTHORIZED')
    this.name = 'UnauthorizedError'
  }
}