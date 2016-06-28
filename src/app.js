import {div} from '@cycle/dom';
import _ from 'lodash';
import xs from 'xstream';

// TO DO:
// X Render Hello World
// X Render board
// X Render knight
// X Move knight to legal squares by clicking
// - Move knight to legal squares by dragging
//

function Board () {
  return  _.range(0, 8).map(() =>
    _.range(0, 8).map((square) => Square())
  );
}

function Square () {
  return {};
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

function hasKnight (knightPosition, rowIndex, squareIndex) {
  if (rowIndex === knightPosition.x && squareIndex === knightPosition.y) {
    return true;
  }

  return false;
}

function legalMove (knightPosition, squareCoordinates) {
  const moves = [
    {x: -2, y: -1},
    {x: -2, y: 1},
    {x: 2, y: -1},
    {x: 2, y: 1},
    {x: -1, y: -2},
    {x: -1, y: 2},
    {x: 1, y: -2},
    {x: 1, y: 2}
  ];

  const isLegal = moves.map(move => {
    return _.isEqual(squareCoordinates, { x: move.x + knightPosition.x, y: move.y + knightPosition.y });
  })
  .filter(isLegal => isLegal === true)[0];

  if (isLegal) { return true; }

  return false;
}

function renderRow (row, rowIndex, state) {
  return div('.row', row.map((square, index) => renderSquare(square, rowIndex, index, state)));
}

function renderSquare (square, rowIndex, squareIndex, state) {
  const black = isBlack(rowIndex, squareIndex);
  const knight = hasKnight(state.knightPosition, rowIndex, squareIndex);

  return div(
    `.square ${black ? 'black' : ''} ${knight ? 'knight' : ''}`,
    {
      attrs: {
        'data-row': rowIndex,
        'data-col': squareIndex
      }
    }
  );
}

function view (state) {
  return div('.board', state.board.map((row, index) => renderRow(row, index, state)));
};

function selectKnight () {
  return (state) => Object.assign({}, state, {knightSelected: !state.knightSelected});
}

function placeKnight (knightPosition) {
  return (state) => {
    const canMove = legalMove(state.knightPosition, knightPosition);

    if (!state.knightSelected || !canMove) { return state; }

    return Object.assign({}, state, {knightSelected: false, knightPosition});
  };
}

export default function main ({DOM}) {
  const knight$ = DOM
    .select('.knight')
    .events('click');

  const squareClick$ = DOM
    .select('.square:not(.knight)')
    .events('click');

  const selectKnight$ = knight$
    .map(_ => selectKnight());

  const placeKnight$ = squareClick$
  .map(ev => {
      const x = parseInt(ev.target.getAttribute('data-row'));
      const y = parseInt(ev.target.getAttribute('data-col'));

      return {x, y};
    }
  )
  .map(coord => placeKnight(coord));

  const action$ = xs.merge(
    selectKnight$,
    placeKnight$
  );

  const initialState = {
    board: Board(),
    knightPosition: {x: 0, y: 1},
    knightSelected: false
  };

  const state$ = action$
    .fold((state, action) => action(state), initialState);

  return {
    DOM: state$.map(state => view(state))
  };
}
