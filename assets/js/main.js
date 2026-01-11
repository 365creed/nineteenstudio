(() => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  // year
  const y = $('[data-year]');
  if (y) y.textContent = new Date().getFullYear();

  // burger
  const burger = $('[data-burger]');
  const mnav = $('[data-mnav]');
  if (burger && mnav) {
    burger.addEventListener('click', () => {
      const open = !mnav.hasAttribute('hidden');
      if (open) {
        mnav.setAttribute('hidden', '');
        burger.setAttribute('aria-expanded', 'false');
      } else {
        mnav.removeAttribute('hidden');
        burger.setAttribute('aria-expanded', 'true');
      }
    });
  }

  // filter works
  const chips = $$('[data-filter]');
  const gallery = $('[data-gallery]');
  if (chips.length && gallery) {
    const items = $$('.work-card, .work', gallery);
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.classList.remove('is-active'));
        chip.classList.add('is-active');

        const type = chip.dataset.filter;
        items.forEach((it) => {
          const t = it.dataset.type || 'all';
          const show = (type === 'all') || (t === type);
          it.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // modal
  const modal = $('[data-modal]');
  if (modal) {
    const img = $('[data-modal-img]', modal);
    const title = $('[data-modal-title]', modal);
    const desc = $('[data-modal-desc]', modal);

    const close = () => modal.setAttribute('hidden', '');
    const open = (btn) => {
      const src = btn.dataset.img || '';
      const t = btn.dataset.title || '';
      const d = btn.dataset.desc || '';
      if (img) img.src = src;
      if (title) title.textContent = t;
      if (desc) desc.textContent = d;
      modal.removeAttribute('hidden');
    };

    $$('[data-modal-open]').forEach((btn) => {
      btn.addEventListener('click', () => open(btn));
    });

    $$('[data-modal-close]', modal).forEach((el) => {
      el.addEventListener('click', close);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hasAttribute('hidden')) close();
    });
  }

  // contact form => mailto (no email display)
  const form = $('#contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = (fd.get('name') || '').toString().trim();
      const email = (fd.get('email') || '').toString().trim();
      const type = (fd.get('type') || '').toString().trim();
      const range = (fd.get('range') || '').toString().trim();
      const message = (fd.get('message') || '').toString().trim();

      const subject = encodeURIComponent(`[NINETEEN] ${type || 'Project Inquiry'} - ${name}`);
      const body = encodeURIComponent(
        `Name/Company: ${name}\n` +
        `Reply Email: ${email}\n` +
        `Type: ${type}\n` +
        `Budget/Schedule: ${range}\n\n` +
        `Message:\n${message}\n`
      );

      // ✅ 여기만 너의 실제 수신 이메일로 바꿔 (페이지에 노출되지 않음)
      const to = 'hello@nineteenstudio.kr';

      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    });
  }

  // reveal
  const reveal = $$('[data-reveal]');
  if (reveal.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });

    reveal.forEach((el) => io.observe(el));
  }
})();
