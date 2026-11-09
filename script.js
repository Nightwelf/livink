const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

// One drawing for every scene: the motion comes from data-anim on the container.
const puppet = document.getElementById('puppet');
document.querySelectorAll('[data-puppet]').forEach(el => el.prepend(puppet.content.cloneNode(true)));

// Phone mockup: cycle through the animations; a tap on a chip picks one and restarts the cycle.
const stage = document.querySelector('.p-stage');
const chips = [...document.querySelectorAll('.p-anims button')];
let timer;

function play(i) {
  stage.dataset.anim = chips[i].dataset.anim;
  chips.forEach((c, j) => c.setAttribute('aria-pressed', j === i));
  clearTimeout(timer);
  if (!reduceMotion) timer = setTimeout(() => play((i + 1) % chips.length), 4500);
}
chips.forEach((c, i) => c.addEventListener('click', () => play(i)));
play(0);

// Motion recording timer, loops through the 10-second limit.
const clock = document.querySelector('[data-clock]');
let elapsed = 7;
if (!reduceMotion) setInterval(() => clock.textContent = fmt(elapsed = (elapsed + 1) % 11), 1000);

// Reveal on scroll.
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) {
    e.target.classList.add('in');
    io.unobserve(e.target);
  }
}), { rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Cursor spotlight on cards.
document.querySelectorAll('.card').forEach(card => card.addEventListener('pointermove', e => {
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${e.clientX - r.left}px`);
  card.style.setProperty('--my', `${e.clientY - r.top}px`);
}));
