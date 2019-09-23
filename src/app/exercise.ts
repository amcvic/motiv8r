export interface Exercise {
  id: number,
  license_author: string,
  status: string,
  description: string,
  name: string,
  name_original: string,
  creation_date: string
}

export interface ExerciseResponse {
  count: number,
  next: string,
  previous: string,
  results: Exercise[]
}