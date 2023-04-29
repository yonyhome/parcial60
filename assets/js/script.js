var board = [];
var score = 0;
var rows = 4;
var columns = 4;
//cuando se carga la pagina se ejecuta la funcion setGame y actualiza el mejor puntaje
window.onload = function() {
  setGame();
  const best = localStorage.getItem("best");
  if (best) {
    document.getElementById("best").textContent = best;
  }
}

//funcion para comparar si el resultado actual es mejor que el mejor puntaje
function updateBest(score) {
    const best = parseInt(localStorage.getItem("best")) || 0;
    if (score > best && score < 2048) {
        document.getElementById("best").textContent = score;
        localStorage.setItem("best", score);
        document.getElementById("best").textContent = localStorage.getItem("best");
        console.log("best: " + localStorage.getItem("best"));
    }
  }

// Reiniciar el tablero y el marcador
function resetGame() {
  
  board = [    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

  // Reiniciar el marcador
  score = 0;

  // Actualizar el marcador en la página
  document.getElementById("score").innerText = score;

  // Actualizar las fichas en la página
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }

  // Generar dos nuevas fichas
  setTwo();
  setTwo();
}

//carga inicial del juego, inicializa el tablero y genera dos fichas aleatorias
function setGame() {
  for (let r = 0; r < rows; r++) {
    board[r] = Array(columns).fill(0);
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      updateTile(tile, 0);
      document.getElementById("board").append(tile);
    }
  }

  //create 2 to begin the game
  setTwo();
  setTwo();
}

//
function updateTile(tile, num) {
  tile.innerText = "";
  tile.classList.value = ""; 
  tile.classList.add("tile");
  if (num > 0) {
    tile.innerText = num.toString();
    if (num <= 4096) {
      tile.classList.add("x"+num.toString());
    } else {
      tile.classList.add("x8192");
    }                
  }
}
//leer los movimientos del teclado y llamar a las funciones correspondientes de movimientos
//los movimientos se realizan con las flechas del teclado(izquierda, derecha, arriba, abajo)

document.addEventListener('keyup', (e) => {
  if (e.code == "ArrowLeft") {
    slideLeft();
    setTwo();
  } else if (e.code == "ArrowRight") {
    slideRight();
    setTwo();
  } else if (e.code == "ArrowUp") {
    slideUp();
    setTwo();
  } else if (e.code == "ArrowDown") {
    slideDown();
    setTwo();
  }
  updateBest(score);
  document.getElementById("score").innerText = score;
  
});

function filterZero(row) {
  return row.filter(num => num != 0); 
}
//movimiento de las ficha
function slide(row) {
  row = filterZero(row); 
  for (let i = 0; i < row.length - 1; i++){
    if (row[i] == row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
      updateBest(score);
    }
  }
  row = filterZero(row); 
  while (row.length < columns) {
    row.push(0);
  } 
  return row;
}
//movimiento a la izquierda
function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}
//movimiento a la derecha

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];         
        row.reverse();
        row = slide(row)            
        board[r] = row.reverse();   
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}
//movimiento arriba

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

//movimiento abajo

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

//generar fichas aleatorias
function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}
//verificar si hay fichas vacias para poder crear otra nuevas
function hasEmptyTile() {
    let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) { 
                return true;
            }
        }
    }
    //se acaba el juego si no se pueden generar mas fichas
    if (count == 0) {
        alert("Tablero lleno, reinicia la partida");
    }
    return false;
}


