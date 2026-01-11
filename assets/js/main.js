(() => {
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => [...el.querySelectorAll(s)];

  // footer year
  qsa("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  // mobile nav
  const burger = qs("[data-burger]");
  const mnav = qs("[data-mnav]");
  if (burger && mnav) {
    burger.addEventListener("click", () => {
      const open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      mnav.hidden = open;
      document.body.style.overflow = open ? "" : "hidden";
    });
    qsa(".mnav__link").forEach(a => a.addEventListener("click", () => {
      burger.setAttribute("aria-expanded", "false");
      mnav.hidden = true;
      document.body.style.overflow = "";
    }));
  }

  // reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("is-revealed");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  qsa("[data-reveal]").forEach(el => io.observe(el));

  // works filter
  const chips = qsa("[data-filter]");
  const works = qsa(".work");
  if (chips.length && works.length) {
    chips.forEach(btn => {
      btn.addEventListener("click", () => {
        chips.forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const t = btn.dataset.filter;
        works.forEach(w => {
          const ok = (t === "all") || (w.dataset.type === t);
          w.style.display = ok ? "" : "none";
        });
      });
    });
  }

  // modal (works)
  const modal = qs("[data-modal]");
  const openers = qsa("[data-modal-open]");
  const closeEls = qsa("[data-modal-close]");
  const mImg = qs("[data-modal-img]");
  const mTitle = qs("[data-modal-title]");
  const mDesc = qs("[data-modal-desc]");

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
  }
  function openModal(btn) {
    if (!modal) return;
    const { title, desc, img } = btn.dataset;
    if (mTitle) mTitle.textContent = title || "";
    if (mDesc) mDesc.textContent = desc || "";
    if (mImg) {
      mImg.src = img || "";
      mImg.alt = title || "Work image";
    }
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  openers.forEach(btn => btn.addEventListener("click", () => openModal(btn)));
  closeEls.forEach(el => el.addEventListener("click", closeModal));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // contact form → mailto
  const form = qs("#contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = fd.get("name") || "";
      const email = fd.get("email") || "";
      const type = fd.get("type") || "";
      const range = fd.get("range") || "";
      const msg = fd.get("message") || "";

      const subject = encodeURIComponent(`[NINETEEN] 문의: ${type}`);
      const body = encodeURIComponent(
        `이름/회사: ${name}\n연락처/이메일: ${email}\n제작 목적: ${type}\n예산/일정: ${range}\n\n상세 내용:\n${msg}\n`
      );
      location.href = `mailto:hello@nineteenstudio.kr?subject=${subject}&body=${body}`;
    });
  }

  // hero fallback: video 없으면 이미지로
  const heroVideo = qs(".hero__video");
  if (heroVideo) {
    heroVideo.addEventListener("error", () => {
      heroVideo.style.display = "none";
    });
  }
})();
