document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("bottomNav");
  const menu = document.getElementById("bottomNavMenu");

  if (!nav || !menu) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    nav.classList.add("is-open");
    menu.classList.add("is-open");
    nav.setAttribute("aria-expanded", "true");
    menu.setAttribute("aria-hidden", "false");
    nav.setAttribute("aria-label", "Close navigation");
  }

  function closeMenu() {
    isOpen = false;
    nav.classList.remove("is-open");
    menu.classList.remove("is-open");
    nav.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
    nav.setAttribute("aria-label", "Open navigation");
  }

  nav.addEventListener("click", (e) => {
    e.stopPropagation();
    isOpen ? closeMenu() : openMenu();
  });

  menu.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  document.addEventListener("click", (e) => {
    if (!isOpen) return;
    const clickedInside = nav.contains(e.target) || menu.contains(e.target);
    if (!clickedInside) closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) closeMenu();
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });
});