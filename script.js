const introText = "У меня есть кое-что для тебя...";
const typeEl = document.getElementById("typewriter");
const startBtn = document.getElementById("startBtn");

let i = 0;
function typeWriter() {
  if (i < introText.length) {
    typeEl.innerHTML += introText.charAt(i);
    i++;
    setTimeout(typeWriter, 50);
  }
}
typeWriter();

startBtn.onclick = () => {
  document.querySelector(".hero").classList.add("hidden");
  document.querySelector(".letter").classList.remove("hidden");
  document.getElementById("bgMusic").play();
  startLetter();
};
const letter = "Несмотря на расстояние, ты всегда рядом со мной...";
const letterEl = document.getElementById("letterText");
let j = 0;

function startLetter() {
  if (j < letter.length) {
    letterEl.innerHTML += letter.charAt(j);
    j++;
    setTimeout(startLetter, 40);
  } else {
    setTimeout(() => {
      document.querySelector(".slider").classList.remove("hidden");
      document.querySelector(".quiz").classList.remove("hidden");
    }, 1000);
  }
}
const images = ["photos/1.jpg","photos/2.jpg","photos/3.jpg"];
let current = 0;
const slide = document.getElementById("slideImage");

document.getElementById("next").onclick = () => {
  current = (current + 1) % images.length;
  slide.src = images[current];
};

document.getElementById("prev").onclick = () => {
  current = (current - 1 + images.length) % images.length;
  slide.src = images[current];
};
const questions = [
  {
    q: "Где мы познакомились?",
    a: ["В интернете", "В кафе", "В магазине"],
    correct: 0
  }
];

let qIndex = 0;
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");

function loadQuestion() {
  let q = questions[qIndex];
  questionEl.innerText = q.q;
  answersEl.innerHTML = "";

  q.a.forEach((answer, index) => {
    let btn = document.createElement("button");
    btn.innerText = answer;
    btn.onclick = () => {
      if (index === q.correct) {
        document.querySelector(".proposal").classList.remove("hidden");
      } else {
        alert("Неправильно 😜");
      }
    };
    answersEl.appendChild(btn);
  });
}

loadQuestion();
const noBtn = document.getElementById("noBtn");

noBtn.addEventListener("mouseover", () => {
  noBtn.style.position = "absolute";
  noBtn.style.left = Math.random() * window.innerWidth + "px";
  noBtn.style.top = Math.random() * window.innerHeight + "px";
});

document.getElementById("yesBtn").onclick = () => {
  document.querySelector(".final").classList.remove("hidden");
  explodeHearts();
};
const canvas = document.getElementById("heartsCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let hearts = [];

function createHearts(count) {
  for (let i = 0; i < count; i++) {
    hearts.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 15 + 5,
      speed: Math.random() * 2 + 1
    });
  }
}

function drawHeart(x,y,s) {
  ctx.fillStyle = "crimson";
  ctx.beginPath();
  ctx.arc(x, y, s, 0, Math.PI*2);
  ctx.fill();
}

function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  hearts.forEach(h=>{
    h.y += h.speed;
    if(h.y > canvas.height) h.y = -10;
    drawHeart(h.x,h.y,h.size);
  });
  requestAnimationFrame(animate);
}

function explodeHearts() {
  createHearts(200);
  animate();
}
