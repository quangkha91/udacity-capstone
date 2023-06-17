/**
 * Fields in a request to update a single Fashion item.
 */
export interface UpdateFashionRequest {
  name: string
  dueDate: string
  done: boolean
}