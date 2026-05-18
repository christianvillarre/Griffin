(async () => {
  const root = document.getElementById("contact-drawer-root");
  if (!root) return;

  const res = await fetch("/contact-drawer.fragment");
  root.innerHTML = await res.text();

  const drawer = root.querySelector(".contact-drawer");
  const dim = root.querySelector(".contact-dim");
  const closeBtn = root.querySelector(".contact-drawer-close");

  function openContact(){
    document.body.classList.add("contact-open");
    drawer?.setAttribute("aria-hidden", "false");
  }

  function closeContact(){
    document.body.classList.remove("contact-open");
    drawer?.setAttribute("aria-hidden", "true");
  }

  document.addEventListener("click", (e) => {

    const trigger = e.target.closest(
      'a[href="/contact.html"], a[href="/contact"], a[href="contact.html"]'
    );

    if (!trigger) return;

    e.preventDefault();
    openContact();
  });

  closeBtn?.addEventListener("click", closeContact);

  dim?.addEventListener("click", closeContact);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape"){
      closeContact();
    }
  });
})();