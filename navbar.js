document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("bottomNav");
  const menu = document.getElementById("bottomNavMenu");

  if (!nav || !menu) return;
  if (typeof gsap === "undefined") {
    console.warn("GSAP not loaded");
    return;
  }

  let isOpen = false;

  const menuPanels = menu.querySelectorAll(".bottom-nav-menu__panel");
  const menuTriggers = menu.querySelectorAll("[data-target]");

  menu.style.display = "none";
  menu.setAttribute("aria-hidden", "true");

  function showMenuPanel(targetName) {
    menuPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === targetName);
    });
  }

  function resetMenuToMain() {
    showMenuPanel("main");
  }

  function getAnimatedItems() {
    return menu.querySelectorAll(".bottom-nav-menu__panel.is-active *");
  }

  function openMenu() {
    isOpen = true;

    menu.style.display = "block";
    menu.offsetHeight;

    nav.classList.add("is-open");
    menu.classList.add("is-open");

    nav.setAttribute("aria-expanded", "true");
    menu.setAttribute("aria-hidden", "false");
    nav.setAttribute("aria-label", "Close navigation");

    const items = getAnimatedItems();

    gsap.set(menu, {
      opacity: 0,
      y: 30,
      scale: 0.985
    });

    gsap.set(items, {
      opacity: 0,
      y: 20
    });

    gsap.timeline()
      .to(menu, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: "power3.out"
      })
      .to(items, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.035,
        ease: "power3.out"
      }, "-=0.3");
  }

  function closeMenu() {
    isOpen = false;

    const items = getAnimatedItems();

    nav.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
    nav.setAttribute("aria-label", "Open navigation");

    gsap.timeline({
      onComplete: () => {
        nav.classList.remove("is-open");
        menu.classList.remove("is-open");
        resetMenuToMain();
        if (!isOpen) menu.style.display = "none";
      }
    })
      .to(items, {
        opacity: 0,
        y: 10,
        duration: 0.2,
        stagger: {
          each: 0.015,
          from: "end"
        },
        ease: "power2.in"
      })
      .to(menu, {
        opacity: 0,
        y: 20,
        scale: 0.985,
        duration: 0.25,
        ease: "power2.in"
      }, "-=0.1");
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

  menuTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      showMenuPanel(trigger.dataset.target);
    });
  });
});