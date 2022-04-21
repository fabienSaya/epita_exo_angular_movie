import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MovieModel } from '../shared/models/movie.model';
import { MovieService } from '../shared/services/movie.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  movieId:number=0;
  movieVideo:any;
  //movie:any;

  subscriptions:Subscription[] =[];

  constructor(
    private activatedRoute: ActivatedRoute,
    public movieSvc: MovieService,//on le met public pour pouvoir y acceder dans le html pour la gestion de la subscription en async
    private sanitizer:DomSanitizer
    ) { }

  ngOnInit(): void {
    //console.log(this.activatedRoute.snapshot.params)
    this.movieId= this.activatedRoute.snapshot.params['id'];

  console.log("detail du movie: ",this.movieId)

    //on met dans un tableau toutes nos souscription pour pouvoir les détruire à la fin
    this.subscriptions.push(
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
          ),


        // on ne fait plus le subscribe dans le ts, mais directement dans la vue. Plus besoin de ca
        //on subscribe au movie$ pour avoir le movie
        // this.subscription = this.movieSvc.movie$.subscribe(data => {
        //     console.log('movie selectionné: ',data)
        //     this.movie=data
        //   }
        // )


        // gestion du le cas où on accede directement au movie sans passer par la liste. Dans ce cas, data est vide, il faut donc faire la requete à movie
      this.movieSvc.movie$.subscribe(
        (data:MovieModel) => {
          if(data == undefined  || data == null || data.id!=this.movieId) {
            console.log("movie pas chargé donc on charge movie id= ",this.movieId)
            this.movieSvc.getMovieFromApi(this.movieId);
          } else {
            console.log("movie déja chargé, data= ",data)
            console.log("movie déja chargé, id= ",this.movieId)
          }

        }
      )
    )

    console.log(this.movieSvc.movie$)
  }

  getVideoUrl(videoKey:string) {
    let url= 'https://www.youtube.com/embed/'+videoKey;
    //pour gérer le XSS, sinon angular crie. On doit normalement lui passer une url qui est safe. faudrait s'assurer qu'il y a pas de script dans l'url. En s'assurant que dans videokey y'a pas de balise script.
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }


  ngOnDestroy() {
    //on détruit nos subscriptions (2 manières d'écrire)
    this.subscriptions.forEach(sub => sub.unsubscribe())

    /*for(let sub of this.subscriptions) {
      sub.unsubscribe()
    }*/

  }
}
