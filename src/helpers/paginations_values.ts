import { Request } from "express"
import { SortDirectionsEnam } from "../types/types"

export const paginationQueries = (req: Request) => {
  let searchNameTerm: string | null = req.query.searchNameTerm
    ? String(req.query.searchNameTerm)
    : null
  let sortBy: string = req.query.sortBy
    ? req.query.sortBy.toString()
    : "createdAt"
  let sortDirection: SortDirectionsEnam.ASC | SortDirectionsEnam.DESC =
    req.query.sortDirection &&
    req.query.sortDirection.toString() === SortDirectionsEnam.ASC
      ? SortDirectionsEnam.ASC
      : SortDirectionsEnam.DESC
  let pageNumber: number =
    req.query.pageNumber !== undefined && Number(req.query.pageNumber) >= 0
      ? Number(req.query.pageNumber)
      : 1
  let pageSize: number =
    req.query.pageSize !== undefined && +req.query.pageSize >= 0
      ? +req.query.pageSize
      : 10

  return { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize }
}
