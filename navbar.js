document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("bottomNav");
  const menu = document.getElementById("bottomNavMenu");

  if (!nav || !menu) return;
  if (typeof gsap === "undefined") {
    console.warn("GSAP not loaded");
    return;
  }

  let isOpen = false;
  let currentPanel = "main";

  const menuPanels = menu.querySelectorAll(".bottom-nav-menu__panel");
  const menuTriggers = menu.querySelectorAll("[data-target]");

  menu.style.display = "none";
  menu.setAttribute("aria-hidden", "true");

  function getPanelItems(panelName) {
    const panel = menu.querySelector(`.bottom-nav-menu__panel[data-panel="${panelName}"]`);
    return panel ? panel.querySelectorAll("*") : [];
  }

  function showMenuPanel(targetName) {
    menuPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === targetName);
    });
    currentPanel = targetName;
  }

  function resetMenuToMain() {
    showMenuPanel("main");
  }

  function getAnimatedItems() {
    return getPanelItems(currentPanel);
  }

  function animatePanelItemsIn(panelName) {
    const items = getPanelItems(panelName);
    if (!items.length) return;

    gsap.killTweensOf(items);
    gsap.set(items, { clearProps: "all" });
    gsap.set(items, {
      opacity: 0,
      y: 20
    });

    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.03,
      ease: "power3.out",
      clearProps: "opacity,transform"
    });
  }

  function switchPanel(targetName) {
    if (targetName === currentPanel) return;

    const currentItems = getPanelItems(currentPanel);
    const nextPanel = menu.querySelector(`.bottom-nav-menu__panel[data-panel="${targetName}"]`);
    if (!nextPanel) return;

    gsap.killTweensOf(currentItems);

    gsap.to(currentItems, {
      opacity: 0,
      y: 10,
      duration: 0.15,
      stagger: {
        each: 0.01,
        from: "end"
      },
      ease: "power2.in",
      onComplete: () => {
        showMenuPanel(targetName);
        animatePanelItemsIn(targetName);
      }
    });
  }

  function openMenu() {
    isOpen = true;

    gsap.killTweensOf(menu);
    gsap.killTweensOf(menu.querySelectorAll("*"));

    menu.style.display = "block";
    menu.offsetHeight;

    nav.classList.add("is-open");
    menu.classList.add("is-open");

    nav.setAttribute("aria-expanded", "true");
    menu.setAttribute("aria-hidden", "false");
    nav.setAttribute("aria-label", "Close navigation");

    showMenuPanel(currentPanel);

    const items = getAnimatedItems();

    gsap.set(menu, {
      opacity: 0,
      y: 30,
      scale: 0.985
    });

    gsap.set(items, { clearProps: "all" });
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
        ease: "power3.out",
        clearProps: "opacity,transform"
      }, "-=0.3");
  }

  function closeMenu() {
    isOpen = false;

    const items = getAnimatedItems();

    nav.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
    nav.setAttribute("aria-label", "Open navigation");

    gsap.killTweensOf(menu);
    gsap.killTweensOf(items);

    gsap.timeline({
      onComplete: () => {
        nav.classList.remove("is-open");
        menu.classList.remove("is-open");
        resetMenuToMain();
        currentPanel = "main";
        menu.style.display = "none";

        gsap.set(menu, { clearProps: "all" });
        gsap.set(menu.querySelectorAll("*"), { clearProps: "opacity,transform" });
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

  menuTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      switchPanel(trigger.dataset.target);
    });
  });

  menu.querySelectorAll("a:not([data-target])").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });
});