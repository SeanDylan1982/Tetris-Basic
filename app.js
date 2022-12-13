document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const width = 10
  let nextRandom = [0];
  let timerId
  let score = 0
  let levelDisplay = document.getElementById('level');
  const colors = [
    '#e09119',
    '#79e019',
    '#1976e0',
    '#a119e0',
    '#e0194b',
    '#4bf9ff'
  ]
  // The Tertrominoes Shapes
  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]
  const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]
  const sTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]
  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]
  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]
  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]
  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
  let currentPosition = 0
  let currentRotation = 0

  // play music
  const musicBtn = document.getElementById("music-btn")
  
  function playMusic() {
    let audio = new Audio("./audio/03. A-Type Music (Korobeiniki).mp3");
    audio.play(audio);
    audio.volume = 0.5;
  }
  musicBtn.addEventListener("click", playMusic);
//  console.log(theTetrominoes[0][0])

  // Randomly select a Tetromino and it's first rotation
  let random = Math.floor(Math.random()*theTetrominoes.length)
  let current = theTetrominoes[random][currentRotation]
  // Draw the selected Tetromino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }
  // Undraw the Tetromino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''

    })
  }

  // Assign controls to keycodes
  function control(e) {
    if(e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keyup', control)

function dropSpeed() {
  if (score < 90 ) {
    timerId = setInterval(moveDown, 1000)
  } else if (score >= 90 && score < 190) {
    timerId  = setInterval(moveDown,900)
  } else if (score >= 190 && score < 290) {
    timerId  = setInterval(moveDown,850)
  } else if (score >= 290 && score < 390) {
    timerId  = setInterval(moveDown,800)
  } else if (score >= 390 && score < 490) {
    timerId  = setInterval(moveDown,750)
  } else if (score >= 490 && score < 590) {
    timerId  = setInterval(moveDown,700)
  } else if (score >= 590 && score < 690) {
    timerId  = setInterval(moveDown,650)
  } else if (score >= 690 && score < 790) {
    timerId  = setInterval(moveDown,600)
  } else if (score >= 790 && score < 890) {
    timerId  = setInterval(moveDown,550)
  } else if (score >= 890 && score < 990) {
    timerId  = setInterval(moveDown,500)
  } else if (score >= 990) {
    timerId  = setInterval(moveDown,400)
  }
}
  // Move down function
  function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  // Freeze function
  function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //start a new tetromino falling
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
      
    }
  }

  // Move the Tetromino left unless there is a blockage or it is at the left edge
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if(!isAtLeftEdge) currentPosition -=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition +=1
    }
    draw()
  }
  // Move the Tetromino right unless there is a blockage or it is at the right edge
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
    if(!isAtRightEdge) currentPosition +=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -=1
    }
    draw()
  }
  /// Fix the rotation at the edges
  function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0)  
  }
  
  function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0)
  }
  
  function checkRotatedPosition(P){
    // Get the piece's current position.  Then, check if the piece is near the left side.
    P = P || currentPosition
    // Add 1 because the position index can be 1 less than where the piece is (with how they are indexed)
    if ((P+1) % width < 4) {
      // Use the piece's actual position to check if it's flipped over to right side
      if (isAtRight()){
        // If so, add one to wrap it back around
        currentPosition += 1
        // Check again.  Pass position from start, since long block might need to move more.
        checkRotatedPosition(P)
        }
    }
    else if (P % width > 5) {
      if (isAtLeft()){
        currentPosition -= 1
      checkRotatedPosition(P)
      }
    }
  }
  
  // Rotate the Tetromino
  function rotate() {
    undraw()
    currentRotation ++
    // If the current rotation gets to 4, make it go back to 0
    if(currentRotation === current.length) {
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    checkRotatedPosition()
    draw()
  }
  // Show up-next Tetromino in mini-grid display
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0


  // The Tetrominoes without rotations
  const upNextTetrominoes = [
    // lTetromino
    [1, displayWidth+1, displayWidth*2+1, 2],
    // zTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1],
    // tTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2],
    // oTetromino
    [0, 1, displayWidth, displayWidth+1],
    // iTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] 
  ]
  // Display the up-next shape in the mini-grid display
  function displayShape() {
    // Remove any trace of a tetromino from the entire grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }
  // Add score
  function addScore() {
    for (let i = 0; i < 199; i +=width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
      if(row.every(index => squares[index].classList.contains('taken'))) {
        levels()
        score +=10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
    dropSpeed()
  }
  // level up
  function levels() {
    if (score < 99 ) {
      levelDisplay.innerHTML = "1";
      timerId  = setInterval(950);
    } else if (score >= 99 && score < 199) {
      levelDisplay.innerHTML = "2";
      timerId  = setInterval(900);
    } else if (score >= 199 && score < 299) {
      levelDisplay.innerHTML = "3";
      timerId  = setInterval(850);
    } else if (score >= 299 && score < 399) {
      levelDisplay.innerHTML = "4";
      timerId  = setInterval(800);
    } else if (score >= 399 && score < 499) {
      levelDisplay.innerHTML = "5";
      timerId  = setInterval(750);
    } else if (score >= 499 && score < 599) {
      levelDisplay.innerHTML = "6";
      timerId  = setInterval(700);
    } else if (score >= 599 && score < 699) {
      levelDisplay.innerHTML = "7";
      timerId  = setInterval(650);
    } else if (score >= 699 && score < 799) {
      levelDisplay.innerHTML = "8";
      timerId  = setInterval(600);
    } else if (score >= 799 && score < 899) {
      levelDisplay.innerHTML = "9";
      timerId  = setInterval(550);
    } else if (score >= 899 && score < 999) {
      levelDisplay.innerHTML = "10";
      timerId  = setInterval(500);
    } else if (score >= 999) {
      levelDisplay.innerHTML = "11";
      timerId  = setInterval(40);
  };
  }
  // Add functionality to the button
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
    } nextRandom = Math.floor(Math.random()*theTetrominoes.length)
      displayShape()
  })

  // Game over!
  function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'Game Over!'
      clearInterval(timerId);
      let audio = new Audio('./audio/18. Game Over.mp3');
      audio.play('./audio/18. Game Over.mp3');
    }
  }
})