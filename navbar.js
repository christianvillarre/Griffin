const DROPDOWN_ALIGNMENT_MIN = 1600;
const MOBILE_BREAKPOINT = 860;

function shouldUsePerItemDropdownAlignment() {
  return window.innerWidth >= DROPDOWN_ALIGNMENT_MIN;
}

function isMobileNav() {
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

function syncDropdownLinksStart(triggerItem = null) {
  const wrap = document.querySelector(".topbar-nav-wrap");
  if (!wrap) return;

  const wrapRect = wrap.getBoundingClientRect();

  if (shouldUsePerItemDropdownAlignment() && triggerItem) {
    const itemRect = triggerItem.getBoundingClientRect();
    const start = itemRect.left - wrapRect.left;
    document.documentElement.style.setProperty("--dropdown-links-start", `${start}px`);
    return;
  }

  const firstLink = document.querySelector(".topbar-nav__links .topbar-nav__link");
  if (!firstLink) return;

  const linkRect = firstLink.getBoundingClientRect();
  const start = linkRect.left - wrapRect.left;
  document.documentElement.style.setProperty("--dropdown-links-start", `${start}px`);
}

function runDropdownSync(triggerItem = null) {
  syncDropdownLinksStart(triggerItem);

  requestAnimationFrame(() => {
    syncDropdownLinksStart(triggerItem);

    requestAnimationFrame(() => {
      syncDropdownLinksStart(triggerItem);
    });
  });
}

function initTopbarVersion() {
  const wrap = document.querySelector(".topbar-nav-wrap");
  if (!wrap) return false;
  if (wrap.dataset.initialized === "true") return true;
  wrap.dataset.initialized = "true";

  const dropdownItems = wrap.querySelectorAll(".topbar-nav__item.has-dd");
  const simpleItems = wrap.querySelectorAll(".topbar-nav__item:not(.has-dd)");
  const dropdowns = wrap.querySelectorAll(".topbar-dropdown");

  const menuBtn = document.getElementById("topbarMenuBtn");
  const mobileMenu = document.getElementById("topbarMobileMenu");
  const mobileScreens = mobileMenu ? mobileMenu.querySelectorAll(".topbar-mobile-menu__screen") : [];
  const mobileOpenButtons = mobileMenu ? mobileMenu.querySelectorAll("[data-mobile-open]") : [];
  const mobileBackButtons = mobileMenu ? mobileMenu.querySelectorAll("[data-mobile-back]") : [];

  let closeTimer = null;
  let activeDropdownItem = null;
  let mobileMenuOpen = false;

  function clearCloseTimer() {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  }

  function showMobileScreen(name) {
    if (!mobileMenu) return;

    mobileScreens.forEach((screen) => {
      screen.classList.toggle("is-active", screen.dataset.screen === name);
    });
  }

  function openMobileMenu() {
    if (!mobileMenu) return;

    mobileMenuOpen = true;
    wrap.classList.add("is-mobile-menu-open");
    document.body.classList.add("topbar-mobile-lock");
    menuBtn?.setAttribute("aria-label", "Close menu");
    menuBtn?.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
    showMobileScreen("main");
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;

    mobileMenuOpen = false;
    wrap.classList.remove("is-mobile-menu-open");
    document.body.classList.remove("topbar-mobile-lock");
    menuBtn?.setAttribute("aria-label", "Open menu");
    menuBtn?.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    showMobileScreen("main");
  }

  function toggleMobileMenu() {
    if (mobileMenuOpen) closeMobileMenu();
    else openMobileMenu();
  }

  function closeAll() {
    activeDropdownItem = null;

    dropdownItems.forEach((item) => item.classList.remove("is-open"));
    dropdowns.forEach((panel) => panel.classList.remove("is-open"));

    runDropdownSync();
  }

  function openPanel(name) {
    clearCloseTimer();

    let matchedItem = null;

    dropdownItems.forEach((item) => {
      const isActive = item.dataset.dd === name;
      item.classList.toggle("is-open", isActive);
      if (isActive) matchedItem = item;
    });

    dropdowns.forEach((panel) => {
      panel.classList.toggle("is-open", panel.dataset.panel === name);
    });

    activeDropdownItem = matchedItem;
    runDropdownSync(activeDropdownItem);
  }

  function scheduleClose(delay = 90) {
    clearCloseTimer();
    closeTimer = setTimeout(closeAll, delay);
  }

  dropdownItems.forEach((item) => {
    const name = item.dataset.dd;

    item.addEventListener("mouseenter", () => {
      if (isMobileNav()) return;
      openPanel(name);
    });

    item.addEventListener("mouseleave", () => {
      if (isMobileNav()) return;
      scheduleClose();
    });

    item.addEventListener("focusin", () => {
      if (isMobileNav()) return;
      openPanel(name);
    });
  });

  simpleItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      if (isMobileNav()) return;
      closeAll();
    });

    item.addEventListener("focusin", () => {
      if (isMobileNav()) return;
      closeAll();
    });
  });

  dropdowns.forEach((panel) => {
    panel.addEventListener("mouseenter", () => {
      if (isMobileNav()) return;
      clearCloseTimer();
    });

    panel.addEventListener("mouseleave", () => {
      if (isMobileNav()) return;
      scheduleClose();
    });
  });

  wrap.addEventListener("mouseleave", () => {
    if (isMobileNav()) return;
    scheduleClose(0);
  });

  wrap.addEventListener("mouseenter", () => {
    if (isMobileNav()) return;
    clearCloseTimer();
  });

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      if (!isMobileNav()) return;
      toggleMobileMenu();
    });
  }

  mobileOpenButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const screen = btn.dataset.mobileOpen;
      if (!screen) return;
      showMobileScreen(screen);
    });
  });

  mobileBackButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      showMobileScreen("main");
    });
  });

  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) {
      closeAll();
      if (mobileMenuOpen) closeMobileMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAll();
      if (mobileMenuOpen) closeMobileMenu();
    }
  });

  const currentPath = window.location.pathname.endsWith("/")
    ? window.location.pathname + "index.html"
    : window.location.pathname;

  const currentFile = currentPath.split("/").pop();

  wrap.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

    const hrefFile = href.split("/").pop();
    if (hrefFile === currentFile) {
      link.classList.add("is-active");
    }
  });

  function rerunActiveSync() {
    if (!isMobileNav()) {
      runDropdownSync(activeDropdownItem);
    }
  }

  function handleResize() {
    if (!isMobileNav() && mobileMenuOpen) {
      closeMobileMenu();
    }
    rerunActiveSync();
  }

  runDropdownSync();

  window.addEventListener("load", rerunActiveSync);
  window.addEventListener("resize", handleResize);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(rerunActiveSync).catch(() => {});
  }

  return true;
}

function waitForTopbarInit() {
  if (initTopbarVersion()) return;

  const observer = new MutationObserver(() => {
    if (initTopbarVersion()) {
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

document.addEventListener("DOMContentLoaded", waitForTopbarInit);
window.addEventListener("load", waitForTopbarInit);
