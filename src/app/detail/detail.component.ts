import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  movieId:number=0;
  movieVideo:any;
  movie:any;

  subscription:Subscription = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    public movieSvc: MovieService,
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

    //on subscribe au movie$ pour avoir le movie
    // this.subscription = this.movieSvc.movie$.subscribe(data => {
    //     console.log('movie selectionné: ',data)
    //     this.movie=data
    //   }
    // )
  }

  getVideoUrl(videoKey:string) {
    let url= 'https://www.youtube.com/embed/'+videoKey;
    //pour gérer le XSS, sinon angular crie. On doit normalement lui passer une url qui est safe. faudrait s'assurer qu'il y a pas de script dans l'url. En s'assurant que dans videokey y'a pas de balise script.
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // ngOnDestroy() {
  //   this.subscription.unsubscribe()
  // }



}
