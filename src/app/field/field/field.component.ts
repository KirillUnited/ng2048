import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type FieldState = number[][];

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})

export class FieldComponent implements OnInit {
  private size = 4;
  private state$ = new BehaviorSubject<FieldState>(new Array(this.size).fill(null).map(_ => new Array(this.size).fill(null)));

  constructor() { }

  ngOnInit() {
    console.log(this.state$.value);

  }
  createRandom() {
    let field = this.state$.value;
    let empties = [];
    this.state$.value.forEach((row, rowIndex) => {
      row.forEach((tile, tileIndex) => {
        if (tile === null) {
          empties.push([rowIndex, tileIndex]);
        }
      });
    });
    console.log(empties);
    if (empties.length === 0) {
      throw new Error('Empty empties');
    }
    let coords = empties[Math.floor(Math.random() * empties.length)];
    field[coords[0]][coords[1]] = 2;
    this.state$.next(field);
  }
}
