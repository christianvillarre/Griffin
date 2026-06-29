(() => {
  const drawer = document.querySelector(".contact-drawer");
  const dim = document.querySelector(".contact-dim");
  const closeBtn = document.querySelector(".contact-drawer-close");

  if (!drawer) return;

  function openContact(){
    document.body.classList.add("contact-open");
    drawer.setAttribute("aria-hidden", "false");
  }

  function closeContact(){
    document.body.classList.remove("contact-open");
    drawer.setAttribute("aria-hidden", "true");
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