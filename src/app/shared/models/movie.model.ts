export class MovieModel {
  id: number;
  titre: string;
  description: string;
  image: string;
  score: number;
  date: Date;

  constructor(movieFromApi:any) {
    this.id= movieFromApi.id;
    this.titre=movieFromApi.title;
    this.description=movieFromApi.overview;
    this.image=movieFromApi.backdrop_path;
    this.score=movieFromApi.vote_average;
    this.date=movieFromApi.release_date;
  }
}
