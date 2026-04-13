import { useEffect, useRef } from "react";

export default function ParticlesCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d");
    let animationFrameId = null;
    let width = 0;
    let height = 0;
    let dots = [];

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      const totalDots = Math.min(50, Math.floor(window.innerWidth / 24));

      dots = Array.from({ length: totalDots }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.5,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        o: Math.random() * 0.45 + 0.18,
      }));
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      for (let index = 0; index < dots.length; index += 1) {
        for (let nextIndex = index + 1; nextIndex < dots.length; nextIndex += 1) {
          const dx = dots[index].x - dots[nextIndex].x;
          const dy = dots[index].y - dots[nextIndex].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 115) {
            context.beginPath();
            context.strokeStyle = `rgba(255,255,255,${0.11 * (1 - distance / 115)})`;
            context.lineWidth = 0.5;
            context.moveTo(dots[index].x, dots[index].y);
            context.lineTo(dots[nextIndex].x, dots[nextIndex].y);
            context.stroke();
          }
        }
      }

      dots.forEach((dot) => {
        context.beginPath();
        context.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        context.fillStyle = `rgba(255,255,255,${dot.o})`;
        context.fill();
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < 0 || dot.x > width) {
          dot.vx *= -1;
        }

        if (dot.y < 0 || dot.y > height) {
          dot.vy *= -1;
        }
      });

      animationFrameId = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas id="particles" ref={canvasRef} />;
}
