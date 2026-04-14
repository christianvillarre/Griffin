function initNavbar() {
  const nav = document.getElementById("bottomNav");
  const menu = document.getElementById("bottomNavMenu");

  if (!nav || !menu) {
    console.warn("Navbar elements not found");
    return;
  }

  if (typeof gsap === "undefined") {
    console.warn("GSAP not loaded");
    return;
  }

  if (nav.dataset.initialized === "true") return;
  nav.dataset.initialized = "true";

  let isOpen = false;
  let currentPanel = "main";
  let defaultPanel = "main"; // <-- add this

  const menuPanels = menu.querySelectorAll(".bottom-nav-menu__panel");

  menu.style.display = "none";
  menu.setAttribute("aria-hidden", "true");
  nav.setAttribute("aria-expanded", "false");
  nav.setAttribute("aria-label", "Open navigation");

  function setCurrentPageName() {
    const label = nav.querySelector(".bottom-nav__home");
    if (!label) return;

    let path = window.location.pathname;

    if (path.endsWith("/")) {
      path += "index.html";
    }

    const file = path.split("/").pop();

    const pageMap = {
      "index.html": "Home",
      "about.html": "About",
      "news.html": "News",
      "contact.html": "Contact",

      "ndt-level-iii-consulting-support.html": "NDT Level III Consulting",
      "advanced-ndt-subject-matter-experts.html": "NDT Subject Matter Experts",
      "ndt-written-practice-review-development.html": "NDT Written Practice",
      "advanced-ndt-training.html": "Advanced NDT Training",
      "advanced-ndt-programs-procedures.html": "NDT Programs & Procedures",
      "automation-robotics-imaging-systems.html": "Automation & Robotics",

      "mergers-acquisitions-support.html": "M&A Support",
      "talent-acquisition-assessment.html": "Talent Acquisition",
      "corporate-development-strategic-planning.html": "Strategic Planning",
      "business-development-client-strategies.html": "Business Development",
      "capital-acquisition.html": "Capital Acquisition",

      "top-notch-edm.html": "Top Notch EDM",
      "sound-ndt-solutions.html": "Sound NDT Solutions",
      "sound-ndt.html": "Sound NDT"
    };

    if (pageMap[file]) {
      label.textContent = pageMap[file];
      return;
    }

    const prettyName = file
      .replace(".html", "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    label.textContent = prettyName || "Home";
  }

  // <-- add this
function detectDefaultPanel() {
  let path = window.location.pathname;

  if (path.endsWith("/")) {
    path += "index.html";
  }

  const file = path.split("/").pop();

  const technicalConsultingPages = [
    "ndt-level-iii-consulting-support.html",
    "advanced-ndt-subject-matter-experts.html",
    "ndt-written-practice-review-development.html",
    "advanced-ndt-training.html",
    "advanced-ndt-programs-procedures.html",
    "automation-robotics-imaging-systems.html"
  ];

  const businessAdvisoryPages = [
    "mergers-acquisitions-support.html",
    "talent-acquisition-assessment.html",
    "corporate-development-strategic-planning.html",
    "business-development-client-strategies.html",
    "capital-acquisition.html"
  ];

  const affiliatePages = [
    "top-notch-edm.html",
    "sound-ndt-solutions.html",
    "sound-ndt.html"
  ];

  if (technicalConsultingPages.includes(file)) return "consulting";   // ✅ FIX
  if (businessAdvisoryPages.includes(file)) return "advisory";       // ✅ FIX
  if (affiliatePages.includes(file)) return "affiliates";

  return "main";
}
  function getPanelItems(panelName) {
    const panel = menu.querySelector(`.bottom-nav-menu__panel[data-panel="${panelName}"]`);
    return panel ? panel.querySelectorAll("*") : [];
  }

  function showMenuPanel(targetName) {
    console.log("Activating panel:", targetName);

    menuPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === targetName);
    });

    currentPanel = targetName;
  }

  function highlightCurrentNavItem() {
  let path = window.location.pathname;

  if (path.endsWith("/")) {
    path += "index.html";
  }

  const file = path.split("/").pop();

  // Find all links inside the menu
  const links = menu.querySelectorAll("a");

  links.forEach((link) => {
    const href = link.getAttribute("href");

    if (!href) return;

    // Normalize href (handle relative paths)
    const linkFile = href.split("/").pop();

    if (linkFile === file) {
      link.classList.add("is-active"); // 👈 add class
    } else {
      link.classList.remove("is-active");
    }
  });
}

  function resetMenuToMain() {
    showMenuPanel(defaultPanel); // <-- change this

  }

  function getAnimatedItems() {
    return getPanelItems(currentPanel);
  }

  function animatePanelItemsIn(panelName) {
    const items = getPanelItems(panelName);
    if (!items.length) return;

    gsap.killTweensOf(items);
    gsap.set(items, { clearProps: "all" });
    gsap.set(items, { opacity: 0, y: 20 });

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

    const nextPanel = menu.querySelector(`.bottom-nav-menu__panel[data-panel="${targetName}"]`);
    if (!nextPanel) {
      console.warn("Panel not found:", targetName);
      return;
    }

    showMenuPanel(targetName);
    animatePanelItemsIn(targetName);
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
        currentPanel = defaultPanel; // <-- change this
        showMenuPanel(defaultPanel); // <-- change this
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

  function animateNavIn() {
    gsap.killTweensOf(nav);

    gsap.set(nav, {
      opacity: 0,
      y: 24,
      scale: 0.96
    });

    gsap.to(nav, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: "power3.out",
      clearProps: "opacity,transform"
    });
  }

  setCurrentPageName();

  // <-- add this
  defaultPanel = detectDefaultPanel();
  currentPanel = defaultPanel;
  showMenuPanel(defaultPanel);
  highlightCurrentNavItem();

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

  menu.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-target]");
    if (!trigger) return;

    e.preventDefault();
    e.stopPropagation();

    const target = trigger.dataset.target;
    console.log("Switching to:", target);

    switchPanel(target);
  });

  menu.querySelectorAll("a:not([data-target])").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  requestAnimationFrame(() => {
    animateNavIn();
  });
}

window.addEventListener("load", initNavbar);