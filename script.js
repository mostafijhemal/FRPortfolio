/* ─────────────────────────────────────────────────────────
   Mostafijur Rahman — portfolio interactions
   ───────────────────────────────────────────────────────── */

(function () {
  "use strict";

  /* ── Mobile navigation ─────────────────────────────── */
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  const header = document.querySelector(".site-header");

  function closeMenu() {
    if (!menu || !toggle) return;
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      const open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", function (event) {
      if (!menu.classList.contains("is-open")) return;
      if (event.target.closest(".nav")) return;
      closeMenu();
    });
  }

  /* ── Header shadow on scroll ───────────────────────── */
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── Reveal-on-scroll ──────────────────────────────── */
  const revealables = Array.from(document.querySelectorAll(".reveal"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function showAllReveals() {
    revealables.forEach(function (el) { el.classList.add("is-visible"); });
  }

  if (!("IntersectionObserver" in window) || reduceMotion) {
    showAllReveals();
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const index = revealables.indexOf(el);
          const delay = Math.min(index % 3, 2) * 80;
          window.setTimeout(function () { el.classList.add("is-visible"); }, delay);
          observer.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    revealables.forEach(function (el) {
      // Anything already on screen at load should never wait for a callback.
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("is-visible");
      } else {
        revealObserver.observe(el);
      }
    });

    // Safety net: never leave content invisible. Observers are paused in
    // background tabs, so re-check whatever is on screen when the page is
    // shown, and once shortly after load.
    function revealInView() {
      revealables.forEach(function (el) {
        if (el.classList.contains("is-visible")) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("is-visible");
        }
      });
    }

    window.setTimeout(revealInView, 2500);
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") revealInView();
    });
  }

  /* ── Active section in nav ─────────────────────────── */
  const navLinks = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'));
  const sections = navLinks
    .map(function (link) {
      const id = link.getAttribute("href").slice(1);
      return { link: link, section: document.getElementById(id) };
    })
    .filter(function (item) { return item.section; });

  if (sections.length && "IntersectionObserver" in window) {
    const firstSectionTop = sections[0].section;

    function clearActive() {
      navLinks.forEach(function (link) { link.classList.remove("is-active"); });
    }

    const spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const match = sections.find(function (item) { return item.section === entry.target; });
          if (!match) return;
          clearActive();
          match.link.classList.add("is-active");
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (item) { spy.observe(item.section); });

    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY < firstSectionTop.offsetTop - window.innerHeight * 0.5) clearActive();
      },
      { passive: true }
    );
  }

  /* ── Copy email ────────────────────────────────────── */
  const copyBtn = document.getElementById("copyEmail");
  const copyLabel = document.getElementById("copyEmailLabel");

  if (copyBtn && copyLabel) {
    const original = copyLabel.textContent;

    copyBtn.addEventListener("click", async function () {
      const email = copyBtn.getAttribute("data-email") || "";
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          const field = document.createElement("textarea");
          field.value = email;
          field.setAttribute("readonly", "");
          field.style.position = "fixed";
          field.style.opacity = "0";
          document.body.appendChild(field);
          field.select();
          document.execCommand("copy");
          document.body.removeChild(field);
        }
        copyLabel.textContent = "Copied!";
      } catch (error) {
        copyLabel.textContent = "Copy failed — select manually";
      }

      window.setTimeout(function () { copyLabel.textContent = original; }, 2000);
    });
  }

  /* ── Contact form ──────────────────────────────────── */
  // Deliver submissions to a form backend by pasting its endpoint below,
  // e.g. "https://formspree.io/f/xxxxxxxx". While this is empty the form
  // composes the message in the visitor's own email app instead.
  const CONTACT_ENDPOINT = "";
  const CONTACT_EMAIL = "mostafij.hemal@gmail.com";

  const form = document.getElementById("contactForm");

  if (form) {
    const submitBtn = document.getElementById("cf-submit");
    const submitLabel = document.getElementById("cf-submit-label");
    const status = document.getElementById("cf-status");

    const fields = [
      {
        input: document.getElementById("cf-name"),
        error: document.getElementById("cf-name-error"),
        validate: function (value) {
          if (!value) return "Please enter your name.";
          if (value.length < 2) return "That name looks a little short.";
          return "";
        },
      },
      {
        input: document.getElementById("cf-email"),
        error: document.getElementById("cf-email-error"),
        validate: function (value) {
          if (!value) return "Please enter your email so I can reply.";
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
            return "That email address doesn't look right.";
          }
          return "";
        },
      },
      {
        input: document.getElementById("cf-message"),
        error: document.getElementById("cf-message-error"),
        validate: function (value) {
          if (!value) return "Please write a short message.";
          if (value.length < 10) return "A little more detail, please — at least 10 characters.";
          return "";
        },
      },
    ].filter(function (field) { return field.input && field.error; });

    function setStatus(message, state) {
      if (!status) return;
      status.textContent = message;
      status.classList.remove("is-success", "is-error");
      if (state) status.classList.add("is-" + state);
    }

    function setFieldError(field, message) {
      field.error.textContent = message;
      field.error.hidden = !message;
      if (message) {
        field.input.setAttribute("aria-invalid", "true");
      } else {
        field.input.removeAttribute("aria-invalid");
      }
    }

    fields.forEach(function (field) {
      field.input.addEventListener("input", function () {
        if (field.error.hidden) return;
        setFieldError(field, field.validate(field.input.value.trim()));
      });
    });

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      setStatus("");

      // Bots fill every field they can reach; people never see this one.
      const honeypot = form.querySelector('[name="_gotcha"]');
      if (honeypot && honeypot.value) {
        form.reset();
        setStatus("Thanks — your message is on its way.", "success");
        return;
      }

      const values = {};
      let firstInvalid = null;

      fields.forEach(function (field) {
        const value = field.input.value.trim();
        const message = field.validate(value);
        setFieldError(field, message);
        if (message && !firstInvalid) firstInvalid = field.input;
        values[field.input.name] = value;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        setStatus("Please fix the highlighted fields.", "error");
        return;
      }

      if (CONTACT_ENDPOINT) {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.setAttribute("aria-busy", "true");
        }
        if (submitLabel) submitLabel.textContent = "Sending…";

        try {
          const response = await fetch(CONTACT_ENDPOINT, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: new FormData(form),
          });
          if (!response.ok) throw new Error("Request failed: " + response.status);

          form.reset();
          fields.forEach(function (field) { setFieldError(field, ""); });
          setStatus("Thanks — your message is on its way. I'll get back to you soon.", "success");
        } catch (error) {
          setStatus("That didn't send. Please email " + CONTACT_EMAIL + " directly.", "error");
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.removeAttribute("aria-busy");
          }
          if (submitLabel) submitLabel.textContent = "Send message";
        }
        return;
      }

      const subject = "Portfolio enquiry from " + values.name;
      const body = values.message + "\n\n— " + values.name + "\n" + values.email;
      window.location.href =
        "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      setStatus(
        "Opening your email app with the message ready to send. If nothing happens, email " +
          CONTACT_EMAIL + " directly.",
        "success"
      );
    });
  }

  /* ── 3D tilt on hover ──────────────────────────────── */
  const tiltCards = Array.from(document.querySelectorAll(".tilt"));
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (tiltCards.length && finePointer && !reduceMotion) {
    const MAX_DEG = 7;

    tiltCards.forEach(function (card) {
      // Browsers already coalesce pointermove to about one per frame, and
      // these writes only touch custom properties on one element, so there
      // is no layout read here that could thrash.
      card.addEventListener("pointermove", function (event) {
        if (event.pointerType === "touch") return;
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;

        // Tilt away from the cursor, like a card held in the hand.
        card.style.setProperty("--ry", ((px - 0.5) * MAX_DEG * 2).toFixed(2) + "deg");
        card.style.setProperty("--rx", ((0.5 - py) * MAX_DEG * 2).toFixed(2) + "deg");
        card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      });

      card.addEventListener("pointerenter", function (event) {
        if (event.pointerType === "touch") return;
        card.classList.add("is-active");
        card.style.setProperty("--lift", "-6px");
        card.style.setProperty("--sc", "1.015");
      });

      function release() {
        card.classList.remove("is-active");
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--lift", "0px");
        card.style.setProperty("--sc", "1");
        card.style.setProperty("--mx", "50%");
        card.style.setProperty("--my", "50%");
      }

      card.addEventListener("pointerleave", release);
      card.addEventListener("pointercancel", release);
    });
  }

  /* ── Footer year ───────────────────────────────────── */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
