/**
 * particles.js
 * High-performance interactive monochrome starfield & constellation particles
 * Senior Frontend Optimized: 60fps rendering, squared-distance culling,
 * tab visibility pausing, and mobile-optimized particle distribution.
 */

(function() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let particles = [];
  const isMobile = width < 768;
  const particleCount = isMobile ? Math.min(Math.floor((width * height) / 22000), 35) : Math.min(Math.floor((width * height) / 14000), 75);
  const maxDistance = isMobile ? 100 : 135;
  const maxDistanceSq = maxDistance * maxDistance;

  const mouse = {
    x: null,
    y: null,
    radius: isMobile ? 90 : 160
  };

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * (isMobile ? 0.35 : 0.55);
      this.vy = (Math.random() - 0.5) * (isMobile ? 0.35 : 0.55);
      this.radius = Math.random() * 1.6 + 1.0;
      this.baseAlpha = Math.random() * 0.45 + 0.35;
      this.color = Math.random() > 0.4 ? 'rgba(255, 255, 255,' : 'rgba(200, 200, 200,';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) { this.x = 0; this.vx = -this.vx; }
      else if (this.x > width) { this.x = width; this.vx = -this.vx; }
      if (this.y < 0) { this.y = 0; this.vy = -this.vy; }
      else if (this.y > height) { this.y = height; this.vy = -this.vy; }

      // Mouse repulsion (optimized squared distance)
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distSq = dx * dx + dy * dy;
        const mouseRadiusSq = mouse.radius * mouse.radius;

        if (distSq < mouseRadiusSq && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = (mouse.radius - dist) / mouse.radius;
          const dirX = (dx / dist) * force * 1.4;
          const dirY = (dy / dist) * force * 1.4;
          this.x -= dirX;
          this.y -= dirY;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color} ${this.baseAlpha})`;
      ctx.fill();
    }
  }

  function init() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distSq = dx * dx + dy * dy;

        // Skip costly Math.sqrt if outside radius
        if (distSq < maxDistanceSq) {
          const dist = Math.sqrt(distSq);
          const alpha = (1 - dist / maxDistance) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }
  }

  let animationFrameId;
  let isRunning = true;

  function animate() {
    if (!isRunning) return;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connectParticles();

    animationFrameId = requestAnimationFrame(animate);
  }

  // Handle visibility changes to save battery & CPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
    } else {
      if (!isRunning && !prefersReducedMotion) {
        isRunning = true;
        animate();
      }
    }
  });

  // Debounced window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      init();
    }, 150);
  });

  // Only track mouse on devices with fine pointer
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });
  }

  init();

  if (prefersReducedMotion) {
    // Render single static frame for accessibility
    for (let i = 0; i < particles.length; i++) {
      particles[i].draw();
    }
    connectParticles();
  } else {
    animate();
  }
})();
