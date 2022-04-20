import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MovieModel } from '../models/movie.model';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  movieId:number=0;
  movieVideo:any;
  //movie:any;

  subscription:Subscription = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    public movieSvc: MovieService,//on le met public pour pouvoir y acceder dans le html pour la gestion de la subscription en async
    private sanitizer:DomSanitizer
    ) { }

  ngOnInit(): void {
    //console.log(this.activatedRoute.snapshot.params)
    this.movieId= this.activatedRoute.snapshot.params['id'];

    //on va récupérer la vidéo
    this.movieSvc.getVideosOfMovie(this.movieId)
      //on exécute la requete avec subscribe et dedans on indique ce qu'on fait de la reponse
      .subscribe(
          response => {
            //console.log(response)
            //on récupère la 1ere video de la liste qui est une video youtube
            this.movieVideo=response.results.find((el:any) => el.site=='YouTube')
            console.log("1ere video Youtube du movie: ",this.movieVideo);
          }
        );




    // on ne fait plus le subscribe dans le ts, mais directement dans la vue. Plus besoin de ca
    //on subscribe au movie$ pour avoir le movie
    // this.subscription = this.movieSvc.movie$.subscribe(data => {
    //     console.log('movie selectionné: ',data)
    //     this.movie=data
    //   }
    // )


    // --> Si on devait gérer le cas où on accede directement à la liste
    // exemple
    // this.subscription = this.movieSvc.movie$.subscribe(data => {
    //       if (data==undefined || data==null) {}
    //         //on fait une requete via le service pour le récupérer.
    //         this.movieSvc.getMovie(this.movieId)
    //       }
    //     )

    this.subscription =  this.movieSvc.movie$.subscribe(
      (data:MovieModel) => {
        if(data == undefined  || data == null) {
          this.movieSvc.getMovieFromApi(this.movieId);
        }
      }
    )
  }

  getVideoUrl(videoKey:string) {
    let url= 'https://www.youtube.com/embed/'+videoKey;
    //pour gérer le XSS, sinon angular crie. On doit normalement lui passer une url qui est safe. faudrait s'assurer qu'il y a pas de script dans l'url. En s'assurant que dans videokey y'a pas de balise script.
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  //on ne le fait plus dans le ts, mais directement dans la vue. Plus besoin de ca
  ngOnDestroy() {
    // this.subscription.unsubscribe()
  }
}
