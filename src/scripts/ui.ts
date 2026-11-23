/** Comportamentos globais de UI (compatíveis com View Transitions). */

export function initReveal(): void {
  const els = document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible), .reveal-mask:not(.is-visible)');
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  // O Chrome considera o clip-path do próprio alvo; para .reveal-mask observamos o pai.
  const targets = new Map<Element, HTMLElement>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          (targets.get(e.target) ?? e.target).classList.add('is-visible');
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
  );
  els.forEach((el) => {
    const watch = el.classList.contains('reveal-mask') && el.parentElement ? el.parentElement : el;
    targets.set(watch, el);
    io.observe(watch);
  });
}

let cursorStarted = false;
export function initCursor(): void {
  if (cursorStarted || !window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  cursorStarted = true;
  const dot = document.querySelector<HTMLElement>('.cursor-dot');
  const ring = document.querySelector<HTMLElement>('.cursor-ring');
  if (!dot || !ring) return;
  let x = -100, y = -100, rx = -100, ry = -100;
  window.addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
  const tick = (): void => {
    rx += (x - rx) * 0.18;
    ry += (y - ry) * 0.18;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  const label = ring.querySelector<HTMLElement>('[data-cursor-label]');
  document.addEventListener('pointerover', (e) => {
    const target = (e.target as Element | null)?.closest<HTMLElement>('[data-cursor]');
    if (target) {
      ring.classList.add('is-hover');
      if (label) label.textContent = target.dataset.cursor ?? '';
    } else {
      ring.classList.remove('is-hover');
      if (label) label.textContent = '';
    }
  });
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function toast(message: string): void {
  let host = document.getElementById('toast-host');
  if (!host) {
    host = document.createElement('div');
    host.id = 'toast-host';
    host.className = 'fixed z-[70] left-1/2 -translate-x-1/2 bottom-6 flex flex-col gap-2 items-center pointer-events-none';
    document.body.appendChild(host);
  }
  const el = document.createElement('div');
  el.className = 'glass-dark text-bone text-sm px-5 py-3 rounded-full shadow-lift animate-fade-up';
  el.textContent = message;
  host.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .4s';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 400);
  }, 2600);
}
