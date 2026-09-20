import "./petal-burst.css";

const PETAL_COLOURS = ["#8c6254", "#b98f76", "#ece1d2", "#8f917d", "#ae845e"];

/** Small self-contained petal burst. Avoids pulling in a confetti dependency. */
export function burstPetals(originX, originY) {
  const canvas = document.createElement("canvas");
  canvas.className = "petal-burst";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const petals = Array.from({ length: 70 }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
    const speed = 4 + Math.random() * 8;
    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
      vy: Math.sin(angle) * speed,
      rw: 5 + Math.random() * 7,
      rh: 3 + Math.random() * 5,
      spin: (Math.random() - 0.5) * 0.25,
      rot: Math.random() * Math.PI,
      colour: PETAL_COLOURS[(Math.random() * PETAL_COLOURS.length) | 0],
      life: 0,
    };
  });

  let raf;
  const step = () => {
    ctx.clearRect(0, 0, w, h);
    let alive = false;

    for (const p of petals) {
      p.life += 1;
      p.vy += 0.16; // gravity
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.spin;

      const fade = Math.max(0, 1 - p.life / 110);
      if (fade <= 0 || p.y > h + 40) continue;
      alive = true;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = fade;
      ctx.fillStyle = p.colour;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.rw, p.rh, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (alive) {
      raf = requestAnimationFrame(step);
    } else {
      cancelAnimationFrame(raf);
      canvas.remove();
    }
  };
  step();
}
