// JavaGatchi - simple virtual pet
const JG_canvas = document.getElementById("JGCanvas");
const JG_ctx = JG_canvas.getContext("2d");

const JG_startWidth = 200;
const JG_startHeight = 60;
const JG_startX = (JG_canvas.width - JG_startWidth) / 2;
const JG_startY = (JG_canvas.height - JG_startHeight) / 2;
let JG_startRect = { x: JG_startX, y: JG_startY, width: JG_startWidth, height: JG_startHeight };

let hunger = 50;       // 0 (starved) - 100 (stuffed)
let cleanliness = 100; // 0 (filthy) - 100 (clean)
let health = 100;      // 0 (dead) - 100 (healthy)
var lastUpdate = Date.now();

function JG_getMousePos(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function JG_isInsideStart(pos, rect) {
  return pos.x > rect.x && pos.x < rect.x + rect.width &&
         pos.y > rect.y && pos.y < rect.y + rect.height;
}

function feedPet() {
  hunger = Math.min(100, hunger + 20);
}

function cleanPet() {
  cleanliness = Math.min(100, cleanliness + 30);
}

function keyDownHandler(e) {
  if (e.key === 'f' || e.key === 'F') {
    feedPet();
  } else if (e.key === 'c' || e.key === 'C') {
    cleanPet();
  }
}

document.addEventListener('keydown', keyDownHandler, false);

JG_canvas.addEventListener('click', function(evt) {
  const pos = JG_getMousePos(JG_canvas, evt);
  if (!JGGameRunning && JG_isInsideStart(pos, JG_startRect)) {
    JGGameRunning = true;
    JGInterval = setInterval(JG_draw, 50);
  }
}, false);

function JG_drawStartMenu() {
  JG_ctx.fillStyle = '#669999';
  JG_ctx.fillRect(JG_startRect.x, JG_startRect.y, JG_startRect.width, JG_startRect.height);
  JG_ctx.font = '18px Arial';
  JG_ctx.fillStyle = '#ffffff';
  JG_ctx.textAlign = 'center';
  JG_ctx.fillText('Adopt My Pet!', JG_canvas.width / 2, JG_canvas.height / 2 + 6);
}

function updatePet() {
  const now = Date.now();
  if (now - lastUpdate >= 1000) {
    hunger = Math.max(0, hunger - 1);
    cleanliness = Math.max(0, cleanliness - 0.5);

    if (hunger < 20 || hunger > 80) {
      health = Math.max(0, health - 2);
    } else if (health < 100) {
      health = Math.min(100, health + 1);
    }

    if (cleanliness < 20) {
      health = Math.max(0, health - 1);
    }

    lastUpdate = now;
  }

  if (health <= 0) {
    JGGameOver = true;
    clearInterval(JGInterval);
    JGInterval = null;
  }
}

function drawPet() {
  JG_ctx.beginPath();
  JG_ctx.arc(JG_canvas.width / 2, JG_canvas.height / 2, 30, 0, Math.PI * 2);
  JG_ctx.fillStyle = '#FFCC66';
  JG_ctx.fill();
  JG_ctx.closePath();
}

function drawStats() {
  JG_ctx.font = '16px Arial';
  JG_ctx.fillStyle = '#000';
  JG_ctx.textAlign = 'left';
  JG_ctx.fillText(`Health: ${Math.round(health)}`, 10, 20);
  JG_ctx.fillText(`Hunger: ${Math.round(hunger)}`, 10, 40);
  JG_ctx.fillText(`Cleanliness: ${Math.round(cleanliness)}`, 10, 60);
  JG_ctx.fillText('Press F to feed, C to clean', 10, 80);
}

function JG_draw() {
  JG_ctx.clearRect(0, 0, JG_canvas.width, JG_canvas.height);

  if (!JGGameRunning) {
    JG_drawStartMenu();
    return;
  }

  updatePet();
  drawPet();
  drawStats();

  if (JGGameOver) {
    JG_ctx.font = '24px Arial';
    JG_ctx.fillStyle = '#ff0000';
    JG_ctx.textAlign = 'center';
    JG_ctx.fillText('Your JavGatchi has died!', JG_canvas.width / 2, JG_canvas.height / 2);
  }
}

JG_drawStartMenu();
