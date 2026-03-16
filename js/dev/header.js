import { i as isMobile } from "./common.min.js";
window.enableFocusTrap = function(menu, { openClass = "is-open" } = {}) {
  const focusableSelector = 'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])';
  const guardStart = document.createElement("span");
  const guardEnd = document.createElement("span");
  guardStart.tabIndex = 0;
  guardEnd.tabIndex = 0;
  guardStart.className = "focus-guard";
  guardEnd.className = "focus-guard";
  guardStart.setAttribute("aria-hidden", "true");
  guardEnd.setAttribute("aria-hidden", "true");
  menu.prepend(guardStart);
  menu.append(guardEnd);
  const getFocusable = () => Array.from(menu.querySelectorAll(focusableSelector)).filter((el) => {
    const style = window.getComputedStyle(el);
    const notHidden = style.visibility !== "hidden" && style.display !== "none";
    const rect = typeof el.getBoundingClientRect === "function" ? el.getBoundingClientRect() : { width: 1, height: 1 };
    const hasSize = rect.width > 0 && rect.height > 0;
    return notHidden && hasSize && !el.hasAttribute("disabled");
  });
  function handleGuardFocus(e) {
    const focusable = getFocusable();
    if (!focusable.length) return;
    if (e.target === guardStart) {
      focusable[focusable.length - 1].focus();
    } else {
      focusable[0].focus();
    }
  }
  guardStart.addEventListener("focus", handleGuardFocus);
  guardEnd.addEventListener("focus", handleGuardFocus);
  function onKeydown(e) {
    if (e.key !== "Tab") return;
    if (!menu.classList.contains(openClass)) return;
    const isInside = menu.contains(document.activeElement);
    const focusable = getFocusable();
    if (!focusable.length) {
      e.preventDefault();
      return;
    }
    if (!isInside) {
      e.preventDefault();
      (e.shiftKey ? focusable[focusable.length - 1] : focusable[0]).focus();
      return;
    }
  }
  document.addEventListener("keydown", onKeydown, true);
  return function cleanup() {
    document.removeEventListener("keydown", onKeydown, true);
    guardStart.removeEventListener("focus", handleGuardFocus);
    guardEnd.removeEventListener("focus", handleGuardFocus);
    guardStart.remove();
    guardEnd.remove();
  };
};
window.initMenu = function() {
  const activeClass = "is-open";
  const activeBtnClass = "is-active";
  const html = document.documentElement;
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  let removeTrap = null;
  let lastActiveButton = null;
  let focusReturnNeeded = false;
  let overlay = null;
  function createOverlay() {
    overlay = document.createElement("div");
    overlay.className = "menu-overlay";
    document.body.appendChild(overlay);
    overlay.addEventListener("click", closeAllMenus);
  }
  createOverlay();
  function closeAllMenus() {
    document.querySelectorAll("[data-menu-target]." + activeClass).forEach((menu) => {
      menu.classList.remove(activeClass);
    });
    document.querySelectorAll("[data-menu]." + activeBtnClass).forEach((btn) => {
      btn.classList.remove(activeBtnClass);
    });
    html.classList.remove("menu-open");
    html.classList.forEach((cls) => {
      if (cls.startsWith("menu-open--")) {
        html.classList.remove(cls);
      }
    });
    if (removeTrap) {
      removeTrap();
      removeTrap = null;
    }
    if (focusReturnNeeded && lastActiveButton) {
      lastActiveButton.focus();
    }
    lastActiveButton = null;
    focusReturnNeeded = false;
  }
  function openMenu(menuName, { withFocusReturn = true } = {}) {
    closeAllMenus();
    const menu = document.querySelector(`[data-menu-target="${menuName}"]`);
    const buttons = document.querySelectorAll(`[data-menu="${menuName}"]`);
    if (menu && buttons.length) {
      const menuBlockRect = menu.parentElement.getBoundingClientRect();
      focusReturnNeeded = withFocusReturn;
      buttons.forEach((btn) => {
        btn.classList.add(activeBtnClass);
        lastActiveButton = btn;
      });
      menu.classList.add(activeClass);
      html.classList.add("menu-open");
      html.classList.add(`menu-open--${menuName}`);
      menu.style.setProperty("--menu-height", `${window.innerHeight - menuBlockRect.bottom}px`);
      removeTrap = enableFocusTrap(menu, { openClass: "is-open" });
    }
  }
  function toggleMenu(menuName) {
    const menu = document.querySelector(`[data-menu-target="${menuName}"]`);
    const isOpen = menu?.classList.contains(activeClass);
    if (isOpen) {
      closeAllMenus();
    } else {
      openMenu(menuName);
    }
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllMenus();
    }
  });
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "attributes" && mutation.attributeName === "data-fls-popup-open") {
        if (html.hasAttribute("data-fls-popup-open")) {
          closeAllMenus();
        }
      }
    }
  });
  observer.observe(html, { attributes: true });
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-menu]");
    const isInsideMenu = e.target.closest("[data-menu-target]." + activeClass);
    if (btn) {
      if (btn.hasAttribute("data-menu-click") || isTouch && isMobile.any()) {
        e.preventDefault();
      }
      const menuName = btn.dataset.menu;
      toggleMenu(menuName);
    } else if (!isInsideMenu) {
      closeAllMenus();
    }
  });
  document.querySelectorAll("[data-menu-close]").forEach((closeBtn) => {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closeAllMenus();
    });
  });
  if (!isTouch && !isMobile.any()) {
    document.querySelectorAll("[data-menu]").forEach((button) => {
      if (button.hasAttribute("data-menu-click")) return;
      const menuName = button.dataset.menu;
      const menu = document.querySelector(`[data-menu-target="${menuName}"]`);
      if (!menu) return;
      let overBtn = false;
      let overMenu = false;
      let localCloseTimer = null;
      const startCloseTimer = () => {
        clearTimeout(localCloseTimer);
        localCloseTimer = setTimeout(() => {
          if (!overBtn && !overMenu) {
            menu.classList.remove(activeClass);
            button.classList.remove(activeBtnClass);
            html.classList.remove(`menu-open--${menuName}`);
            if (!document.querySelector("[data-menu-target]." + activeClass)) {
              html.classList.remove("menu-open");
            }
          }
        }, 300);
      };
      button.addEventListener("mouseenter", () => {
        overBtn = true;
        openMenu(menuName, { withFocusReturn: false });
      });
      button.addEventListener("mouseleave", () => {
        overBtn = false;
        startCloseTimer();
      });
      menu.addEventListener("mouseenter", () => {
        overMenu = true;
      });
      menu.addEventListener("mouseleave", () => {
        overMenu = false;
        startCloseTimer();
      });
    });
  }
  window.menuAPI ??= {};
  Object.assign(window.menuAPI, {
    close: closeAllMenus,
    open: openMenu,
    toggle: toggleMenu
  });
};
document.addEventListener("DOMContentLoaded", window.initMenu);
window.initSubmenu = function() {
  const ACTIVE = "is-open";
  const BTN_ACTIVE = "is-active";
  const html = document.documentElement;
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const MenuManager = {
    menus: /* @__PURE__ */ new Set(),
    activeMenu: null,
    register(menu) {
      this.menus.add(menu);
    },
    setActive(menu) {
      if (this.activeMenu && this.activeMenu !== menu) {
        this.activeMenu.close();
      }
      this.activeMenu = menu;
    },
    clear(menu) {
      if (this.activeMenu === menu) {
        this.activeMenu = null;
      }
    }
  };
  class Submenu {
    constructor(root) {
      this.root = root;
      this.linksWrap = root.querySelector("[data-submenu-links]");
      this.itemsWrap = root.querySelector("[data-submenu-items]");
      this.state = {
        active: null
      };
      this.hoverTimer = null;
      this.mouseHistory = [];
      MenuManager.register(this);
      this.bindEvents();
    }
    bindEvents() {
      this.root.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-submenu-link]");
        const close = e.target.closest("[data-submenu-close]");
        if (btn) {
          const name = btn.dataset.submenuLink;
          if (btn.hasAttribute("data-submenu-click") || isTouch && isMobile.any()) {
            e.preventDefault();
          }
          if (this.state.active === name) {
            this.close();
          } else {
            this.open(name);
          }
          return;
        }
        if (close) {
          e.preventDefault();
          this.close();
        }
      });
      document.addEventListener("click", (e) => {
        if (!this.root.contains(e.target)) {
          this.close();
        }
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") this.close();
      });
      this.initHover();
      this.trackMouse();
    }
    trackMouse() {
      document.addEventListener("mousemove", (e) => {
        this.mouseHistory.push({
          x: e.clientX,
          y: e.clientY,
          t: Date.now()
        });
        if (this.mouseHistory.length > 5) {
          this.mouseHistory.shift();
        }
      });
    }
    initHover() {
      if (isTouch && isMobile.any()) return;
      let overButton = false;
      let overMenu = false;
      const buttons = this.root.querySelectorAll("[data-submenu-link]");
      buttons.forEach((btn) => {
        if (btn.hasAttribute("data-submenu-click")) return;
        const name = btn.dataset.submenuLink;
        btn.addEventListener("mouseenter", () => {
          overButton = true;
          clearTimeout(this.hoverTimer);
          this.hoverTimer = setTimeout(() => {
            this.open(name);
          }, 120);
        });
        btn.addEventListener("mouseleave", () => {
          overButton = false;
          this.startCloseTimer();
        });
      });
      this.itemsWrap?.addEventListener("mouseenter", () => {
        overMenu = true;
      });
      this.itemsWrap?.addEventListener("mouseleave", () => {
        overMenu = false;
        this.startCloseTimer();
      });
      this.startCloseTimer = () => {
        clearTimeout(this.hoverTimer);
        this.hoverTimer = setTimeout(() => {
          if (!overButton && !overMenu) {
            this.close();
          }
        }, 200);
      };
    }
    shouldDelay() {
      if (!this.state.active) return false;
      if (this.mouseHistory.length < 2) return false;
      const first = this.mouseHistory[0];
      const last = this.mouseHistory[this.mouseHistory.length - 1];
      const dx = last.x - first.x;
      const dy = last.y - first.y;
      const angle = Math.abs(dy / dx);
      return angle > 0.3;
    }
    open(name) {
      MenuManager.setActive(this);
      this.close();
      const btn = this.root.querySelector(`[data-submenu-link="${name}"]`);
      const item = this.root.querySelector(`[data-submenu-item="${name}"]`);
      if (!btn || !item) return;
      btn.classList.add(BTN_ACTIVE);
      item.classList.add(ACTIVE);
      this.linksWrap?.classList.add(BTN_ACTIVE);
      this.itemsWrap?.classList.add(ACTIVE);
      html.classList.add("submenu-open");
      html.classList.add(`submenu-open--${name}`);
      this.state.active = name;
      if (window.enableFocusTrap) {
        this.removeTrap = enableFocusTrap(item, { openClass: ACTIVE });
      }
    }
    close() {
      const activeItems = this.root.querySelectorAll(`[data-submenu-item].${ACTIVE}`);
      const activeBtns = this.root.querySelectorAll(`[data-submenu-link].${BTN_ACTIVE}`);
      activeItems.forEach((el) => el.classList.remove(ACTIVE));
      activeBtns.forEach((el) => el.classList.remove(BTN_ACTIVE));
      this.linksWrap?.classList.remove(BTN_ACTIVE);
      this.itemsWrap?.classList.remove(ACTIVE);
      if (this.state.active) {
        html.classList.remove(`submenu-open--${this.state.active}`);
      }
      html.classList.remove("submenu-open");
      if (this.removeTrap) {
        this.removeTrap();
        this.removeTrap = null;
      }
      this.state.active = null;
      MenuManager.clear(this);
    }
  }
  document.querySelectorAll("[data-submenu]").forEach((el) => {
    new Submenu(el);
  });
};
document.addEventListener("DOMContentLoaded", initSubmenu);
