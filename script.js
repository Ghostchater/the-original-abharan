// Viewport fix for mobile 100vh issues
(function(){
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  setVH();
  window.addEventListener('resize', setVH);
})();

// Intro timing, sparkle background, and minor motion
(function(){
  const intro = document.getElementById('intro');
  const skip = /[?&]skipIntro=1/.test(location.search) || location.hash === '#no-intro';
  if(skip){intro.style.display='none';}

  // Sparkle animation
  const canvas = document.getElementById('sparkle');
  const ctx = canvas.getContext('2d');
  const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  function resize(){
    canvas.width = innerWidth * DPR;
    canvas.height = innerHeight * DPR;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
  }
  resize();
  addEventListener('resize', resize);

  const N = 120;
  const particles = new Array(N).fill(0).map(spawn);

  function spawn(){
    const r = Math.random();
    const hue = 45 + Math.random()*20;
    return {
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      vx: (Math.random() - .5) * 0.05 * DPR,
      vy: (Math.random() - .5) * 0.05 * DPR,
      size: (r*r)*1.6*DPR + 0.3*DPR,
      alpha: 0.4 + Math.random()*0.6,
      t: Math.random()*Math.PI*2,
      hue
    };
  }

  function tick(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(const p of particles){
      p.t += 0.02;
      p.x += p.vx + Math.cos(p.t)*0.02*DPR;
      p.y += p.vy + Math.sin(p.t)*0.02*DPR;

      if(p.x < -10 || p.x > canvas.width+10 || p.y < -10 || p.y > canvas.height+10){
        Object.assign(p, spawn(), {x: (p.x+canvas.width)%canvas.width, y: (p.y+canvas.height)%canvas.height});
      }

      const grad = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size*3);
      grad.addColorStop(0, `hsla(${p.hue} 90% 65% / ${0.9*p.alpha})`);
      grad.addColorStop(0.5, `hsla(${p.hue} 95% 55% / ${0.35*p.alpha})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size*3, 0, Math.PI*2);
      ctx.fill();

      ctx.fillStyle = `hsla(${p.hue} 100% 90% / ${0.9*p.alpha})`;
      ctx.fillRect(p.x-0.5*DPR, p.y-2*p.size, DPR, 4*p.size);
      ctx.fillRect(p.x-2*p.size, p.y-0.5*DPR, 4*p.size, DPR);
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

// Popup message for unavailable socials
document.addEventListener("DOMContentLoaded", () => {
  const unavailable = document.querySelectorAll(".badge.fb, .badge.ig");
  const note = document.createElement("div");
  note.className = "unavailable-note";
  note.textContent = "Our Facebook and Instagram pages are under legal review. They will be live soon.";
  document.body.appendChild(note);

  unavailable.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      note.style.display = "block";
      setTimeout(() => { note.style.display = "none"; }, 3200);
    });
  });
});
