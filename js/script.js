const settings = {
    speed: 100,
    foodColor: "red",
    backgroundColor: "black",
    snakeColor: "green"
}

// Carregando o snake com uma variável chamada "canvas".
let canvas = document.getElementById('snake');
// Contexto é a reinderização do Canvas que vai trabalhar com um plano 2D.
let context = canvas.getContext('2d'); 
// 32 pixels cada quadrado.
let box = 32;
let snake = []; // Criando um array.

// Passando o que vai ter dentro do array.
snake[0] = { // Definindo a posição.
    x: 8 * box, // Dando um tamanho.
    y: 8 * box
}

// Variável responsável pela a direção.
let direction = "right";
/**
 * Math.floor retira a parte flutuante.
 * Math.random varia as posições da comida no cenário do jogo.
*/
let food = {
    x: Math.floor(Math.random() * 15 + 1) * box,
    y: Math.floor(Math.random() * 15 + 1) * box
}

/**
 * Criando a função do Background.
 * Update: Alterado a cor de background para preto. 
 */
function criarBG(){
    // Definindo a cor. | fillstyle trabalha com o estilo do canvas.
    context.fillStyle = settings.backgroundColor;
    // Desenha onde vai acontecer o jogo e trabalha com 4 parâmetros.
    context.fillRect(0, 0, 16 * box, 16 * box);
}

/**
 * Função responsável pela a criação da cobrinha.
 * Update: Adicionei -1 no box para criar um espaço entre os quadrados da cobrinha.
 */
function criarCobrinha(){
    // for vai percorrer todo o tamanho do array e vai incrementar.
    for(i=0; i < snake.length; i++){
        // Definindo a cor.
        context.fillStyle = settings.snakeColor;
        // Passando o tamanho.
        context.fillRect(snake[i].x, snake[i].y, box-2, box-2);
    } // Fecha for
} // Fecha função criarCobrinha

// Função responsável pela a criação da comida.
function drawFood(){
    // Definindo a cor da comida.
    context.fillStyle = settings.foodColor;
    // Passando as posições quando o fillRect ir desenhar.
    context.fillRect(food.x, food.y, box, box)
}

// Evento de clique vai pegar a tecla e dar update.
document.addEventListener('keydown', update);

// Detectar evento de swipe em dispositivos móveis
document.addEventListener("touchstart", startTouch, false);
document.addEventListener("touchmove", moveTouch, false);

var swipeInitialX = null;
var swipeInitialY = null;

function startTouch(e) {
    swipeInitialX = e.touches[0].clientX;
    swipeInitialY = e.touches[0].clientY;
};

function moveTouch(e) {

  if(isSnakeOffScreen()) return;

  if (swipeInitialX === null) {
    return;
  }
  
  if (swipeInitialY === null) {
    return;
  }
  
  var currentX = e.touches[0].clientX;
  var currentY = e.touches[0].clientY;
  
  var diffX = swipeInitialX - currentX;
  var diffY = swipeInitialY - currentY;
  
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // sliding horizontally
    if (diffX > 0) {
      // swiped left
      console.log("swiped left");
      direction = "left";
    } else {
      // swiped right
      console.log("swiped right");
      direction = "right";
    }  
  } else {
    // sliding vertically
    if (diffY > 0) {
      // swiped up
      console.log("swiped up");
      direction = "up";
    } else {
      // swiped down
      console.log("swiped down");
      direction = "down";
    }  
  }
  
  swipeInitialX = null;
  swipeInitialY = null;

  e.preventDefault();
};


// Informando o código da tecla e criando a regra que não pode ser na direção oposta.
function update (event){
    if(isSnakeOffScreen()) return;
    if(event.keyCode == 37 && direction != "right") direction = "left";
    if(event.keyCode == 38 && direction != "down") direction = "up";
    if(event.keyCode == 39 && direction != "left") direction = "right";
    if(event.keyCode == 40 && direction != "up") direction = "down";
}

// Informa se a cobrinha saiu fora da tela
function isSnakeOffScreen() {
    return (snake[0].x > 15 * box 
        || snake[0].x < 0 
        || snake[0].y > 15 * box 
        || snake[0].y < 0)
}

// Função que carrega partes do jogo.
function iniciarJogo(){

    /** 
     * for para verificar se as posição estão se encontrando i - é o corpo da cobrinha.
     * Caso se encontrem, exibirá um alert informando que perdeu. 
    */
    for(i = 1; i < snake.length; i++){
        if(snake[0].x == snake[i].x && snake[0].y == snake[i].y){
            clearInterval(jogo);
            alert(`GAME OVER! Score: ${snake.length}`);
        }
    }

    /**
     * Criando a regra de ultrapassagem da tela(cenário) para voltar ao ponto incial.
     * Impedindo que a cobrinha suma!
    */
    if (isSnakeOffScreen()) {
        if(direction == "right") snake[0].x = 0;
        if(direction == "left") snake[0].x = 16 * box;
        if(direction == "down") snake[0].y = 0;
        if(direction == "up") snake[0].y = 16 * box;
    }

    // Carrega as funções.
    criarBG();
    criarCobrinha();
    drawFood();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    /** Coordenadas  - Movimento
     * Exemplo: Se a cobrinha ir para o lado direito, adiciona um quadrado, 
     * caso vá para esquerda, diminue um quadrado.
    */
    if(direction == "right") snakeX += box;
    if(direction == "left") snakeX -= box;
    if(direction == "up") snakeY -= box;
    if(direction == "down") snakeY += box;

    /**
     * Condição - Cobrinha comendo a comida.
     * Caso as posições da cobrinha e comida sejam diferentes, retira o último elemento.
     * Se não, ela aumenta e comida surge novamente aleatoriamente.
     */
    if(snakeX != food.x || snakeY != food.y){
        // Retirando o último elemento do array.
        snake.pop();
    }else{food.x = Math.floor(Math.random() * 15 + 1) * box;
        food.y = Math.floor(Math.random() * 15 + 1) * box;
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    }

    // Unshift - Acrescentando um elemento sempre na frente.
    snake.unshift(newHead);
}

// A cada 100 milisegundos o iniciarJogo vai estar sendo renovado caso trave. 
let jogo = setInterval(iniciarJogo, settings.speed);

function applySpeed(){
    const speedInput = document.getElementById("speed");
    settings.speed = (Number.parseInt(speedInput.max) + Number.parseInt(speedInput.min)) - Number.parseInt(speedInput.value);
    setSpeed(settings.speed);
}

function setSpeed(speed){
    clearInterval(jogo);
    jogo = setInterval(iniciarJogo, speed);
}
