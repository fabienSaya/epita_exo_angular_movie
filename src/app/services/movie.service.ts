import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { MovieModel } from '../models/movie.model';


@Injectable({
  providedIn: 'root'
})
export class MovieService {

  //private _url:string ="https://api.themoviedb.org/3/discover/movie?api_key=d8cc8cac11048db08e0fdd11acbf66c1&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate";
  private _url:string ="https://api.themoviedb.org/3/discover/movie?api_key=d8cc8cac11048db08e0fdd11acbf66c1";


  private _currentPage:number = 1

  /*les behavious subjects sont des Observable
    - on peut s'abonner à cette source via la méthode .subscribe()
    - on peut pousser une nouvelle donnéevia la methode next
  */
  private _movies$:BehaviorSubject<any> = new BehaviorSubject<any>([])

  /* injection d'un objet http de la classe HttpClient */
  constructor(private http:HttpClient) { }

  //on crée un getter pour encapsuler le subject et retourner uniquement l'observable
  public get movies$() : Observable<any>  {
    return this._movies$.asObservable();
  }

  public set movies$(movies:any)  {
    this._movies$.next(movies);
  }

  /* on retourne juste l'objet observable et non l'objet movies pour que l'observable soit
  du coté du composant qui gère la donnée, ce qui permet de le rendre reactive (comme ca si la liste de movie
    change, le composant gérant la donnée changera*/

  /* faire une requete HTTP à l'API theMovieDB
    et charger en valeur de movies$ la réponse (le tableau d'objets movies)
  */
  public getMoviesFromApi() {
    //next push la réponse dans movies$
    //on ne type pas l'apiResponse car potentiellement, le json pourrait avoir des propriétés en plus, et on veut pas péter si on les utilises pas
    this.http.get(this._url)
      .pipe(//on va convertir ici le tableau de "apiResponse.results" en tableau un tableau de MovieModel. On est obligé de faire 2 map car le results est un sous objet du premier objet reponse
          map( (apiResponse:any) =>
            apiResponse.results.map((movieFromApi:any) => new MovieModel(movieFromApi))
          )
        )//le pipe retourne un observable dont le resultat est un tableau de movie(sur lequel on peut subscribe)
      .subscribe(
        (response:Array<MovieModel>) => {
          console.log('movie chargés=',response)
          this._movies$.next(response)

        }
      )
  }

  /* faire une requete HTTP à l'API theMovieDB (sur la page suivante)
    - push dans le tableau de movies les 20 films suivants (on ajout aux film déjà chargés)
    - et charger en valeur de movies$ la réponse (le tableau d'objets movies). On aura 40 film au lieu de 20
  */
  public getNextMoviesFromApi() {
    this._currentPage+=1;
    let urlNextPage=this._url+'&page='+this._currentPage;

    /* pour que le code soit synchrone il faut qu'il soit dans le subscribe  */
    this.http.get(urlNextPage)
    .pipe(//on va convertir ici le tableau de apiResponse.results en tableau un tableau de MovieModel
          map( (apiResponse:any) =>
            apiResponse.results.map((movieFromApi:any) => new MovieModel(movieFromApi))
          )
        )//le pipe retourne un observable (sur lequel on peut subscribe)
    .subscribe((response:Array<MovieModel>) => {
      //il faut mettre les ... pour les 2 tableaux car on copie le contenu leur contenu
      let allMovies=[...this._movies$.getValue(),...response];

      //console.log("allMovies: ",allMovies);

      //on remet la liste complete dans le flux
      this._movies$.next(allMovies);

      //console.log(this._movies$.getValue()); -> permet de voir vraiment ce qu'il y a dans le flux retourné
    });
  }
}
