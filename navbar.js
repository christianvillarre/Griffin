
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
      },
      {
        key: "affiliate",
        label: "Affiliate Organizations",
        title: "Affiliate Organizations",
        desc:
          "When projects demand specialized capabilities or additional bandwidth, we coordinate with proven affiliate organizations—extending coverage while maintaining the same standard of precision, accountability, and delivery.",
        items: [
          {
            label: "Top Notch EDM Services",
            link: "affiliate-organizations.html#top-notch-edm"
          },
          {
            label: "Sound NDT Solutions",
            link: "affiliate-organizations.html#sound-ndt"
          },
          {
            label: "ATCO Automated Scanning Systems",
            link: "affiliate-organizations.html#atco"
          },
          {
            label: "Halo NDT Technologies",
            link: "affiliate-organizations.html#halo-ndt"
          }
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
  let isAnimatingRight = false;

  /* ===================== HELPERS ===================== */
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
    link.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const key = link.getAttribute("data-dropdown");
      const isSame =
        dropdownWrap.classList.contains("is-open") && activeKey === key;

      if (isSame) {
        closeDropdown();
      } else {
        openDropdown(key);
      }
    });
  });

  dropdownWrap.addEventListener("click", (e) => {
    e.stopPropagation();

    const tabEl = e.target.closest("[data-cap-tab]");
    if (tabEl) {
      e.preventDefault();
      swapRightQuick(tabEl.getAttribute("data-cap-tab"));
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
