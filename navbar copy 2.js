function syncDropdownLinksStart(triggerItem) {
  const wrap = document.querySelector(".topbar-nav-wrap");
  if (!wrap || !triggerItem) return;

  const wrapRect = wrap.getBoundingClientRect();
  const itemRect = triggerItem.getBoundingClientRect();

  const start = itemRect.left - wrapRect.left;
  document.documentElement.style.setProperty("--dropdown-links-start", `${start}px`);
}

function runDropdownSync(triggerItem) {
  if (!triggerItem) return;

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

  let closeTimer = null;
  let activeDropdownItem = null;

  function clearCloseTimer() {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  }

  function closeAll() {
    activeDropdownItem = null;

    dropdownItems.forEach((item) => item.classList.remove("is-open"));
    dropdowns.forEach((panel) => panel.classList.remove("is-open"));
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

    if (activeDropdownItem) {
      runDropdownSync(activeDropdownItem);
    }
  }

  function scheduleClose(delay = 90) {
    clearCloseTimer();
    closeTimer = setTimeout(closeAll, delay);
  }

  dropdownItems.forEach((item) => {
    const name = item.dataset.dd;

    item.addEventListener("mouseenter", () => openPanel(name));
    item.addEventListener("mouseleave", () => scheduleClose());
    item.addEventListener("focusin", () => openPanel(name));
  });

  simpleItems.forEach((item) => {
    item.addEventListener("mouseenter", closeAll);
    item.addEventListener("focusin", closeAll);
  });

  dropdowns.forEach((panel) => {
    panel.addEventListener("mouseenter", clearCloseTimer);
    panel.addEventListener("mouseleave", () => scheduleClose());
  });

  wrap.addEventListener("mouseleave", () => scheduleClose(0));
  wrap.addEventListener("mouseenter", clearCloseTimer);

  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) closeAll();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
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
    if (activeDropdownItem) {
      runDropdownSync(activeDropdownItem);
    }
  }

  window.addEventListener("load", rerunActiveSync);
  window.addEventListener("resize", rerunActiveSync);

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