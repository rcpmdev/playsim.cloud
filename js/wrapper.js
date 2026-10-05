document.addEventListener("DOMContentLoaded", function () {
  function startMarquee(carouselId, direction = "left", speed = 1) {
    const carousel = document.querySelector(`#${carouselId} .swiper-wrapper`);
    if (!carousel) {
      console.warn(`Carrossel ${carouselId} não encontrado`);
      return;
    }

    // Clonar slides para efeito infinito
    const slides = Array.from(carousel.children);
    slides.forEach(slide => carousel.appendChild(slide.cloneNode(true)));

    let position = 0;
    const firstSlide = carousel.firstElementChild;
    const slideWidth = firstSlide.offsetWidth;
    let animationFrame;
    let isAnimating = true;

    function animate() {
      if (!isAnimating) return;

      position += direction === "left" ? -speed : speed;
      carousel.style.transform = `translateX(${position}px)`;

      if (direction === "left" && position <= -slideWidth) {
        position += slideWidth;
        carousel.appendChild(carousel.firstElementChild);
      } else if (direction === "right" && position >= 0) {
        position -= slideWidth;
        carousel.insertBefore(carousel.lastElementChild, carousel.firstElementChild);
      }

      animationFrame = requestAnimationFrame(animate);
    }

    // Iniciar animação
    animate();

    // Otimização: pausar animação quando não visível
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isAnimating = entry.isIntersecting;
        if (isAnimating) {
          animate();
        } else {
          cancelAnimationFrame(animationFrame);
        }
      });
    }, {
      threshold: 0.1
    });

    observer.observe(carousel);

    // Limpar recursos quando necessário
    return () => {
      isAnimating = false;
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }

  // Iniciar carrosséis com configurações otimizadas
  const carousels = [
    { id: "carousel-right", direction: "right", speed: 0.5 },
    { id: "carousel-left", direction: "left", speed: 0.5 }
  ];

  // Pequeno delay para garantir que o DOM esteja pronto
  setTimeout(() => {
    carousels.forEach(carousel => {
      startMarquee(carousel.id, carousel.direction, carousel.speed);
    });
  }, 100);
});