(() => {
  const drawer = document.querySelector(".contact-drawer");
  const dim = document.querySelector(".contact-dim");
  const closeBtn = document.querySelector(".contact-drawer-close");

  if (!drawer) return;

  let lockedScrollY = 0;
  let previousBodyTop = "";

  function openContact(){
    if (document.body.classList.contains("contact-open")) return;

    lockedScrollY = window.scrollY;
    previousBodyTop = document.body.style.top;
    window.lenis?.stop();
    document.body.style.top = `-${lockedScrollY}px`;
    document.documentElement.classList.add("contact-open");
    document.body.classList.add("contact-open");
    drawer.setAttribute("aria-hidden", "false");
    drawer.removeAttribute("inert");
  }

  function closeContact(){
    if (!document.body.classList.contains("contact-open")) return;

    document.body.classList.remove("contact-open");
    document.documentElement.classList.remove("contact-open");
    document.body.style.top = previousBodyTop;
    window.scrollTo(0, lockedScrollY);
    window.lenis?.start();
    drawer.setAttribute("aria-hidden", "true");
    drawer.setAttribute("inert", "");
  }

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest(
      '[data-contact-open], a[href="/contact.html"], a[href="/contact"], a[href="contact.html"]'
    );

    if (!trigger) return;

    e.preventDefault();
    openContact();
  });

  closeBtn?.addEventListener("click", closeContact);
  dim?.addEventListener("click", closeContact);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeContact();
  });
})();
