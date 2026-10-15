import { gsap, motionOK } from './motion';

/**
 * The \shoot easter egg. A hoop drops in from the top, the ball arcs out of the
 * terminal and either drops through the net (particles, "KOŠ! +2") or clangs off
 * the rim and falls out of the screen ("OBRUČ!"). Built imperatively in a fixed
 * overlay and removed when done, so it costs nothing until someone shoots.
 *
 * The hoop is two SVG layers with the ball between them: backboard and back rim
 * behind, front rim and net in front, which is what sells the ball going through.
 */

const BALL =
  '<svg viewBox="0 0 64 64" width="100%" height="100%"><circle cx="32" cy="32" r="30" fill="#F07A2A"/>' +
  '<g fill="none" stroke="#2A1206" stroke-width="2.4"><circle cx="32" cy="32" r="30"/>' +
  '<path d="M2 32H62M32 2V62M12 9C22 20 22 44 12 55M52 9C42 20 42 44 52 55"/></g></svg>';

const BACK =
  '<svg viewBox="0 0 220 210" width="100%" height="100%">' +
  '<rect x="10" y="2" width="200" height="128" rx="8" fill="rgba(255,255,255,0.05)" stroke="#F4F1FA" stroke-width="3"/>' +
  '<rect x="78" y="58" width="64" height="46" fill="none" stroke="#A07CFF" stroke-width="3.5"/>' +
  '<rect x="102" y="128" width="16" height="12" fill="#cfc8e0"/>' +
  '<path d="M60 142A50 11 0 0 1 160 142" fill="none" stroke="#B85A1C" stroke-width="5"/>' +
  '</svg>';

const FRONT =
  '<svg viewBox="0 0 220 210" width="100%" height="100%" style="overflow:visible">' +
  '<g data-net style="transform-origin:110px 142px" fill="none" stroke="#F4F1FA" stroke-opacity="0.85" stroke-width="1.6" stroke-linecap="round">' +
  '<path d="M61 144L80 204M80 150L92 206M100 153L104 207M120 153L116 207M140 150L128 206M159 144L140 204"/>' +
  '<path d="M61 144L92 206M80 150L104 207M100 153L116 207M120 153L104 207M140 150L116 207M159 144L128 206"/>' +
  '<path d="M68 170Q110 182 152 170M76 192Q110 200 144 192"/>' +
  '</g>' +
  '<path data-rim d="M60 142A50 11 0 0 0 160 142" fill="none" stroke="#F07A2A" stroke-width="6" stroke-linecap="round"/>' +
  '</svg>';

function el(html: string, css: Partial<CSSStyleDeclaration>): HTMLDivElement {
  const d = document.createElement('div');
  d.innerHTML = html;
  Object.assign(d.style, { position: 'absolute', left: '0', top: '0' }, css);
  return d;
}

let inFlight = false;

export function playShot(from: HTMLElement, lang: 'sr' | 'en'): Promise<boolean> {
  const made = Math.random() < 0.7;
  if (!motionOK() || inFlight) return Promise.resolve(made);
  inFlight = true;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const W = Math.min(230, vw * 0.46);
  const s = W / 220;
  const H = 210 * s;
  const hoopX = vw / 2 - W / 2;
  const hoopY = Math.max(96, vh * 0.14);
  const rimX = hoopX + 110 * s;
  const rimY = hoopY + 142 * s;
  const ballSize = 62 * s;

  const root = document.createElement('div');
  Object.assign(root.style, { position: 'fixed', inset: '0', zIndex: '95', pointerEvents: 'none', overflow: 'hidden' });
  root.setAttribute('aria-hidden', 'true');

  const box = { width: `${W}px`, height: `${H}px` };
  const back = el(BACK, { ...box, zIndex: '1' });
  const front = el(FRONT, { ...box, zIndex: '3' });
  const hoop = [back, front];
  gsap.set(hoop, { x: hoopX, y: hoopY });

  const a = from.getBoundingClientRect();
  const sx = Math.min(Math.max(a.left + 40, ballSize), vw - ballSize);
  const sy = Math.min(a.top, vh - ballSize);
  const ball = el(BALL, { width: `${ballSize}px`, height: `${ballSize}px`, zIndex: '2' });
  gsap.set(ball, { x: sx - ballSize / 2, y: sy - ballSize / 2, scale: 0.4, autoAlpha: 0 });

  const word = document.createElement('div');
  word.className = 'font-display';
  Object.assign(word.style, {
    position: 'absolute',
    left: '50%',
    top: '52%',
    zIndex: '4',
    fontSize: 'clamp(4.5rem, 17vw, 15rem)',
    whiteSpace: 'nowrap',
    // Violet with a dark outline, so it reads over the white surname as well as the dark stage.
    color: made ? '#A07CFF' : '#ff8a8a',
    webkitTextStroke: '2px #08060E',
    textShadow: made ? '0 0 60px rgba(124,77,255,0.9), 0 0 140px rgba(124,77,255,0.6)' : '0 0 50px rgba(255,90,90,0.5)',
  });
  word.innerHTML = made
    ? `${lang === 'sr' ? 'KOŠ!' : 'SWISH!'}<span style="font-family:'JetBrains Mono',monospace;font-size:0.22em;font-weight:500;vertical-align:top;margin-left:0.15em;color:#F4F1FA;-webkit-text-stroke:0">+2</span>`
    : lang === 'sr'
      ? 'OBRUČ!'
      : 'RIM OUT!';

  root.append(back, ball, front, word);
  document.body.appendChild(root);
  gsap.set(word, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.4, rotation: -8 });

  const net = front.querySelector<SVGGElement>('[data-net]');
  const peakY = Math.min(sy, rimY) - Math.max(140, vh * 0.22);
  const targetX = (made ? rimX : rimX + 46 * s) - ballSize / 2;
  const targetY = rimY - ballSize * 0.62;
  const D = 1.0;

  return new Promise((resolve) => {
    const tl = gsap.timeline({
      onComplete: () => {
        root.remove();
        inFlight = false;
        resolve(made);
      },
    });

    tl.from(hoop, { y: -(hoopY + H + 40), duration: 0.6, ease: 'back.out(1.5)' })
      .to(ball, { autoAlpha: 1, scale: 1, duration: 0.25, ease: 'back.out(2)' }, 0.25)
      .addLabel('shot', 0.55)
      .to(ball, { x: targetX, duration: D, ease: 'none' }, 'shot')
      .to(ball, { y: peakY, duration: D * 0.5, ease: 'power2.out' }, 'shot')
      .to(ball, { y: targetY, duration: D * 0.5, ease: 'power2.in' }, `shot+=${D * 0.5}`)
      .to(ball, { rotation: 720, duration: D, ease: 'none' }, 'shot')
      .addLabel('hit', `shot+=${D}`);

    if (made) {
      tl.to(ball, { y: rimY + 40 * s, scale: 0.92, duration: 0.28, ease: 'power1.in' }, 'hit')
        .to(net, { scaleY: 1.32, scaleX: 0.9, duration: 0.14, ease: 'power2.out', yoyo: true, repeat: 3 }, 'hit+=0.06')
        .to(ball, { y: vh + ballSize, rotation: 900, duration: 0.7, ease: 'power2.in' }, 'hit+=0.28')
        .add(() => burst(root, rimX, rimY, s), 'hit+=0.1');
    } else {
      tl.to(hoop, { x: hoopX + 6, duration: 0.05, yoyo: true, repeat: 5, ease: 'none' }, 'hit')
        .to(ball, { x: targetX + 180 * s, y: rimY - 150 * s, rotation: 980, duration: 0.38, ease: 'power2.out' }, 'hit')
        .to(ball, { y: vh + ballSize, x: targetX + 260 * s, rotation: 1200, duration: 0.75, ease: 'power2.in' }, 'hit+=0.38');
    }

    tl.to(word, { autoAlpha: 1, scale: 1, rotation: -4, duration: 0.55, ease: 'back.out(2.2)' }, 'hit+=0.12')
      .to(word, { autoAlpha: 0, y: -60, scale: 1.08, duration: 0.45, ease: 'power2.in' }, 'hit+=1.35')
      .to(hoop, { y: -(hoopY + H + 40), duration: 0.5, ease: 'power3.in' }, 'hit+=1.45');
  });
}

/** Violet and orange sparks out of the rim. */
function burst(root: HTMLElement, x: number, y: number, s: number) {
  const colors = ['#A07CFF', '#7C4DFF', '#F07A2A', '#F4F1FA'];
  for (let i = 0; i < 26; i++) {
    const p = document.createElement('div');
    const size = (4 + Math.random() * 7) * Math.max(s, 0.7);
    Object.assign(p.style, {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: Math.random() < 0.5 ? '999px' : '2px',
      background: colors[i % colors.length],
      zIndex: '4',
    });
    root.appendChild(p);
    const ang = (Math.PI * 2 * i) / 26 + Math.random() * 0.3;
    const dist = (90 + Math.random() * 120) * Math.max(s, 0.8);
    gsap.to(p, {
      x: Math.cos(ang) * dist,
      y: Math.sin(ang) * dist - 40,
      rotation: Math.random() * 360,
      opacity: 0,
      scale: 0.2,
      duration: 0.8 + Math.random() * 0.5,
      ease: 'power3.out',
      onComplete: () => p.remove(),
    });
  }
}
