import React, { forwardRef } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// class Square extends React.Component {
//   render() {
//     return (
//       <button className="square" onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

// Squareを関数コンポーネントに書き換える
function Square(props) {
  // console.log(props.isHighlight);
  return (
    <>
      {props.isHighlight ? (
        <button className="square highlight" onClick={props.onClick}>
          {props.value}
        </button>
      ) : (
        <button className="square" onClick={props.onClick}>
          {props.value}
        </button>
      )}
    </>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
  }

  renderSquare(i) {
    let isHighlight = false;
    if (this.props.highlightArr) {
      isHighlight = this.props.highlightArr.includes(i);
    }
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isHighlight={isHighlight}
      />
    );
  }

  render() {
    return (
      <div>
        {Array(3)
          .fill(0)
          .map((row, i) => {
            return (
              <div className="board-row" key={row + i}>
                {Array(3)
                  .fill(0)
                  .map((col, j) => {
                    return this.renderSquare(i * 3 + j);
                  })}
              </div>
            );
          })}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      stepNumber: 0,
      xIsNext: true,
      cellArray: [],
      order: "desc",
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const cellArray = this.state.cellArray;

    // col, row
    let num = i + 1;
    let col = null;
    let row = null;
    if (num % 3 === 0) {
      col = 3;
    } else if (num % 3 === 2) {
      col = 2;
    } else {
      col = 1;
    }
    if (num <= 3) {
      row = 1;
    } else if (num <= 6) {
      row = 2;
    } else {
      row = 3;
    }

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares: squares }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      cellArray: cellArray.concat([[col, row]]),
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const cellArray = this.state.cellArray;

    const moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" +
          move +
          `(col: ${cellArray[move - 1][0]}, row: ${cellArray[move - 1][1]})`
        : "Go to game start";
      return (
        <li key={move}>
          {this.state.stepNumber === move ? (
            <button className="bold" onClick={() => this.jumpTo(move)}>
              {desc}
            </button>
          ) : (
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          )}
        </li>
      );
    });
    let order = this.state.order;
    const reverseOrder = () => {
      order === "desc"
        ? this.setState({ order: "ASC" })
        : this.setState({ order: "desc" });
    };
    let status;
    let highlightArr;
    if (winner) {
      status = "Winner: " + winner[0];
      highlightArr = winner[1];
    } else if (this.state.stepNumber === 9) {
      status = "引き分け";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            highlightArr={highlightArr}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => reverseOrder()}>{this.state.order}</button>
          <ol>{order === "desc" ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], [a, b, c]];
    }
  }
  return;
}
