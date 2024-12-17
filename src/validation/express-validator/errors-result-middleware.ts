import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
import { FieldValidationError } from "express-validator/lib/base"

//type CustomFieldValidationError = { path: string; msg: string }
export const errorsResultMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    res.status(400).send({
      errorsMessages: errors.array({ onlyFirstError: true }).map((err) => {
        return {
          message: err.msg,
          field: (err as FieldValidationError).path,
        }
      }),
    })
    return
  }
  next()
}
