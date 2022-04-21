import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss']
})
export class StarsComponent implements OnInit {
  @Input() score:any;
  @Input() scoreMax:any; //ie sur combien est le score

  scoreArray:number[] = []

  constructor() { }

  ngOnInit(): void {
    //création d'un tableau avec autant de case que d'étoile qu'on veut afficher.
    let nbStars= Math.floor(this.score/(this.scoreMax/5));//on affiche max 5 étoile, donc on ramene le score sur 5
    this.scoreArray=new Array(nbStars).fill(1) //on initialise les valeurs avec 1. La valeur n'a pas d'importance, c'est le nombre de  case qui compte.
  }

}
