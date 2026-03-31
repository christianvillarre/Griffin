document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("bottomNav");
  const menu = document.getElementById("bottomNavMenu");

  if (!nav || !menu) return;

  let isOpen = false;

  // start fully hidden
  menu.style.display = "none";
  menu.setAttribute("aria-hidden", "true");

function openMenu() {
  isOpen = true;

  menu.style.display = "block";

  // force reflow
  menu.offsetHeight;

  nav.classList.add("is-open");
  menu.classList.add("is-open");

  nav.setAttribute("aria-expanded", "true");
  menu.setAttribute("aria-hidden", "false");
  nav.setAttribute("aria-label", "Close navigation");

  // 🔥 GSAP animation
  const items = menu.querySelectorAll(
    ".bottom-nav-menu__panel.is-active *"
  );

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
    // box comes up + fades
    .to(menu, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.55,
      ease: "power3.out"
    })
    // text cascades in
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

  const items = menu.querySelectorAll(
    ".bottom-nav-menu__panel.is-active *"
  );

  nav.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-hidden", "true");
  nav.setAttribute("aria-label", "Open navigation");

  // 🔥 GSAP close animation
  gsap.timeline({
    onComplete: () => {
      nav.classList.remove("is-open");
      menu.classList.remove("is-open");

      if (!isOpen) {
        menu.style.display = "none";
      }
    }
  })
    // text fades out first
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
    // then box drops
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
});