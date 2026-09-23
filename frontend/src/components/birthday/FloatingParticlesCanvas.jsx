import React, { useEffect, useRef } from 'react';

export default function FloatingParticlesCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle types: 'heart', 'star', 'circle'
    const particleCount = 45;
    const particles = [];

    const colors = ['#FF6FAE', '#C7A7FF', '#FFD166', '#FF9EAA', '#F472B6', '#FFFFFF'];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.size = Math.random() * 12 + 8;
        this.speedY = Math.random() * 0.8 + 0.3;
        this.speedX = Math.sin(Math.random() * Math.PI * 2) * 0.4;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.6 + 0.2;
        this.type = Math.random() > 0.4 ? 'heart' : Math.random() > 0.5 ? 'star' : 'circle';
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.02;
      }

      update() {
        this.y -= this.speedY;
        this.x += Math.sin(this.y * 0.01) * 0.5 + this.speedX;
        this.angle += this.spin;

        if (this.y < -50 || this.x < -50 || this.x > width + 50) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;

        if (this.type === 'heart') {
          ctx.beginPath();
          const topCurveHeight = this.size * 0.3;
          ctx.moveTo(0, topCurveHeight);
          ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
          ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size);
          ctx.bezierCurveTo(0, this.size, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
          ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
          ctx.fill();
        } else if (this.type === 'star') {
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            ctx.lineTo(Math.cos((i * Math.PI) / 2) * this.size, Math.sin((i * Math.PI) / 2) * this.size);
            ctx.lineTo(Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (this.size * 0.3), Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (this.size * 0.3));
          }
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
}
