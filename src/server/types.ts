export type UserRecord = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  status: "active" | "removed";
}

export type MovieRecord = {
  id: string;
  moviedbId: number;
  title: string;
  overview: string;
  image: string;
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type FavouriteRecord = {
  id: string;
  userId: string;
  movieId: string;
}

export type GroupRecord = {
  id: string;
  title: string;
  userId: string;
  movieIds: string[];
  createdAt: Date;
  updatedAt: Date;
  status: "active" | "removed";
}
