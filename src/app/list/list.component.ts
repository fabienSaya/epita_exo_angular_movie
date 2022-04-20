import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MovieModel } from '../models/movie.model';
import { MovieService } from '../services/movie.service';


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
  constructor(private movieSvc:MovieService) { }


  ngOnInit(): void {
    /* requete pour récupérer les movies*/
    //this.http.get(this.url).subscribe((response:any)=> this.movies=response.results);

    //on va plutot passer par un service pour récupérer les films
    //je dit au service de charger
    this.movieSvc.getMoviesFromApi();
    //je m'abonne à la source de la donnée
    this.movieSvc.movies$.subscribe((moviesFromService:any)=> this.movies=moviesFromService);

  }

  getImageUrl(backdrop_path:string | null ): string {
    return (backdrop_path!=null && backdrop_path!='') ?
      this.url_base_image+backdrop_path :
      'https://via.placeholder.com/500x281.png?text=no+image'; //gestion d'une image bidon si le serveur nous en retourne pas
  }

  getNextMoviesOnAction() : void{
    this.movieSvc.getNextMoviesFromApi();
  }

}
