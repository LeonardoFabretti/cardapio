/* ============================================================
   A CORD — Cardápio Digital
   script.js
============================================================ */

// ── Ordem das seções (define a sequência do swipe) ───────────
const SECTION_ORDER = [
  'pratos-principais',
  'pratos-do-dia',
  'entradas',
  'saladas',
  'porcoes',
  'bebidas',
  'sobremesas'
];

// ── Referências ───────────────────────────────────────────────
const navLinks       = document.querySelectorAll('.category-nav__link');
const allSections    = document.querySelectorAll('.menu-section');
const btnTop         = document.getElementById('btnTop');
const btnVerCardapio = document.getElementById('btnVerCardapio');
const menuWrapper    = document.getElementById('cardapio');

// ── Seção ativa atual ─────────────────────────────────────────
let currentIndex = 0;

// ── Função principal: mostrar seção por id ────────────────────
function showSection(id, direction = 'none') {
  const newIndex = SECTION_ORDER.indexOf(id);
  if (newIndex === -1) return;

  // Remove classes de todas as seções
  allSections.forEach(s => {
    s.classList.remove('is-active', 'slide-in-left', 'slide-in-right');
  });

  const section = document.getElementById(id);
  if (!section) return;

  // Aplica direção de animação antes de ativar
  if (direction === 'left')  section.classList.add('slide-in-left');
  if (direction === 'right') section.classList.add('slide-in-right');

  section.classList.add('is-active');
  currentIndex = newIndex;

  // Atualiza link ativo e centraliza na nav
  navLinks.forEach(link =>
    link.classList.toggle('active', link.dataset.target === id)
  );
  const activeLink = document.querySelector(`.category-nav__link[data-target="${id}"]`);
  if (activeLink) {
    activeLink.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }

  // Anima os cards com escalonamento
  const cards = section.querySelectorAll('.card');
  cards.forEach(card => card.classList.remove('is-visible'));
  requestAnimationFrame(() => {
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add('is-visible'), i * 60);
    });
  });
}

// ── Clique nos links de categoria ─────────────────────────────
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId  = link.dataset.target;
    const newIndex  = SECTION_ORDER.indexOf(targetId);
    const direction = newIndex > currentIndex ? 'left' : 'right';
    showSection(targetId, direction);
    menuWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── Botão "Ver Cardápio" no hero ──────────────────────────────
if (btnVerCardapio) {
  btnVerCardapio.addEventListener('click', e => {
    e.preventDefault();
    showSection('pratos-principais');
    menuWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// ── Swipe entre seções (toque no celular) ─────────────────────
let touchStartX = 0;
let touchStartY = 0;

menuWrapper.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

menuWrapper.addEventListener('touchend', e => {
  const deltaX = e.changedTouches[0].clientX - touchStartX;
  const deltaY = e.changedTouches[0].clientY - touchStartY;

  // Só aciona se for swipe horizontal (ignora scroll vertical)
  if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY) * 1.5) return;

  if (deltaX < 0 && currentIndex < SECTION_ORDER.length - 1) {
    // Deslizou para esquerda → próxima seção
    showSection(SECTION_ORDER[currentIndex + 1], 'left');
    menuWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (deltaX > 0 && currentIndex > 0) {
    // Deslizou para direita → seção anterior
    showSection(SECTION_ORDER[currentIndex - 1], 'right');
    menuWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}, { passive: true });

// ── Botão "Voltar ao topo" ────────────────────────────────────
function toggleBtnTop() {
  btnTop.classList.toggle('is-visible', window.scrollY > 400);
}

btnTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', toggleBtnTop, { passive: true });

// ── Estado inicial: anima cards da primeira seção ─────────────
const initialSection = document.querySelector('.menu-section.is-active');
if (initialSection) {
  const cards = initialSection.querySelectorAll('.card');
  requestAnimationFrame(() => {
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add('is-visible'), i * 60);
    });
  });
}

toggleBtnTop();

// ── Modal de detalhes do prato ────────────────────────────────
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');
const modalImg     = document.getElementById('modalImg');
const modalName    = document.getElementById('modalName');
const modalDesc    = document.getElementById('modalDesc');
const modalPrice   = document.getElementById('modalPrice');

function openModal(card) {
  const img   = card.querySelector('.card__img');
  const name  = card.querySelector('.card__name');
  const desc  = card.querySelector('.card__desc');
  const price = card.querySelector('.card__price');

  modalImg.src         = img ? img.src.replace('w=400&h=220', 'w=800&h=500') : '';
  modalImg.alt         = img ? img.alt : '';
  modalName.textContent  = name  ? name.textContent  : '';
  modalDesc.textContent  = desc  ? desc.textContent  : '';
  modalPrice.textContent = price ? price.textContent : '';

  modalOverlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('is-open');
  document.body.style.overflow = '';
}

// Clique nos cards (delegação no document)
document.addEventListener('click', e => {
  const card = e.target.closest('.card');
  if (card) openModal(card);
});

// Fechar pelo botão ou clique fora do modal
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});

// Fechar com Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
