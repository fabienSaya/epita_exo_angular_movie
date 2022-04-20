import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  movieId:number=0;

  constructor( private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    //console.log(this.activatedRoute.snapshot.params)
    this.movieId= this.activatedRoute.snapshot.params['id'];
  }



}
