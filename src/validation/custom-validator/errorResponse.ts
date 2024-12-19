import { APIErrorResultType } from "../../types/types"

export const errorResponse = (errorsArray: Array<{ message: string; field: string }>) => {
  let errors_: APIErrorResultType = {
    errorsMessages: [] as Array<{ message: string; field: string }>,
  }

  errorsArray.forEach((error) => {
    errors_.errorsMessages.push(error)
  })

  return errors_
}
