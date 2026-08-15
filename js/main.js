/* Orion Nexus — Shared behavior */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initStarfield();
  initScrollReveal();
  initFleetModal();
  initContactForm();
});

/* Mobile navigation */
function initNavigation() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !expanded);
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    });
  });
}

/* Canvas starfield on the home hero */
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];
  const numStars = 220;

  function resize() {
    const hero = canvas.parentElement;
    width = hero.clientWidth;
    height = hero.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createStars();
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.4 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.015 + 0.005
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    stars.forEach(star => {
      star.alpha += star.speed;
      const opacity = 0.35 + 0.45 * Math.abs(Math.sin(star.alpha));
      ctx.globalAlpha = opacity;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

/* Scroll reveal for .reveal elements */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
}

/* Fleet detail modal */
function initFleetModal() {
  const modal = document.getElementById('fleet-modal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close');
  const image = modal.querySelector('.modal-image');
  const title = modal.querySelector('.modal-title');
  const body = modal.querySelector('.modal-body');
  const openButtons = document.querySelectorAll('[data-modal]');

  function openModal(key) {
    const data = FLEET_DATA[key];
    if (!data) return;
    image.src = data.image;
    image.alt = data.alt;
    title.textContent = data.title;
    body.innerHTML = data.body;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      openModal(btn.dataset.modal);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}

/* Contact form (display-only handler) */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Transmission Sent';
    btn.disabled = true;
    setTimeout(() => {
      form.reset();
      btn.textContent = originalText;
      btn.disabled = false;
    }, 2500);
  });
}

/* Fleet modal content (used on fleet.html) */
const FLEET_DATA = {
  'orion-a1': {
    title: 'ORION-A1 — Autonomous Space Utility Rocket',
    image: 'assets/images/orion-a1.png',
    alt: 'ORION-A1 autonomous reusable rocket infographic',
    body: `
      <p>The ORION-A1 is a fully autonomous, crewless, reusable launch vehicle built for payload deployment, orbital operations, and precision return.</p>
      <ul>
        <li><strong>Height:</strong> 42.7 m &nbsp;|&nbsp; <strong>Diameter:</strong> 4.5 m</li>
        <li><strong>Lift-off mass:</strong> ~280,000 kg</li>
        <li><strong>Payload capacity:</strong> 21,000 kg to LEO</li>
        <li><strong>Propulsion:</strong> Methane (LCH4) + Liquid Oxygen (LOX)</li>
        <li><strong>Engines:</strong> 9 × main engines + 4 × vernier engines</li>
        <li><strong>Reusability:</strong> Up to 100 missions</li>
        <li><strong>Autonomy level:</strong> 100%</li>
        <li><strong>Landing accuracy:</strong> &lt; 5 meters</li>
        <li><strong>Power:</strong> Solar + batteries</li>
      </ul>
      <p><strong>Key features:</strong> autonomous launch-to-landing, AI-powered decisions, self-diagnostics, precision landing, modular design, and clean LOX/LCH4 propulsion.</p>
    `
  },
  'aegis-guardian': {
    title: 'Aegis Guardian — Debris Shield & Rescue Spacecraft',
    image: 'assets/images/aegis-guardian.png',
    alt: 'Aegis Guardian debris shield and rescue spacecraft infographic',
    body: `
      <p>Built to detect, deflect, and disable space debris before it threatens active satellites and orbital infrastructure.</p>
      <ul>
        <li><strong>Length:</strong> ~120 m &nbsp;|&nbsp; <strong>Diameter:</strong> ~28 m</li>
        <li><strong>Mass:</strong> ~180,000 kg</li>
        <li><strong>Crew:</strong> 2–4</li>
        <li><strong>Max velocity:</strong> 0.18c</li>
        <li><strong>Range:</strong> Unlimited (self-sustaining)</li>
        <li><strong>Operation mode:</strong> Autonomous / Manned</li>
      </ul>
      <p><strong>Core functions:</strong> debris detection, debris capture, debris disposal, and asset protection via interceptor arms and plasma shielding.</p>
    `
  },
  'kinetic-harvester': {
    title: 'Kinetic-Harvester Spacecraft',
    image: 'assets/images/kinetic-harvester.png',
    alt: 'Kinetic-Harvester spacecraft infographic',
    body: `
      <p>A specialized vessel that intercepts and processes high-speed space boulders at a relative standstill, absorbing kinetic energy and converting debris into usable fuel.</p>
      <ul>
        <li><strong>Diameter:</strong> ~50–100 m</li>
        <li><strong>Length:</strong> ~200–300 m</li>
        <li><strong>Mass:</strong> Variable</li>
        <li><strong>Crew:</strong> Minimal / Automated</li>
        <li><strong>Primary role:</strong> Kinetic harvesting, resource extraction, fuel production</li>
        <li><strong>Status:</strong> Concept design</li>
      </ul>
      <p><strong>Highlights:</strong> layered defense shield, resource harvesting, energy recovery, mass efficiency, and perfect equilibrium via counter-thrust.</p>
    `
  },
  'orion-d1': {
    title: 'ORION-D1 — Autonomous Space Debris Cleaner',
    image: 'assets/images/orion-d1.png',
    alt: 'ORION-D1 autonomous space debris cleaner infographic',
    body: `
      <p>ORION-D1 detects, captures, processes, and disposes of space debris without a human crew, making Earth orbit safer and more sustainable.</p>
      <ul>
        <li><strong>Height (with fairing):</strong> 52 m</li>
        <li><strong>Diameter:</strong> 6.5 m &nbsp;|&nbsp; <strong>Launch mass:</strong> ~120,000 kg</li>
        <li><strong>Payload capacity:</strong> 15,000 kg</li>
        <li><strong>Orbit:</strong> LEO / MEO</li>
        <li><strong>Propulsion:</strong> Methalox engines + ion thrusters</li>
        <li><strong>Power:</strong> Solar + batteries</li>
        <li><strong>Autonomy level:</strong> 100%</li>
        <li><strong>Reusability:</strong> Up to 50 missions</li>
      </ul>
      <p><strong>Capabilities:</strong> AI &amp; sensor-based detection, robotic arms/nets capture, debris shredding/melting, recyclable material storage, and safe waste disposal.</p>
    `
  },
  'orion-x1': {
    title: 'ORION-X1 Debris Sweeper',
    image: 'assets/images/orion-x1.png',
    alt: 'ORION-X1 debris sweeper infographic',
    body: `
      <p>A fully autonomous debris-removal spacecraft powered by AI navigation and advanced robotics, operating 24/7 to keep Earth orbit clean.</p>
      <ul>
        <li><strong>Length:</strong> ~85 m &nbsp;|&nbsp; <strong>Diameter:</strong> ~18 m</li>
        <li><strong>Mass:</strong> ~45,000 kg</li>
        <li><strong>Power source:</strong> Solar + battery</li>
        <li><strong>Mission duration:</strong> 10+ years</li>
        <li><strong>Operation:</strong> 24/7 continuous</li>
        <li><strong>AI system:</strong> Fully autonomous</li>
      </ul>
      <p><strong>Workflow:</strong> detect → approach → capture with robotic arm → process → recycle → dispose/reuse as fuel.</p>
    `
  },
  'solaris-sentinel': {
    title: 'Solaris Sentinel Explorer',
    image: 'assets/images/solaris-sentinel.png',
    alt: 'Solaris Sentinel Explorer deep-space spacecraft infographic',
    body: `
      <p>A deep-space, multi-mission spacecraft designed for long-duration exploration, planetary analysis, and space-weather monitoring.</p>
      <ul>
        <li><strong>Length:</strong> ~150 m &nbsp;|&nbsp; <strong>Wingspan:</strong> ~60 m</li>
        <li><strong>Mass:</strong> ~320,000 kg</li>
        <li><strong>Crew:</strong> 4–6</li>
        <li><strong>Max velocity:</strong> 0.25c</li>
        <li><strong>Range:</strong> Unlimited (closed-loop life support)</li>
        <li><strong>Artificial gravity:</strong> 0.8g (habitat ring)</li>
      </ul>
      <p><strong>Mission capabilities:</strong> deep-space exploration, planetary survey &amp; mapping, space-weather monitoring, asteroid/comet study, and search for extraterrestrial life.</p>
    `
  }
};
