import React, { useState, useCallback, useEffect } from 'react';
import './App.css';

const symbols = {
  x: 'X',
  o: '0',
};
const initTable = Array(9).fill(NaN);
const initSymbol = symbols.x;

const classNames = {
  [symbols.x]: 'cell-cross',
  [symbols.o]: 'cell-nought',
};

const winSets = [
  { cells: [0, 1, 2], class: 'win-line--hor-top'},
  { cells: [3, 4, 5], class: 'win-line--hor-mid'},
  { cells: [6, 7, 8], class: 'win-line--hor-low'},
  { cells: [0, 3, 6], class: 'win-line--vert-left'},
  { cells: [1, 4, 7], class: 'win-line--vert-mid'},
  { cells: [2, 5, 8], class: 'win-line--vert-right'},
  { cells: [0, 4, 8], class: 'win-line--diag-neg'},
  { cells: [2, 4, 6], class: 'win-line--diag-pos'},
];


const getNextSymbol = currentSymbol => currentSymbol === symbols.x ? symbols.o : symbols.x;

const set = (index, item) => array => [...array.slice(0, index), item, ...array.slice(index + 1)];

const getWinCombinationWinSet = (winSets) => (table) =>
  winSets.find(({ cells }) => table[cells[0]] === table[cells[1]] && table[cells[1]] === table[cells[2]]);

const getIsTie = table => table.every(cell => !!cell);

const getWinCombination = getWinCombinationWinSet(winSets);

const getIsBusyCell = (i, table) => !!table[i];

function App() {
  const [table, setTable] = useState(initTable);
  const [symbol, setSymbol] = useState(initSymbol);
  const [winSet, setWinSet] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const handleClick = useCallback((i) => () => {
    const isCellBusy = getIsBusyCell(i, table);
    if (isCellBusy || isGameOver) return;
    setTable(set(i, symbol));
    setSymbol(getNextSymbol);
  }, [symbol, table, isGameOver]);

  const restartGame = useCallback(() => {
    setTable(initTable);
    setSymbol(initSymbol);
    setWinSet(null);
    setIsGameOver(false);
  }, []);

  useEffect(() => {
    const winCombination = getWinCombination(table);
    const isTie = getIsTie(table);
    if (winCombination || isTie) {
      setIsGameOver(true);
    }
    if (winCombination) {
      setWinSet(winCombination)
    }
  }, [table]);

  return (
    <div className="App">
      <div className="table-wrapper">
        {table.map((item, i) => {
          return (
            <div className="cell-wrapper" key={i} onClick={handleClick(i)}>
              <div className={`cell ${classNames[item]}`}></div>
            </div>
          )
        })}
        <div className={`win-line ${winSet && `win-line--shown ${winSet.class}`}`}/>
      </div>
      <div className={`restart-button ${isGameOver && 'restart-button--shown'}`} onClick={restartGame}>
          RESTART
      </div>
    </div>
  );
}

export default App;
