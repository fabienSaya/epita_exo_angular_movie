import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  movies:Array<any> =[];
  url:string ="https://api.themoviedb.org/3/discover/movie?api_key=d8cc8cac11048db08e0fdd11acbf66c1&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate";

  /* injection d'un objet http de la classe HttpClient */
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.http.get(this.url).subscribe(response=> console.log(response));
  }

}
