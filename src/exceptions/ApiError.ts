import { CustomError } from "./CustomError"

export class ApiError extends CustomError {
  constructor(message: string = 'API error') {
    super(500, message)

    this.name = 'ApiError'
  }
}