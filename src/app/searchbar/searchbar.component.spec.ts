import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AppRoutingModule } from '../app-routing.module';
import { AppComponent } from '../app.component';
import { MovieModel } from '../shared/models/movie.model';
import { MovieService } from '../shared/services/movie.service';

import { SearchbarComponent } from './searchbar.component';

describe('SearchbarComponent', () => {
  let component: SearchbarComponent;
  let fixture: ComponentFixture<SearchbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchbarComponent ],
      providers: [{provide: MovieService, useClass:MockMovieService}],

    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('searchMoviesAction should not look for data if searchstring <3 char', () => {
    component.searchMoviesAction("a");
    expect(component.foundMovies).toEqual([]);
  });

  it('searchMoviesAction should  look for data if searchstring >2 char', () => {
    /*component.searchMoviesAction("abc");
    expect(component.foundMovies).toEqual([]);*/
  });

});

/**
 * on crée une class de mock (on pourrait la sortir de là si on devait l'utiliser à plusieurs endroit je pense)
 *
 */
class MockMovieService {
  movies:MovieModel[] = [
    {
      id: 1,
      titre: "film1",
      description: "desc film1",
      image: "image1.jpg",
      score: 2,
      date: new Date()
    },
    {
      id: 2,
      titre: "film2",
      description: "desc film2",
      image: "image2.jpg",
      score: 1,
      date: new Date()
    },
    {
      id: 3,
      titre: "film3",
      description: "desc film3",
      image: "image3.jpg",
      score: 4,
      date: new Date()
    }
  ];

  private _movies$ = of(this.movies);//ca créé un observable a partir d'une liste d'objet

  public get foundMovies$() : Observable<MovieModel[]>  {
    return this._movies$;
  }
}
