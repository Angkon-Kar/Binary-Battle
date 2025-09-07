document.addEventListener('DOMContentLoaded', () => {
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const navMenu = document.querySelector('nav');
  const sections = document.querySelectorAll('.section');
  const scrollBar = document.querySelector('.scroll-progress');
  const backToTop = document.getElementById('backToTop');
  const tshirt = document.querySelector('.tshirt-demo img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeLightbox = document.getElementById('close-lightbox');
  const countdownEl = document.getElementById('countdown');

  // Hamburger menu
  hamburgerMenu.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  // Section animations
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.2});
  sections.forEach(section => observer.observe(section));

  // Scroll progress + back to top
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const percent = (scrollTop / docHeight) * 100;
    scrollBar.style.width = percent + '%';
    backToTop.style.display = scrollTop > 300 ? 'block' : 'none';
  });
  backToTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

  // T-shirt Lightbox
  tshirt.addEventListener('click', () => {
    lightbox.style.display = 'flex';
    lightboxImg.src = tshirt.src;
  });
  closeLightbox.addEventListener('click', () => lightbox.style.display = 'none');
  lightbox.addEventListener('click', e => { if(e.target === lightbox) lightbox.style.display='none'; });

  // Countdown Timer
  const contestDate = new Date("October 20, 2025 10:00:00").getTime();
  setInterval(() => {
    const now = new Date().getTime();
    const distance = contestDate - now;
    if(distance < 0){
      countdownEl.innerHTML = "Contest Started!";
      return;
    }
    const days = Math.floor(distance / (1000*60*60*24));
    const hours = Math.floor((distance%(1000*60*60*24))/(1000*60*60));
    const mins = Math.floor((distance%(1000*60*60))/(1000*60));
    const secs = Math.floor((distance%(1000*60))/1000);
    countdownEl.innerHTML = `${days}d ${hours}h ${mins}m ${secs}s left`;
  },1000);

  // Particles.js
  tsParticles.load("tsparticles", {
    particles: {
      number: { value: 80 },
      size: { value: 3 },
      move: { enable: true, speed: 2 },
      links: { enable: true, color: "#00ffc8" },
      color: { value: "#00ffc8" }
    }
  });
});
