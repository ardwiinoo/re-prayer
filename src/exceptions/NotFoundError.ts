import { CustomError } from "./CustomError"

export class NotFoundError extends CustomError {
  constructor(message: string = 'Resource not found') {
    super(404, message)

    this.name = 'NotFoundError'
  }
}