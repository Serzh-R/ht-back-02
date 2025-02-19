export enum ResultStatus {
  Success = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  ConfirmCodeExpired = 410, // Код 410: ресурс (или подтверждение) больше не доступен
  TooManyRequests = 429, // Код 429: слишком много запросов (Rate Limiting)
  ServerError = 500,
}

/*export enum ResultStatus {
  Success = 'Success',
  Created = 'Created',
  NoContent = 'NoContent',
  BadRequest = 'BadRequest',
  Unauthorized = 'Unauthorized',
  Forbidden = 'Forbidden',
  NotFound = 'NotFound',
  ConfirmCodeExpired = 'ConfirmCodeExpired',
  ServerError = 'ServerError',
}*/
