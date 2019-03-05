import { Component, OnInit, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type FieldState = number[][];
export type Direction = 'top' | 'right' | 'bottom' | 'left';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class FieldComponent implements OnInit {
  @HostListener('document:keydown.ArrowUp', ['$event.target']) arrowUp() {
    this.moveUp();
  }
  @HostListener('document:keydown.ArrowRight', ['$event.target']) arrowRight() {
    this.moveRight();
  }
  @HostListener('document:keydown.ArrowDown', ['$event.target']) arrowDown() {
    this.moveDown();
  }
  @HostListener('document:keydown.ArrowLeft', ['$event.target']) arrowLeft() {
    this.moveLeft();
  }
  private size = 4;
  private baseValue = 2;
  private state$ = new BehaviorSubject<FieldState>(new Array(this.size).fill(null).map(_ => new Array(this.size).fill(null)));

  constructor() { }

  ngOnInit() {
    console.log(this.state$.value);
    this.createRandom();
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
      alert('Game Over!')
      //throw new Error('Empty empties');
    }
    let coords = empties[Math.floor(Math.random() * empties.length)];
    field[coords[0]][coords[1]] = this.baseValue;
    this.state$.next(field);
  }
  moveUp() {
    let field = this.state$.value;
    for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
      for (let tileIndex = 0; tileIndex < this.size; tileIndex++) {
        const tileValue = field[rowIndex][tileIndex];
        if (tileValue !== null) {
          for (let searchIndex = rowIndex; searchIndex > 0; searchIndex--) {
            if (!this.mergeTiles(field, searchIndex, tileIndex, 'top')) {
              break;
            }
          }
        }
      }
    }
    this.createRandom();
  }

  moveRight() {
    let field = this.state$.value;
    for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
      for (let tileIndex = this.size - 1; tileIndex >= 0; tileIndex--) {
        const tileValue = field[rowIndex][tileIndex];
        if (tileValue !== null) {
          for (let searchIndex = tileIndex; searchIndex < this.size; searchIndex++) {
            if (!this.mergeTiles(field, rowIndex, searchIndex, 'right')) {
              break;
            }
          }
        }
      }
    }
    this.createRandom();
  }
  moveDown() {
    let field = this.state$.value;
    for (let rowIndex = this.size - 1; rowIndex >= 0; rowIndex--) {
      for (let tileIndex = 0; tileIndex < this.size; tileIndex++) {
        const tileValue = field[rowIndex][tileIndex];
        if (tileValue !== null) {
          for (let searchIndex = rowIndex; searchIndex < this.size; searchIndex++) {
            if (!this.mergeTiles(field, searchIndex, tileIndex, 'bottom')) {
              break;
            }
          }
        }
      }
    }
    this.createRandom();
  }
  moveLeft() {
    let field = this.state$.value;
    for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
      for (let tileIndex = 0; tileIndex < this.size; tileIndex++) {
        const tileValue = field[rowIndex][tileIndex];
        if (tileValue !== null) {
          for (let searchIndex = tileIndex; searchIndex > 0; searchIndex--) {
            if (!this.mergeTiles(field, rowIndex, searchIndex, 'left')) {
              break;
            }
          }
        }
      }
    }
    this.createRandom();
  }

  private mergeTiles(field: FieldState, rowIndex: number, tileIndex: number, direction: Direction) {
    const size = field.length;
    const tileValue = field[rowIndex][tileIndex];
    const destRowIndex = direction === 'top' ? rowIndex - 1 : direction === 'bottom' ? rowIndex + 1 : rowIndex;
    const destTileIndex = direction === 'left' ? tileIndex - 1 : direction === 'right' ? tileIndex + 1 : tileIndex;
    if (destRowIndex >= 0 && destRowIndex < size && destTileIndex >= 0 && destTileIndex < size) {
      if (field[destRowIndex][destTileIndex] === null) {
        field[destRowIndex][destTileIndex] = tileValue;
        field[rowIndex][tileIndex] = null;
        return true;
      } else if (field[destRowIndex][destTileIndex] === tileValue) {
        field[destRowIndex][destTileIndex] *= 2;
        field[rowIndex][tileIndex] = null;
        return false;
      }
      else {
        return false;
      }
    } else {
      return false;
    }
  }
}

