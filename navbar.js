document.addEventListener("DOMContentLoaded", () => {
  /* ===================== ICONS ===================== */
  const ICON_RIGHT_ARROW = `
    <svg class="dd-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"/>
    </svg>
  `;

  const ICON_UPRIGHT = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17L17 7M10 7h7v7"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"/>
    </svg>
  `;

  /* ===================== CONTENT ===================== */
  const CAPABILITIES = {
    tabs: [
      {
        key: "technical",
        label: "Technical Consulting",
        title: "Technical Consulting",
        desc:
          "Griffin delivers specialized technical consulting for complex industrial environments—bringing clarity in high-risk situations, strengthening compliance strategies, and supporting mission-critical decisions with deep subject matter expertise.",
        items: [
          {
            label: "NDT Level III Consulting & Support",
            link: "/technical-consulting/ndt-level-iii-consulting-support.html"
          },
          {
            label: "Advanced NDT Subject Matter Experts",
            link: "/technical-consulting/advanced-ndt-subject-matter-experts.html"
          },
          {
            label: "NDT Written Practice Review and Development",
            link: "/technical-consulting/ndt-written-practice-review-development.html"
          },
          {
            label: "Next Level Advanced NDT Training Programs",
            link: "/technical-consulting/advanced-ndt-training.html"
          },
          {
            label: "Advanced NDT Technology Programs and Procedures",
            link: "/technical-consulting/advanced-ndt-technology-programs-procedures.html"
          },
          {
            label: "Automation, Robotics, and Advanced Imaging Systems",
            link: "/technical-consulting/automation-robotics-imaging-systems.html"
          }
        ]
      },
      {
        key: "advisory",
        label: "Business Advisory Services",
        title: "Business Advisory Services",
        desc:
          "Our advanced NDT experts bring decades of field experience across critical infrastructure and regulated industries. We support organizations with high-level technical guidance, failure analysis insight, and practical solutions aligned with codes, specifications, and operational realities.",
        items: [
          {
            label: "Mergers & Acquisition Support",
            link: "business-advisory.html#mergers-acquisitions"
          },
          {
            label: "Talent Acquisition & Assessment",
            link: "business-advisory.html#talent-acquisition"
          },
          {
            label: "Corporate Development & Strategic Planning",
            link: "business-advisory.html#corporate-development"
          },
          {
            label: "Business Development & Client Strategies",
            link: "business-advisory.html#business-development"
          },
          {
            label: "Capital Acquisition",
            link: "business-advisory.html#capital-acquisition"
          }
        ]
      }
    ]
  };

const AFFILIATES = {
  tabs: [
    {
      key: "top-notch-edm",
      label: "Top Notch EDM Services",
      title: "Top Notch EDM Services",
      image: "/images/partner-logo2.png",
      imageAlt: "Top Notch EDM",
      desc:
        "When projects demand specialized capabilities or additional bandwidth, we coordinate with proven affiliate organizations—extending coverage while maintaining the same standard of precision, accountability, and delivery.",
      items: [
        {
          label: "Learn More",
          link: "affiliate-organizations.html#top-notch-edm"
        },
      ]
    },
    {
      key: "sound-ndt",
      label: "Sound NDT Solutions",
      title: "Sound NDT Solutions",
      image: "/images/partner-logo1.png",
      imageAlt: "Top Notch EDM",
      desc:
        "When projects demand specialized capabilities or additional bandwidth, we coordinate with proven affiliate organizations—extending coverage while maintaining the same standard of precision, accountability, and delivery.",
      items: [
        {
          label: "Learn More",
          link: "affiliate-organizations.html#top-notch-edm"
        },
      ]
    },
    {
      key: "atco",
      label: "ATCO Automated Scanning Systems",
      title: "ATCO Automated Scanning Systems",
      desc:
        "When projects demand specialized capabilities or additional bandwidth, we coordinate with proven affiliate organizations—extending coverage while maintaining the same standard of precision, accountability, and delivery.",
      items: [
        {
          label: "Learn More",
          link: "affiliate-organizations.html#top-notch-edm"
        },
      ]
    },
    {
      key: "halo-ndt",
      label: "Halo NDT Technologies",
      title: "Halo NDT Technologies",
      desc:
        "When projects demand specialized capabilities or additional bandwidth, we coordinate with proven affiliate organizations—extending coverage while maintaining the same standard of precision, accountability, and delivery.",
      items: [
        {
          label: "Learn More",
          link: "affiliate-organizations.html#top-notch-edm"
        },
      ]
    }
  ]
};

  /* ===================== DOM ===================== */
  const dropdownWrap = document.getElementById("navDropdown");
  const ddLeft = document.getElementById("navDdLeft");
  const ddRight = document.getElementById("navDdRight");
  const navbar = document.querySelector(".navbar");

  if (!dropdownWrap || !ddLeft || !ddRight) return;

  /* ===================== STATE ===================== */
  let activeKey = null;
  let activeCapTab = "technical";
  let activeAffiliateTab = "top-notch-edm";
  let isAnimatingRight = false;
  let closeTimer = null;

  /* ===================== HELPERS ===================== */
  function cancelCloseTimer() {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
}

function scheduleCloseDropdown() {
  cancelCloseTimer();
  closeTimer = setTimeout(() => {
    closeDropdown();
  }, 120);
}
  function clearActiveTriggers() {
    document
      .querySelectorAll('.nav-link[data-dropdown].is-active')
      .forEach((el) => el.classList.remove("is-active"));
  }

  function getTab(key) {
    return CAPABILITIES.tabs.find((t) => t.key === key) || CAPABILITIES.tabs[0];
  }

  function renderLeft(tabKey) {
    ddLeft.innerHTML = CAPABILITIES.tabs
      .map(
        (t) => `
          <a
            class="nav-dd-item is-tab ${t.key === tabKey ? "is-selected" : ""}"
            href="#"
            data-cap-tab="${t.key}"
          >
            <span>${t.label}</span>
            ${ICON_RIGHT_ARROW}
          </a>
        `
      )
      .join("");
  }

  function renderRight(tab) {
    ddRight.innerHTML = `
      <div class="nav-dd-title">${tab.title}</div>
      <p class="nav-dd-desc">${tab.desc}</p>

      <div class="nav-dd-links">
        ${tab.items
          .map(
            (item) => `
              <a class="nav-dd-greenlink" href="${item.link}" data-dd-close>
                <span>${item.label}</span>
                ${ICON_UPRIGHT}
              </a>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderAffiliateDropdown() {
    ddLeft.innerHTML = "";

    ddRight.innerHTML = `
      <div class="nav-dd-title">${AFFILIATES.title}</div>
      <p class="nav-dd-desc">${AFFILIATES.desc}</p>

      <div class="nav-dd-links">
        ${AFFILIATES.items
          .map(
            (item) => `
              <a class="nav-dd-greenlink" href="${item.link}" data-dd-close>
                <span>${item.label}</span>
                ${ICON_UPRIGHT}
              </a>
            `
          )
          .join("")}
      </div>
    `;
  }

function getAffiliateTab(key) {
  return AFFILIATES.tabs.find((t) => t.key === key) || AFFILIATES.tabs[0];
}

function renderAffiliateLeft(tabKey) {
  ddLeft.innerHTML = AFFILIATES.tabs
    .map(
      (t) => `
        <a
          class="nav-dd-item is-tab ${t.key === tabKey ? "is-selected" : ""}"
          href="#"
          data-affiliate-tab="${t.key}"
        >
          <span>${t.label}</span>
          ${ICON_RIGHT_ARROW}
        </a>
      `
    )
    .join("");
}

function renderAffiliateRight(tab) {
  ddRight.innerHTML = `
    <div class="nav-dd-title">${tab.title}</div>
    <p class="nav-dd-desc">${tab.desc}</p>

    ${
      tab.image
        ? `
      <div class="nav-dd-image-wrap">
        <img
          src="${tab.image}"
          alt="${tab.imageAlt || tab.title}"
          class="nav-dd-image"
        />
      </div>
      `
        : ""
    }

    <div class="nav-dd-links">
      ${tab.items
        .map(
          (item) => `
            <a class="nav-dd-greenlink" href="${item.link}" data-dd-close>
              <span>${item.label}</span>
              ${ICON_UPRIGHT}
            </a>
          `
        )
        .join("")}
    </div>
  `;
}

function renderAffiliateDropdown() {
  renderAffiliateLeft(activeAffiliateTab);
  renderAffiliateRight(getAffiliateTab(activeAffiliateTab));
}
  function getAffiliateTab(key) {
  return AFFILIATES.tabs.find((t) => t.key === key) || AFFILIATES.tabs[0];
}

function renderAffiliateLeft(tabKey) {
  ddLeft.innerHTML = AFFILIATES.tabs
    .map(
      (t) => `
        <a
          class="nav-dd-item is-tab ${t.key === tabKey ? "is-selected" : ""}"
          href="#"
          data-affiliate-tab="${t.key}"
        >
          <span>${t.label}</span>
          ${ICON_RIGHT_ARROW}
        </a>
      `
    )
    .join("");
}


function renderAffiliateDropdown() {
  renderAffiliateLeft(activeAffiliateTab);
  renderAffiliateRight(getAffiliateTab(activeAffiliateTab));
}

  function tween(dur, onUpdate) {
    return new Promise((resolve) => {
      const t0 = performance.now();

      function frame(now) {
        const t = Math.min(1, (now - t0) / dur);
        onUpdate(t);

        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          resolve();
        }
      }

      requestAnimationFrame(frame);
    });
  }

  const easeOut = (t) => 1 - Math.pow(1 - t, 3.2);

  async function swapRightQuick(nextTabKey) {
    if (isAnimatingRight) return;
    if (nextTabKey === activeCapTab) return;

    isAnimatingRight = true;

    const nextTab = getTab(nextTabKey);

    ddRight.style.pointerEvents = "none";
    ddRight.style.willChange = "opacity, transform";

    const OUT_DUR = 95;
    await tween(OUT_DUR, (t) => {
      const e = easeOut(t);
      ddRight.style.opacity = String(1 - e);
      ddRight.style.transform = `translateY(${0 + 2 * e}px)`;
    });

    renderRight(nextTab);

    ddRight.style.opacity = "0";
    ddRight.style.transform = "translateY(8px)";

    const IN_DUR = 140;
    await tween(IN_DUR, (t) => {
      const e = easeOut(t);
      ddRight.style.opacity = String(e);
      ddRight.style.transform = `translateY(${8 - 8 * e}px)`;
    });

    ddRight.style.opacity = "";
    ddRight.style.transform = "";
    ddRight.style.willChange = "";
    ddRight.style.pointerEvents = "";

    activeCapTab = nextTabKey;
    renderLeft(activeCapTab);

    isAnimatingRight = false;
  }

  /* ===================== OPEN/CLOSE ===================== */
  function openDropdown(key) {
    activeKey = key;

    clearActiveTriggers();
    const trigger = document.querySelector(`.nav-link[data-dropdown="${key}"]`);
    if (trigger) trigger.classList.add("is-active");

    if (key === "capabilities") {
      renderLeft(activeCapTab);
      renderRight(getTab(activeCapTab));
      ddRight.style.opacity = "";
      ddRight.style.transform = "";
    }

    if (key === "affiliates") {
      renderAffiliateDropdown();
      ddRight.style.opacity = "";
      ddRight.style.transform = "";
    }

    dropdownWrap.classList.add("is-open");
    dropdownWrap.setAttribute("aria-hidden", "false");
  }

  function closeDropdown() {
    activeKey = null;
    dropdownWrap.classList.remove("is-open");
    dropdownWrap.setAttribute("aria-hidden", "true");
    clearActiveTriggers();
  }

  /* ===================== EVENTS ===================== */
document.querySelectorAll(".nav-link[data-dropdown]").forEach((link) => {
  link.addEventListener("mouseenter", () => {
    cancelCloseTimer();
    const key = link.getAttribute("data-dropdown");
    openDropdown(key);
  });

  link.addEventListener("mouseleave", (e) => {
    const toEl = e.relatedTarget;

    if (toEl && dropdownWrap.contains(toEl)) return;

    scheduleCloseDropdown();
  });
});

dropdownWrap.addEventListener("mouseenter", () => {
  cancelCloseTimer();
});

dropdownWrap.addEventListener("mouseleave", () => {
  scheduleCloseDropdown();
});

dropdownWrap.addEventListener("mouseover", (e) => {
  const capTabEl = e.target.closest("[data-cap-tab]");
  if (capTabEl) {
    const nextKey = capTabEl.getAttribute("data-cap-tab");
    swapRightQuick(nextKey);
    return;
  }

  const affiliateTabEl = e.target.closest("[data-affiliate-tab]");
  if (affiliateTabEl) {
    const nextKey = affiliateTabEl.getAttribute("data-affiliate-tab");
    if (nextKey !== activeAffiliateTab) {
      activeAffiliateTab = nextKey;
      renderAffiliateLeft(activeAffiliateTab);
      renderAffiliateRight(getAffiliateTab(activeAffiliateTab));
    }
  }
});



dropdownWrap.addEventListener("click", (e) => {
  e.stopPropagation();

  const capTabEl = e.target.closest("[data-cap-tab]");
  if (capTabEl) {
    e.preventDefault();
    swapRightQuick(capTabEl.getAttribute("data-cap-tab"));
    return;
  }

  const affiliateTabEl = e.target.closest("[data-affiliate-tab]");
  if (affiliateTabEl) {
    e.preventDefault();
    activeAffiliateTab = affiliateTabEl.getAttribute("data-affiliate-tab");
    renderAffiliateLeft(activeAffiliateTab);
    renderAffiliateRight(getAffiliateTab(activeAffiliateTab));
    return;
  }

  const closeEl = e.target.closest("[data-dd-close]");
  if (closeEl) closeDropdown();
});

  document.addEventListener("click", (e) => {
    if (!dropdownWrap.classList.contains("is-open")) return;

    const clickedInside =
      dropdownWrap.contains(e.target) ||
      (navbar && navbar.contains(e.target));

    if (!clickedInside) closeDropdown();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDropdown();
  });

  document
    .querySelectorAll(".nav-link:not([data-dropdown])")
    .forEach((link) => link.addEventListener("click", () => closeDropdown()));
});

