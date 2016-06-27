import {div} from '@cycle/dom';
import _ from 'lodash';
import xs from 'xstream';

// TO DO:
// X Render Hello World
// X Render board
// - Render knight
// - Move knight to legal squares by clicking
// - Move knight to legal squares by dragging
//

// function Knight () {

// }

function Board () {
  return  _.range(0, 8).map(() =>
    _.range(0, 8).map((square) => Square())
  );
}

function Square () {
  return {
    color: 'white'
  }
}

function isBlack (rowIndex, squareIndex) {
  if (rowIndex % 2 === 0 && squareIndex % 2 !== 0) {
    return true;
  } else if (rowIndex % 2 !== 0 && squareIndex % 2 === 0) {
    return true;
  } else {
    return false;
  }
}

function renderRow (row, rowIndex) {
  return div('.row', row.map((square, index) => renderSquare(square, rowIndex, index)));
}

function renderSquare (square, rowIndex, squareIndex) {
  const black = isBlack(rowIndex, squareIndex);

  return div(`.square ${black ? "black" : ""}`);
}

function view (state) {
  return div('.board', state.board.map((row, index) => renderRow(row, index)));
}

export default function main ({DOM}) {
  const initialState = {
    board: Board(),
    knightPosition: {x: 0, y: 0}
  }

  const state$ = xs.of(initialState);

  return {
    DOM: state$.map(view)
  }
}
