import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MovieModel } from '../shared/models/movie.model';
import { MovieService } from '../shared/services/movie.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  movies:Array<MovieModel> =[];
  //url:string ="https://api.themoviedb.org/3/discover/movie?api_key=d8cc8cac11048db08e0fdd11acbf66c1&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate";
  url_base_image:string ="https://image.tmdb.org/t/p/w500";

  /* injection d'un objet http de la classe HttpClient */
  //constructor(private http:HttpClient) { }
  /*injection du service movie */
  constructor(public movieSvc:MovieService) { }


  ngOnInit(): void {
    /* requete pour récupérer les movies*/
    //this.http.get(this.url).subscribe((response:any)=> this.movies=response.results);

    //on va plutot passer par un service pour récupérer les films
    //je dit au service de charger
  //  this.movieSvc.getMoviesFromApi();
    //je m'abonne à la source de la donnée
  //  this.movieSvc.movies$.subscribe((moviesFromService:any)=> this.movies=moviesFromService);

    //Pour évite qu'il fasse une requete à chaque fois qu'on fait back vers la liste. Donc qu'il fasse
    //une requete au back inutile si on a déjà la liste, on fait:
    //- on souscrit au subject
    //- s'il y a pas de film, on lance la requete
    //- s'il y a des films, on les assigne

    this.movieSvc.movies$.subscribe((data:any) => {
      if (data.length==0) {
        this.movieSvc.getMoviesFromApi();
      } else {
        this.movies=data;
      }
    })

    //on réinitialise la liste de recherche à chaque fois
    this.movieSvc.resetfoundMovies$();

  }

  getImageUrl(backdrop_path:string | null ): string {
    return (backdrop_path!=null && backdrop_path!='') ?
      this.url_base_image+backdrop_path :
      'https://via.placeholder.com/500x281.png?text=no+image'; //gestion d'une image bidon si le serveur nous en retourne pas
  }

  getNextMoviesOnAction() : void{
    this.movieSvc.getNextMoviesFromApi();
  }

  navToDetail(movie:MovieModel) {
    this.movieSvc.setMovie(movie);

  }

}
