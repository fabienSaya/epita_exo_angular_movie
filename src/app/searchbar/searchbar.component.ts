import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MovieModel } from '../shared/models/movie.model';
import { MovieService } from '../shared/services/movie.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {

  subscriptions:Subscription[] =[];
  foundMovies:MovieModel[] = [];

  constructor(
    public movieSvc: MovieService,//on le met public pour pouvoir y acceder dans le html pour la gestion de la subscription en async
  )
  {
    //ca permet de voir ce qu'il y a dans l'objet et notamment si foundMovies se met à jour
    console.log(this);
  }

  ngOnInit(): void {
    // this.subscriptions.push(
    //   this.movieSvc.foundMovies$.subscribe(
    //     (data:MovieModel[]) => {
    //       if(data != undefined  && data != null) {
    //         this.foundMovies=data;
    //       }
    //     }
    //   )
    // )

    //on s'abonne a foundMovies du service pour pouvoir récupérer ses données dans notre foundMovies local
    this.subscriptions.push(
      this.movieSvc.foundMovies$.subscribe(data => this.foundMovies=data)
    );
  }

  /**
   *
   * @param searchString
   * si moins de 3 caractères on ne déclenche pas la requete
   * si 0 caractères dans le champ de recherche, il faut que notre foundMovie soit resetté
   *
   */
  searchMoviesAction(searchString:string) {
    console.log("SearchString= ",searchString)

    if (searchString.length>2) {
      this.movieSvc.searchMoviesFromApi(searchString)
    } else {
      this.foundMovies=[];
    }
  }

  ngOnDestroy() {
    //comme on n'utilise plus le async pour la souscription au foundmovies, il faut qu'on détruise la souscription
    //sinon on quitte le comosant et qu'on revient, les anciennes souscription s'ajouterons aux nouvelles et
    //l'appelle au sujet souscrit se fera autant de fois qu'il y a de souscription
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

}
