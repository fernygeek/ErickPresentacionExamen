const slides = [...document.querySelectorAll('.slide')];
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentSlide = document.getElementById('currentSlide');
const totalSlides = document.getElementById('totalSlides');
const progressBar = document.getElementById('progressBar');
let index = 0;
let chartDrawn = false;
let countersAnimated = false;

totalSlides.textContent = String(slides.length).padStart(2, '0');

function showSlide(nextIndex) {
  slides[index].classList.remove('active');
  index = (nextIndex + slides.length) % slides.length;
  slides[index].classList.add('active');
  currentSlide.textContent = String(index + 1).padStart(2, '0');
  progressBar.style.width = `${((index + 1) / slides.length) * 100}%`;
  document.title = `${slides[index].dataset.title} | Presentación Web Neon`;

  if (slides[index].dataset.title === 'Estadísticas') {
    animateCounters();
    drawComplianceChart();
  }
}

function nextSlide() { showSlide(index + 1); }
function prevSlide() { showSlide(index - 1); }

prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') nextSlide();
  if (event.key === 'ArrowLeft' || event.key === 'PageUp') prevSlide();
  if (event.key === 'Home') showSlide(0);
  if (event.key === 'End') showSlide(slides.length - 1);
});

function animateCounters() {
  if (countersAnimated) return;
  countersAnimated = true;
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(counter => {
    const target = Number(counter.dataset.count);
    let value = 0;
    const step = Math.max(1, Math.ceil(target / 38));
    const interval = setInterval(() => {
      value += step;
      if (value >= target) {
        value = target;
        clearInterval(interval);
      }
      counter.textContent = value;
    }, 24);
  });
}

function drawComplianceChart() {
  if (chartDrawn) return;
  chartDrawn = true;
  const canvas = document.getElementById('complianceChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const data = [
    { label: 'Cumple', value: 6, color: '#46ffb0' },
    { label: 'Parcial', value: 9, color: '#ffd166' },
    { label: 'No cumple', value: 2, color: '#ff4d6d' }
  ];
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const width = canvas.width;
  const height = canvas.height;
  const originX = 80;
  const baseY = height - 48;
  const barWidth = 84;
  const gap = 70;
  const maxValue = Math.max(...data.map(item => item.value));

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'rgba(85, 231, 255, 0.08)';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(85, 231, 255, 0.32)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = baseY - (i * 42);
    ctx.beginPath();
    ctx.moveTo(46, y);
    ctx.lineTo(width - 34, y);
    ctx.stroke();
  }

  ctx.font = '16px Rajdhani, sans-serif';
  ctx.fillStyle = '#f5fbff';
  ctx.fillText('Matriz de cumplimiento del examen', 34, 32);

  data.forEach((item, i) => {
    const x = originX + i * (barWidth + gap);
    const barHeight = (item.value / maxValue) * 164;
    const y = baseY - barHeight;

    const gradient = ctx.createLinearGradient(0, y, 0, baseY);
    gradient.addColorStop(0, item.color);
    gradient.addColorStop(1, 'rgba(255,255,255,0.06)');
    ctx.fillStyle = gradient;
    ctx.shadowColor = item.color;
    ctx.shadowBlur = 16;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.shadowBlur = 0;

    ctx.strokeStyle = item.color;
    ctx.strokeRect(x, y, barWidth, barHeight);

    ctx.fillStyle = '#f5fbff';
    ctx.font = '22px Orbitron, sans-serif';
    ctx.fillText(item.value, x + 28, y - 12);

    ctx.fillStyle = '#9fb2c7';
    ctx.font = '15px Rajdhani, sans-serif';
    ctx.fillText(`${Math.round((item.value / total) * 100)}%`, x + 26, baseY + 24);
    ctx.fillText(item.label, x + 6, baseY + 42);
  });
}

showSlide(0);
