// ====================================
// DOM READY
// ====================================
document.addEventListener('DOMContentLoaded', () => {

  // ====================================
  // MOBILE MENU
  // ====================================
  const mobileBtn  = document.getElementById('mobileMenuBtn');
  const sidebar    = document.getElementById('sidebar');
  mobileBtn?.addEventListener('click', () => {
    mobileBtn.classList.toggle('active');
    sidebar.classList.toggle('open');
  });
  // Close sidebar when clicking outside
  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        !mobileBtn.contains(e.target)) {
      sidebar.classList.remove('open');
      mobileBtn.classList.remove('active');
    }
  });

  // ====================================
  // SMOOTH SCROLL & NAV ACTIVE
  // ====================================
  const navLinks = document.querySelectorAll('.sidebar__nav-link, .footer-links a, .btn[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = window.innerWidth <= 860 ? 60 : 0;
          window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
          // Close mobile menu
          sidebar.classList.remove('open');
          mobileBtn?.classList.remove('active');
        }
      }
    });
  });

  // ====================================
  // ACTIVE NAV ON SCROLL
  // ====================================
  const sections    = document.querySelectorAll('section[id]');
  const sidebarLinks = document.querySelectorAll('.sidebar__nav-link');
  const scrollOffset = 120;

  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - scrollOffset) {
        current = sec.id;
      }
    });
    sidebarLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-section') === current);
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // ====================================
  // SCROLL-TO-TOP BUTTON
  // ====================================
  const scrollTopBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    scrollTopBtn?.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ====================================
  // INTERSECTION OBSERVER — FADE ANIMATIONS
  // ====================================
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up, .fade-in-right').forEach(el => observer.observe(el));

  // ====================================
  // COUNTER ANIMATION
  // ====================================
  function animateCounter(el, target, suffix) {
    let start = null;
    const duration = 1800;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-count]').forEach(el => {
          const target = parseInt(el.getAttribute('data-count'));
          const suffix = el.getAttribute('data-suffix') || '';
          animateCounter(el, target, suffix);
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  const statsContainer = document.querySelector('.home-stats');
  if (statsContainer) counterObserver.observe(statsContainer);

  // ====================================
  // SKILL BARS
  // ====================================
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          const w = bar.getAttribute('data-width');
          setTimeout(() => { bar.style.width = w + '%'; }, 200);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('.skill-bar-wrap').forEach(el => skillObserver.observe(el));

  // ====================================
  // RESUME TABS
  // ====================================
  const tabs = document.querySelectorAll('.resume-tab');
  const panels = document.querySelectorAll('.resume-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById('tab-' + tab.getAttribute('data-tab'));
      if (target) {
        target.classList.add('active');
        // Re-trigger skill bar animations when skills tab is shown
        if (tab.getAttribute('data-tab') === 'skills') {
          target.querySelectorAll('.skill-fill').forEach(bar => {
            bar.style.width = '0';
            setTimeout(() => {
              bar.style.width = bar.getAttribute('data-width') + '%';
            }, 100);
          });
        }
        // Re-trigger fade animations in the new panel
        target.querySelectorAll('.fade-up:not(.visible)').forEach(el => {
          el.classList.add('visible');
        });
      }
    });
  });

  // ====================================
  // PORTFOLIO FILTER
  // ====================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      portfolioItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = '';
          item.style.animation = 'fadeIn 0.4s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ====================================
  // CONTACT FORM
  // ====================================
  const form = document.getElementById('contactForm');
  const formCard = document.getElementById('formCard');
  const formSuccess = document.getElementById('formSuccess');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    // Basic validation
    const email = document.getElementById('femail').value;
    const message = document.getElementById('fmessage').value;
    if (!email || !message) {
      // Shake animation for empty fields
      form.querySelectorAll('.form-control').forEach(input => {
        if (!input.value) {
          input.style.borderColor = '#ff0066';
          input.style.animation = 'shake 0.4s ease';
          setTimeout(() => { input.style.animation = ''; }, 500);
        }
      });
      return;
    }
    // Success state
    formCard.style.display = 'none';
    formSuccess.classList.add('show');
  });

  // ====================================
  // TYPING EFFECT FOR HOME SUBTITLE
  // ====================================
  const roles = ['a Developer & Designer.', 'a UI/UX Designer.', 'a Student Leader.', 'a Creative Coder.'];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingEl = document.querySelector('.home-subtitle span.accent');

  if (typingEl) {
    function typeRole() {
      const current = roles[roleIndex];
      if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      if (!isDeleting && charIndex === current.length) {
        isDeleting = true;
        setTimeout(typeRole, 1800);
        return;
      }
      if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeRole, 400);
        return;
      }
      setTimeout(typeRole, isDeleting ? 55 : 80);
    }
    setTimeout(typeRole, 1200);
  }

  // ====================================
  // HOVER TILT EFFECT ON CARDS
  // ====================================
  document.querySelectorAll('.service-card, .portfolio-item, .pricing-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height * 6).toFixed(2);
      const rotateY = (x / rect.width * 6).toFixed(2);
      card.style.transform = `translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease, box-shadow 0.28s ease, border-color 0.28s ease';
    });
  });

});

// ====================================
// CSS KEYFRAMES (injected)
// ====================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-6px); }
    40%     { transform: translateX(6px); }
    60%     { transform: translateX(-4px); }
    80%     { transform: translateX(4px); }
  }
`;
document.head.appendChild(styleSheet);

// URG HERO SECTION IMAGE PROFILE COURSEL 
 const images = [
    "assets/img1.jpg",
    "assets/img2.jpg",
    "assets/img3.jpg",
    "assets/img4.jpg",
    "assets/img5.jpg"
  ];

  const carousel = document.getElementById("profileCarousel");
  let index = 0;

  // Preload images (important for smoothness)
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  function changeImage() {
    carousel.style.opacity = "0";

    setTimeout(() => {
      carousel.style.backgroundImage = `url('${images[index]}')`;
      carousel.style.opacity = "1";
      index = (index + 1) % images.length;
    }, 500);
  }

  // Set first image immediately
  carousel.style.backgroundImage = `url('${images[0]}')`;
  index = 1;

  setInterval(changeImage, 3000);