var tela;
var c;

var canhao;
var laser;
var alien;
var barreira;
var pontos=0;

var canhaoX = 180;
var canhaoY = 529;
var laserX = 193;
var laserY = 520;
var alienX = 0;
var alienY = 0;
var inicioLaser = false;
var impactoLaserX;
var laserMovendo;
var intervalo = 30;
var posicao = 0;

var alienLinhas = [10, 40, 70, 100, 130, 160, 190, 220, 250, 280, 310];
var alienColunas = [55, 85, 115, 145, 175];
var aliensRestantes = [];

const C_ALTURA = 700;
const C_LARGURA = 500;

const TECLA_ESQUERDA = 37;
const TECLA_DIREITA = 39;
const TECLA_ACIMA = 38;

//sons
const shoot = new Audio(`Sounds/shoot.mp3`)
const backmusic = new Audio(`Sounds/backmusic.mp3`)
const alienexplosion = new Audio(`Sounds/alienexplosion.mp3`)

onkeydown = moverCanhao; // Define função chamada ao se pressionar uma tecla

iniciar(); // Chama função inicial do jogo

// Sub-rotinas (funções)
function iniciar() {
  tela = document.getElementById("tela");
  c = tela.getContext("2d");

  c.fillStyle = "#2c2c2c";
  c.fillRect(0, 0, C_LARGURA, C_ALTURA);

  carregarImagens();
  posicionarAlien();
  posicionarBarreiras();

  backmusic.play();
  backmusic.loop =true;
  backmusic.volume = 0.2

  setInterval("moverAliens()", intervalo);
  setInterval("alienAtingido()", 6);
}

function posicionarAlien() {
  for (var i = 0; i < alienLinhas.length; i++) {
    for (var j = 0; j < alienColunas.length; j++) {
      var novoAlien = {
        posX: alienLinhas[i],
        posY: alienColunas[j],
        foiAtingido: false,
      };
      aliensRestantes[aliensRestantes.length] = novoAlien;
    }
  }
}

function carregarImagens() {
  canhao = new Image();
  canhao.src = "sprites/canhao.png";
  canhao.onload = function () {
    c.drawImage(canhao, canhaoX, canhaoY);
  };

  laser = new Image();
  laser.src = "sprites/laser.png";

  alien = new Image();
  alien.src = "sprites/alien.png";

  barreira = new Image();
  barreira.src = "sprites/barreira.png";
  barreira.onload = function () {
    posicionarBarreiras();
  };
}

function posicionarBarreiras() {
  c.fillRect(125, 480, 40, 40);
  c.drawImage(barreira, 125, 480);
  c.drawImage(barreira, 250, 480);
  c.drawImage(barreira, 375, 480);
}

function moverAliens() {
  if (posicao <= 65) {
    alienX += 1;
    posicao += 1;
  } else if (posicao > 65 && posicao <= 80) {
    alienX += 1;
    alienY += 1;
    posicao += 1;
  } else if (posicao > 80 && posicao <= 147) {
    alienX -= 1;
    posicao += 1;
  } else if (posicao > 147 && posicao < 162) {
    alienX -= 1;
    alienY += 1;
    posicao += 1;
  } else {
    posicao = 0;
  }

  for (var i = 0; i < aliensRestantes.length; i++) {
    if (!aliensRestantes[i].foiAtingido) {
      c.fillRect(
        alienX + aliensRestantes[i].posX,
        alienY + aliensRestantes[i].posY,
        30,
        30
      );
      c.drawImage(
        alien,
        alienX + aliensRestantes[i].posX,
        alienY + aliensRestantes[i].posY
      );

      if (aliensRestantes[i].posY + alienY + 23 >= 450) {
        fimDeJogo();
      }
    }
  }
}

function alienAtingido() {
  for (var i = 0; i < aliensRestantes.length; i++) {
    if (
      laserY >= alienY + aliensRestantes[i].posY &&
      laserY <= alienY + aliensRestantes[i].posY + 20 &&
      impactoLaserX >= alienX + aliensRestantes[i].posX - 5 &&
      impactoLaserX <= alienX + aliensRestantes[i].posX + 18
    ) {
      if (!aliensRestantes[i].foiAtingido) {
        c.fillStyle = "#2c2c2c";
        c.fillRect(
          alienX + aliensRestantes[i].posX - 1,
          alienY + aliensRestantes[i].posY - 1,
          30,
          30
        );
        aliensRestantes[i].foiAtingido = true;
        c.fillRect(impactoLaserX, laserY, 6, 19);
        laserY = 0;

        setInterval("moverAliens()", 400);

        if (i > 32) {
          pontos += 10;
        } else if (i > 10) {
          pontos += 20;
        } else {
          pontos += 40;
        }

        alienexplosion.play()
      }
    }
  }
}

function fimDeJogo() {
  canhaoX = 180;
  laserX = 195;
  laserY = 520;
  alienX = 0;
  alienY = 0;
  posicao = 0;
  aliensRestantes = [];
  inicioLaser = false;

  c.fillStyle = "#2c2c2c";
  c.fillRect(0, 0, C_LARGURA, C_ALTURA);

  c.textAlign = "center";
  c.font = "50px Monaco,monospace";
  c.fillStyle = "#EEEE";
  c.fillText("Fim de Jogo", C_LARGURA / 2, C_ALTURA / 2);
  onkeydown = null;

  updateLocalStorage();
}

function moverCanhao(tecla) {
  var codigo = tecla.keyCode;

  if (codigo == TECLA_DIREITA && canhaoX <= 360) {
    c.fillStyle = "#2c2c2c";
    c.fillRect(canhaoX, 530, 30, 30);
    canhaoX += 8;
    laserX += 8;
    c.drawImage(canhao, canhaoX, canhaoY);
  }

  if (codigo == TECLA_ESQUERDA && canhaoX >= 9) {
    c.fillStyle = "#2c2c2c";
    c.fillRect(canhaoX, 530, 30, 30);
    canhaoX -= 8;
    laserX -= 8;
    c.drawImage(canhao, canhaoX, canhaoY);
  }

  if (codigo == TECLA_ACIMA && !inicioLaser) {
    inicioLaser = true;
    c.drawImage(laser, laserX, laserY);
    impactoLaserX = laserX;
    laserMovendo = setInterval("dispararLaser()", 5);
  }
}

function dispararLaser() {
  if (inicioLaser && laserY >= 60) {
    laserY -= 10;
    c.fillStyle = "#2c2c2c";
    c.fillRect(impactoLaserX, laserY + 10, 6, 19);

    if (laserY >= 70) {
      c.drawImage(laser, impactoLaserX, laserY);
    }
    shoot.play();
  }
  if (laserY < 60) {
    clearInterval(laserMovendo);
    inicioLaser = false;
    laserY = 500;
  }
}

function updateLocalStorage() {
  var pessoa = {
    nome: prompt("Nome: "),
    pontos: pontos,
  };

  // resgatando valor do ranking
  let ranking = localStorage.getItem("ranking");

  if (ranking) {
    // ransformar em objeto javascript
    let arrayRanking = JSON.parse(ranking);
    arrayRanking.push(pessoa);
    bubbleSort(arrayRanking);
    console.log(arrayRanking);
    localStorage.setItem("ranking", JSON.stringify(arrayRanking));
  } else {
    let arr = [pessoa];
    localStorage.setItem("ranking", JSON.stringify(arr));
  }
}

function bubbleSort(v) {
  var aux;

  for (var i = 0; i < v.length - 1; i++) {
    for (var j = 0; j < v.length - 1 - i; j++) {
      if (v[j].pontos < v[j + 1].pontos) {
        aux = v[j];
        v[j] = v[j + 1];
        v[j + 1] = aux;
      }
    }
  }
}
