// Глобальные переменные
const introText = "У меня есть кое-что для тебя...";
const typeEl = document.getElementById("typewriter");
const startBtn = document.getElementById("startBtn");
const letter = "Несмотря на расстояние, ты всегда рядом со мной... Каждый день я думаю о тебе и скучаю. Но скоро мы увидимся! ❤️";
const letterEl = document.getElementById("letterText");
const images = ["photos/1.jpg", "photos/2.jpg", "photos/3.jpg"];
let current = 0;
const slide = document.getElementById("slideImage");
let i = 0, j = 0;
let currentSection = 'hero';
let animationFrame = null;

// Массив вопросов (можно добавить больше)
const questions = [
  {
    q: "Где мы познакомились?",
    a: ["В интернете", "В кафе", "В магазине"],
    correct: 0
  },
  {
    q: "Какой мой любимый цвет?",
    a: ["Синий", "Красный ❤️", "Зеленый"],
    correct: 1
  },
  {
    q: "Сколько мы уже вместе?",
    a: ["Меньше года", "Около года", "Больше года"],
    correct: 2
  }
];

let qIndex = 0;
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");

// Canvas
const canvas = document.getElementById("heartsCanvas");
const ctx = canvas.getContext("2d");
let hearts = [];
let animationActive = false;

// Устанавливаем размер canvas при загрузке и изменении окна
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Функция печатания текста
function typeWriter() {
  if (i < introText.length) {
    typeEl.innerHTML += introText.charAt(i);
    i++;
    setTimeout(typeWriter, 100); // Увеличил скорость для лучшей читаемости
  } else {
    // Убираем курсор после окончания печати
    typeEl.style.borderRight = 'none';
  }
}

// Запускаем печать при загрузке
window.onload = function() {
  typeWriter();
};

// Функция для скрытия всех секций
function hideAllSections() {
  document.querySelectorAll('section').forEach(section => {
    section.classList.add('hidden');
  });
}

// Функция для показа конкретной секции
function showSection(sectionClass) {
  hideAllSections();
  document.querySelector(sectionClass).classList.remove('hidden');
  currentSection = sectionClass;
}

// Обработчик кнопки "Открыть"
startBtn.onclick = () => {
  showSection('.letter');
  document.getElementById("bgMusic").play().catch(e => console.log("Автовоспроизведение заблокировано браузером"));
  startLetter();
};

// Функция печатания письма
function startLetter() {
  if (j < letter.length) {
    letterEl.innerHTML += letter.charAt(j);
    j++;
    setTimeout(startLetter, 50);
  } else {
    // Показываем кнопку для перехода к слайдеру
    setTimeout(() => {
      // Добавляем кнопку "Далее" в письмо
      const nextBtn = document.createElement('button');
      nextBtn.textContent = 'Дальше 💕';
      nextBtn.onclick = () => {
        showSection('.slider');
        loadSlider();
      };
      document.querySelector('.letter').appendChild(nextBtn);
    }, 1500);
  }
}

// Загрузка слайдера
function loadSlider() {
  // Проверяем, загружаются ли картинки
  slide.src = images[0];
  slide.onerror = function() {
    console.log("Ошибка загрузки изображения. Убедитесь, что папка photos существует и содержит изображения 1.jpg, 2.jpg, 3.jpg");
    alert("Не удалось загрузить фотографии. Проверьте папку photos!");
  };
}

// Навигация по слайдеру
document.getElementById("next").onclick = () => {
  current = (current + 1) % images.length;
  slide.src = images[current];
};

document.getElementById("prev").onclick = () => {
  current = (current - 1 + images.length) % images.length;
  slide.src = images[current];
};

// Загрузка вопроса
function loadQuestion() {
  if (qIndex >= questions.length) {
    // Если вопросы закончились, показываем предложение
    showSection('.proposal');
    return;
  }
  
  let q = questions[qIndex];
  questionEl.innerText = q.q;
  answersEl.innerHTML = "";

  q.a.forEach((answer, index) => {
    let btn = document.createElement("button");
    btn.innerText = answer;
    btn.onclick = () => {
      if (index === q.correct) {
        qIndex++;
        if (qIndex < questions.length) {
          loadQuestion();
        } else {
          showSection('.proposal');
        }
      } else {
        alert("Неправильно 😜 Попробуй еще раз!");
      }
    };
    answersEl.appendChild(btn);
  });
}

// Обработка кнопки "Нет"
const noBtn = document.getElementById("noBtn");

noBtn.addEventListener("mouseover", (e) => {
  if (currentSection === '.proposal') {
    const maxX = window.innerWidth - noBtn.offsetWidth;
    const maxY = window.innerHeight - noBtn.offsetHeight;
    
    noBtn.style.position = "fixed";
    noBtn.style.left = Math.random() * maxX + "px";
    noBtn.style.top = Math.random() * maxY + "px";
  }
});

noBtn.addEventListener("click", () => {
  alert("Так не пойдет! Нажми ДА! 💝");
});

// Обработка кнопки "Да"
document.getElementById("yesBtn").onclick = () => {
  showSection('.final');
  explodeHearts();
  
  // Останавливаем музыку и запускаем конфетти (если есть)
  const music = document.getElementById("bgMusic");
  if (music) {
    music.volume = 0.5;
  }
  
  // Создаем дополнительный эффект
  createPaperConfetti();
};

// Функция создания сердечек
function createHearts(count) {
  hearts = [];
  for (let i = 0; i < count; i++) {
    hearts.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 15 + 5,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.5
    });
  }
}

function drawHeart(x, y, size, opacity) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 15, size / 15);
  ctx.fillStyle = `rgba(220, 20, 60, ${opacity})`;
  ctx.beginPath();
  ctx.moveTo(0, 5);
  ctx.bezierCurveTo(-5, -5, -15, -5, 0, -15);
  ctx.bezierCurveTo(15, -5, 5, -5, 0, 5);
  ctx.fill();
  ctx.restore();
}

function animate() {
  if (!animationActive) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  hearts.forEach(h => {
    h.y += h.speed;
    if (h.y > canvas.height) {
      h.y = -10;
      h.x = Math.random() * canvas.width;
    }
    drawHeart(h.x, h.y, h.size, h.opacity);
  });
  
  animationFrame = requestAnimationFrame(animate);
}

function explodeHearts() {
  if (animationActive) {
    animationActive = false;
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  }
  
  animationActive = true;
  createHearts(50);
  animate();
  
  // Останавливаем через 10 секунд
  setTimeout(() => {
    animationActive = false;
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 10000);
}

// Функция для создания эффекта конфетти (простая версия)
function createPaperConfetti() {
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = '-10px';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
      confetti.style.borderRadius = '50%';
      confetti.style.zIndex = '1000';
      confetti.style.pointerEvents = 'none';
      confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear`;
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 5000);
    }, i * 50);
  }
}

// Добавляем CSS анимацию для конфетти
const style = document.createElement('style');
style.textContent = `
@keyframes fall {
  to { transform: translateY(100vh) rotate(360deg); }
}
`;
document.head.appendChild(style);

// Загружаем первый вопрос, но не показываем его сразу
loadQuestion();

// Добавляем обработку ошибок для аудио
const audio = document.getElementById('bgMusic');
audio.addEventListener('error', () => {
  console.log("Не удалось загрузить музыку. Убедитесь, что файл music.mp3 существует в папке.");
});

// Если пользователь кликает на слайдер, скрываем остальные секции
// и показываем тест после слайдера
let sliderViewed = false;
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.target.classList.contains('slider') && 
        !mutation.target.classList.contains('hidden') && 
        !sliderViewed) {
      sliderViewed = true;
      
      // Добавляем кнопку для перехода к тесту
      const nextQuizBtn = document.createElement('button');
      nextQuizBtn.textContent = 'Пройти тест 💭';
      nextQuizBtn.style.marginTop = '20px';
      nextQuizBtn.onclick = () => {
        showSection('.quiz');
        qIndex = 0; // Сбрасываем индекс вопросов
        loadQuestion();
      };
      
      // Удаляем старую кнопку, если есть
      const oldBtn = document.querySelector('.slider button');
      if (oldBtn) oldBtn.remove();
      
      document.querySelector('.slider').appendChild(nextQuizBtn);
    }
  });
});

observer.observe(document.querySelector('.slider'), { attributes: true, attributeFilter: ['class'] });
