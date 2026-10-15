(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const progress = document.querySelector('.scroll-progress');
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = [...document.querySelectorAll('.nav-link')];

  document.getElementById('year').textContent = new Date().getFullYear();

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(contactForm);
      const name = String(formData.get('Name') || '').trim();
      const email = String(formData.get('Email') || '').trim();
      const message = String(formData.get('Message') || '').trim();
      const subject = `Portfolio contact from ${name}`;
      const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
      window.location.href = `mailto:chethanraj2001kn@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  // Split only display text into decorative spans; the original phrase remains available to assistive tech.
  const heroName = document.querySelector('.hero-name');
  if (heroName) {
    const nameText = heroName.textContent.replace(/\s+/g, ' ').trim();
    heroName.setAttribute('aria-label', nameText);
    let charIndex = 0;
    const splitTextNodes = node => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === Node.TEXT_NODE && child.textContent) {
          const fragment = document.createDocumentFragment();
          Array.from(child.textContent).forEach(character => {
            const letter = document.createElement('span');
            letter.className = 'name-char';
            letter.setAttribute('aria-hidden', 'true');
            letter.style.setProperty('--char-index', charIndex++);
            letter.textContent = character;
            fragment.appendChild(letter);
          });
          child.replaceWith(fragment);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          splitTextNodes(child);
        }
      });
    };
    splitTextNodes(heroName);
    heroName.classList.add('name-split');

    if (!reducedMotion) {
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
        if (!heroName.isConnected) return;
        heroName.querySelectorAll('.name-char').forEach((letter, index) => {
          letter.style.setProperty('--char-index', index);
        });
        heroName.classList.add('typewriter-ready', 'typewriter-active');
      });
    }
  }

  const headingTargets = document.querySelectorAll('.section-heading h2');
  headingTargets.forEach(heading => {
    heading.setAttribute('aria-label', heading.textContent.replace(/\s+/g, ' ').trim());
    [...heading.childNodes].forEach(node => {
      if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) return;
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          fragment.appendChild(document.createTextNode(part));
        } else {
          const word = document.createElement('span');
          word.className = 'type-word';
          word.setAttribute('aria-hidden', 'true');
          word.textContent = part;
          fragment.appendChild(word);
        }
      });
      node.replaceWith(fragment);
    });
    heading.classList.add('type-ready');
  });

  const typographyTargets = document.querySelectorAll(
    '.hero-tagline, .hero-copy, .about-copy p, .experience-card h3, .company-name, .education-card h3, .education-card .degree'
  );
  typographyTargets.forEach((element, index) => {
    element.classList.add('type-reveal');
    element.style.setProperty('--type-delay', `${Math.min(index % 4, 3) * 90}ms`);
  });

  if (reducedMotion || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.type-ready').forEach(element => element.classList.add('type-visible'));
    typographyTargets.forEach(element => element.classList.add('type-visible'));
  } else {
    const typographyObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('type-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -28px 0px' });
    document.querySelectorAll('.type-ready, .type-reveal').forEach(element => typographyObserver.observe(element));
  }

  const hero = document.querySelector('.hero');
  const heroLights = document.querySelector('.hero-lights');
  const updateScroll = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
    header.classList.toggle('scrolled', window.scrollY > 18);
    if (heroLights && !reducedMotion && window.scrollY < window.innerHeight) {
      heroLights.style.transform = `translate3d(0, ${window.scrollY * 0.09}px, 0)`;
    }
  };
  updateScroll();
  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });

  if (menuToggle && navLinks) {
    const closeMenu = () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
    };
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      navLinks.classList.toggle('open', open);
    });
    navItems.forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
    document.addEventListener('click', event => {
      if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
  }

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealElements.forEach(element => revealObserver.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add('is-visible'));
  }

  const orbitShowcase = document.querySelector('.orbit-showcase');
  if (orbitShowcase) {
    if (reducedMotion || !('IntersectionObserver' in window)) {
      orbitShowcase.classList.add('is-visible');
    } else {
      orbitShowcase.classList.add('motion-ready');
      const orbitObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12 });
      orbitObserver.observe(orbitShowcase);
    }
  }

  const sections = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navItems.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
  }

  if (finePointer && !reducedMotion) {
    const dot = document.querySelector('.cursor-dot');
    const glow = document.querySelector('.cursor-glow');
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let glowX = pointerX;
    let glowY = pointerY;
    let frame = 0;
    const moveCursor = () => {
      glowX += (pointerX - glowX) * 0.2;
      glowY += (pointerY - glowY) * 0.2;
      glow.style.left = `${glowX}px`;
      glow.style.top = `${glowY}px`;
      if (Math.abs(pointerX - glowX) + Math.abs(pointerY - glowY) > 0.5) {
        frame = requestAnimationFrame(moveCursor);
      } else {
        frame = 0;
      }
    };
    window.addEventListener('pointermove', event => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      dot.style.left = `${pointerX}px`;
      dot.style.top = `${pointerY}px`;
      document.body.classList.add('cursor-ready');
      const activeHero = event.target.closest('.hero');
      if (activeHero) {
        const rect = activeHero.getBoundingClientRect();
        activeHero.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
        activeHero.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
      }
      if (!frame) frame = requestAnimationFrame(moveCursor);
    }, { passive: true });

    document.querySelectorAll('a, button, .tilt-card').forEach(element => {
      element.addEventListener('pointerenter', () => document.body.classList.add('cursor-hover'));
      element.addEventListener('pointerleave', () => document.body.classList.remove('cursor-hover'));
    });

    document.querySelectorAll('[data-tilt], .tilt-card').forEach(card => {
      let rect;
      let resetTimer;
      card.addEventListener('pointerenter', () => {
        rect = card.getBoundingClientRect();
        card.style.transition = 'transform 180ms ease-out, border-color 250ms, box-shadow 250ms';
        clearTimeout(resetTimer);
      });
      card.addEventListener('pointermove', event => {
        rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const maxTilt = card.hasAttribute('data-tilt') ? 7 : 5;
        const rotateY = (x - 0.5) * maxTilt * 2;
        const rotateX = (0.5 - y) * maxTilt * 2;
        card.style.setProperty('--mx', `${x * 100}%`);
        card.style.setProperty('--my', `${y * 100}%`);
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px) scale(1.01)`;
      }, { passive: true });
      card.addEventListener('pointerleave', () => {
        card.style.transition = 'transform 500ms cubic-bezier(.2,.75,.25,1), border-color 250ms, box-shadow 250ms';
        card.style.transform = '';
        card.style.setProperty('--mx', '50%');
        card.style.setProperty('--my', '50%');
        resetTimer = setTimeout(() => { card.style.transition = ''; }, 520);
      });
    });

    document.querySelectorAll('.magnetic').forEach(element => {
      element.addEventListener('pointermove', event => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        element.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
      });
      element.addEventListener('pointerleave', () => { element.style.transform = ''; });
    });
  }
})();
