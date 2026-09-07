export type RecordStatus = 'active' | 'removed'

export type UserRecord = {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
  status: RecordStatus
}

export type MovieRecord = {
  id: string
  moviedbId: number
  title: string
  overview: string
  image: string
  releaseDate: Date
  createdAt: Date
  updatedAt: Date
  status: RecordStatus
}

export type FavouriteRecord = {
  id: string
  userId: string
  movieId: string
  createdAt: Date
  updatedAt: Date
  status: RecordStatus
}

export type GroupRecord = {
  id: string
  title: string
  userId: string
  movieIds: string[]
  createdAt: Date
  updatedAt: Date
  status: RecordStatus
}
