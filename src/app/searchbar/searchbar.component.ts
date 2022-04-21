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
  { }

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
  }

  searchMoviesAction(searchString:string) {
    console.log("SearchString= ",searchString)
    this.movieSvc.searchMoviesFromApi(searchString)
  }

  ngOnDestroy() {
    // this.subscriptions.forEach(sub => sub.unsubscribe())
  }

}
