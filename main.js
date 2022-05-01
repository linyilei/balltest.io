// 设置画布

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const p=document.querySelector('p');
let num=0;

// 生成随机数的函数

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

function randomColor() {
  return 'rgb(' +
    random(0, 255) + ', ' +
    random(0, 255) + ', ' +
    random(0, 255) + ')';
}



function Shape(x, y, velX, velY, exist) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exist = exist;
}




function Ball(x, y, velX, velY, color, size, exist) {
  Shape.call(this, x, y, velX, velY, exist);
  this.color = color;
  this.size = size;
}

function EvilCircle(x, y, color, size, exist) {
  Shape.call(this, x, y, 20, 20, exist)
  this.color = color;
  this.size = size;
}



Ball.prototype = Object.create(Shape.prototype)
EvilCircle.prototype = Object.create(Shape.prototype)

EvilCircle.prototype.draw = function () {
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
}

EvilCircle.prototype.checkBounds = function () {
  if ((this.x + this.size) >= width) {
    this.x -= this.size;
  }

  if ((this.x - this.size) <= 0) {
    this.x += this.size;
  }

  if ((this.y + this.size) >= height) {
    this.y -= this.size;
  }

  if ((this.y - this.size) <= 0) {
    this.y += this.size;
  }
}

EvilCircle.prototype.setControls = function () {
  window.onkeydown = e => {
    switch (e.key) {
      case 'a':
        this.x -= this.velX;
        break;
      case 'd':
        this.x += this.velX;
        break;
      case 'w':
        this.y -= this.velY;
        break;
      case 's':
        this.y += this.velY;
        break;
    }
  };

  canvas.addEventListener('mousemove', function (e) {

  ev.x=e.offsetX;
  ev.y=e.offsetY;
  });
}

EvilCircle.prototype.collisionDetect = function () {
  for (let j = 0; j < balls.length; j++) {

    const dx = this.x - balls[j].x;
    const dy = this.y - balls[j].y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.size + balls[j].size) {
      balls[j].exist = false;
    }

  }
}






Ball.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

// let testBall = new Ball(50, 100, 4, 4, 'blue', 10);
// testBall.draw();

Ball.prototype.update = function () {
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
}

Ball.prototype.collisionDetect = function () {
  for (let j = 0; j < balls.length; j++) {
    if (this !== balls[j]) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (balls[j].exist&&distance < this.size + balls[j].size) {
        balls[j].color = this.color = randomColor();
      }
    }
  }
}

let balls = [];

while (balls.length < 25) {
  let size = random(10, 50);
  let ball = new Ball(
    // 为避免绘制错误，球至少离画布边缘球本身一倍宽度的距离
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomColor(),
    size,
    true
  );
  balls.push(ball);
}

let size = random(10, 50);
let ev = new EvilCircle(random(0 + size, width - size),
  random(0 + size, height - size), 'white',
  size, true);


ev.setControls();


function loop() {
  num=0;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < balls.length; i++) {
    if (balls[i].exist) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
      num++;
    }
    p.textContent=`有${num}个小球`
  }

  ev.checkBounds();
  ev.draw();
  ev.collisionDetect();


  requestAnimationFrame(loop);
}

loop();
