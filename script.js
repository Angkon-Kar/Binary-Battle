// ---------- CONFIG ----------
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwNe_xlRA1vF7r1M45N7AEwhbnNDgPxTOCJBtz1gVycFeONwYASagtdR-s-tZVeHNZY/exec";

document.addEventListener('DOMContentLoaded', () => {

  /* ========== Mobile nav ========== */
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const navMenu = document.querySelector('nav');
  hamburgerMenu.addEventListener('click', () => navMenu.classList.toggle('active'));

  /* ========== Intersection Observer for section entrance ========== */
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  sections.forEach(s => observer.observe(s));

  /* ========== Scroll progress & back to top ========== */
  const scrollBar = document.querySelector('.scroll-progress');
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollBar.style.width = percent + '%';
    backToTop.style.display = scrollTop > 300 ? 'block' : 'none';
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ========== T-shirt lightbox & tilt ========== */
  const tshirt = document.querySelector('.tshirt-demo img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeLightbox = document.getElementById('close-lightbox');

  if (tshirt) {
    tshirt.addEventListener('click', () => {
      lightbox.style.display = 'flex';
      lightboxImg.src = tshirt.src;
    });
    tshirt.addEventListener('mousemove', e => {
      const rect = tshirt.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      tshirt.style.transform = `rotateX(${y * 10}deg) rotateY(${x * 10}deg)`;
    });
    tshirt.addEventListener('mouseleave', () => tshirt.style.transform = '');
  }
  if (closeLightbox) closeLightbox.addEventListener('click', () => lightbox.style.display = 'none');
  if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.style.display = 'none' });

  /* ========== Countdown timer ========== */
  const countdownEl = document.getElementById('countdown');
  const contestDate = new Date("October 20, 2025 10:00:00").getTime();
  const countdownInterval = setInterval(() => {
    const now = Date.now();
    const distance = contestDate - now;
    if (distance <= 0) {
      countdownEl.textContent = "Contest Started!";
      clearInterval(countdownInterval);
      return;
    }
    const days = Math.floor(distance / (1000*60*60*24));
    const hours = Math.floor((distance % (1000*60*60*24)) / (1000*60*60));
    const minutes = Math.floor((distance % (1000*60*60)) / (1000*60));
    const seconds = Math.floor((distance % (1000*60)) / 1000);
    countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s left`;
  }, 1000);

  /* ========== Payment conditional fields ========== */
  const paymentSelect = document.getElementById("paymentMethod");
  const onlineFields = document.getElementById("onlineFields");
  const cashFields = document.getElementById("cashFields");

  if (paymentSelect) {
    paymentSelect.addEventListener("change", () => {
      onlineFields.style.display = paymentSelect.value === "online" ? "block" : "none";
      cashFields.style.display = paymentSelect.value === "cash" ? "block" : "none";
    });
  }

  /* ========== Form submit to Google Apps Script ========== */
  const regForm = document.getElementById('regForm');
  const formMsg = document.getElementById('formMsg');

  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      formMsg.textContent = "";
      const f = e.target;

      const payload = {
        name: f.name.value.trim(),
        batch: f.batch.value.trim(),
        department: f.department.value.trim(),
        email: f.email.value.trim(),
        tshirt: f.tshirt.value.trim(),
        phone: f.phone.value.trim(),
        payment: f.payment.value,
        transaction: f.transaction?.value.trim() || "",
        payphone: f.payphone?.value.trim() || "",
        crname: f.crname?.value.trim() || ""
      };

      if (!payload.name || !payload.batch || !payload.department || !payload.email || !payload.phone || !payload.payment) {
        formMsg.style.color = "orange";
        formMsg.textContent = "⚠️ Please fill all required fields.";
        return;
      }

      try {
        const res = await fetch("https://script.google.com/macros/s/AKfycbwNe_xlRA1vF7r1M45N7AEwhbnNDgPxTOCJBtz1gVycFeONwYASagtdR-s-tZVeHNZY/exec", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.result === "success") {
          formMsg.style.color = "lightgreen";
          formMsg.innerHTML = "✅ Registration successful!<br>Check your email for confirmation.<br>A VJudge link has been included.<br><br>If your payment info is correct, you’ll be officially assigned to the contest.";
          f.reset();
          onlineFields.style.display = "none";
          cashFields.style.display = "none";
        } else {
          formMsg.style.color = "salmon";
          formMsg.textContent = "❌ Submission failed. Try again later.";
        }
      } catch (err) {
        console.error(err);
        formMsg.style.color = "salmon";
        formMsg.textContent = "⚠️ Network or server error.";
      }
    });
  }

  /* ========== tsParticles setup ========== */
  if (window.tsParticles) {
    tsParticles.load("tsparticles", {
      background: { color: { value: "#121212" } },
      fpsLimit: 60,
      particles: {
        number: { value: 70, density: { enable: true, area: 900 } },
        color: { value: "#00ffc8" },
        shape: { type: "circle" },
        opacity: { value: 0.6 },
        size: { value: { min: 1, max: 4 } },
        links: { enable: true, color: "#00ffc8", distance: 140, opacity: 0.3, width: 1 },
        move: { enable: true, speed: 1.8, outModes: { default: "out" } }
      },
      interactivity: {
        events: { 
          onHover: { enable: true, mode: "repulse" }, 
          onClick: { enable: true, mode: "push" }, 
          resize: true 
        },
        modes: { repulse: { distance: 100 }, push: { quantity: 4 } }
      },
      detectRetina: true
    });
  }
});
// ---------- END CONFIG ----------
