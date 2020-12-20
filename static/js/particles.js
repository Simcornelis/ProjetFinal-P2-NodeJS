/**
 * This code is based on Franks laboratory's tutorials on particules.
 * https://www.youtube.com/channel/UCEqc149iR-ALYkGM6TG-7vQ
 */

window.addEventListener("load", async () => {
  const canvas = document.querySelector("canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particles = []; // all particles on screen

    class Particle {
      constructor(x, y, dx, dy, size) {
        Object.assign(this, { x, y, dx, dy, size });
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
      }

      update() {
        if (this.x > canvas.width + 10 || this.x < -10) this.dx = -this.dx;
        if (this.y > canvas.height + 10 || this.y < -10) this.dy = -this.dy;

        this.x += this.dx;
        this.y += this.dy;
        this.draw();
      }
    }

    function initParticles() {
      particles.splice(0); // clear
      const amount = canvas.width * canvas.height * 0.00005;
      for (let i = 0; i < amount; i++) {
        const x = Math.random() * innerWidth;
        const y = Math.random() * innerHeight;
        const dx = Math.random() * 2 - 1;
        const dy = Math.random() * 2 - 1;
        const size = Math.random() * 5 + 1;

        particles.push(new Particle(x, y, dx, dy, size));
      }
    }

    function distance(a, b) {
      return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    const distMax = 200; // 200px
    function connectParticles() {
      particles.forEach((a) => {
        particles.forEach((b) => {
          const dist = distance(a, b);
          if (dist < distMax) {
            ctx.lineWidth = (1 - dist / distMax) * 2; // from 0px to 2px
            ctx.strokeStyle = "#fffa";
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        });
      });
    }

    function animateParticles() {
      if (canvas.classList.contains("animate"))
        requestAnimationFrame(animateParticles);
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      particles.forEach((particle) => particle.update());
      connectParticles();
    }

    window.addEventListener("resize", () => {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      initParticles();
      if (!canvas.classList.contains("animate")) animateParticles();
    });

    initParticles();
    animateParticles();
  }
});
