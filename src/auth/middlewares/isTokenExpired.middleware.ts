export const isTokenExpired = (expirationDate: number, currentTime: number): boolean => {
  return expirationDate < currentTime
}
