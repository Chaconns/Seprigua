document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const aboutSection = document.getElementById("nosotros");
  const aboutText = aboutSection?.querySelector(".about-text");

  if (!aboutSection) return;

  const visualTargets = {
    inicio: document.getElementById("inicio"),
    nosotros: document.querySelector("#nosotros .about-top"),
    servicios: document.querySelector("#servicios .services-heading"),
    cobertura: document.querySelector("#cobertura .coverage-grid"),
    trabajos: document.querySelector("#trabajos .work-top"),
    contacto: document.querySelector("#contacto .contact-main")
  };

  const reducedMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* =======================================================
     NAVBAR: conservar la corrección del espacio en blanco
     ======================================================= */

  const getHeaderBottom = () => {
    if (!header) return 88;

    const rect = header.getBoundingClientRect();
    return Math.max(72, rect.bottom);
  };

  const scrollToVisualTarget = (
    id,
    behavior = "smooth"
  ) => {
    const target = visualTargets[id];

    if (!target) return;

    const gap = id === "inicio" ? 0 : 18;

    const targetY =
      window.scrollY +
      target.getBoundingClientRect().top -
      getHeaderBottom() -
      gap;

    window.scrollTo({
      top: Math.max(0, targetY),
      behavior
    });
  };


  /* =======================================================
     CONTADORES — CONTROLADOS POR V44
     ======================================================= */

  const counters = Array.from(
    aboutSection.querySelectorAll(
      "[data-about-counter]"
    )
  );

  let counterFrame = null;

  const resetCounters = () => {
    if (counterFrame) {
      cancelAnimationFrame(counterFrame);
      counterFrame = null;
    }

    counters.forEach((counter) => {
      counter.textContent = "0";

      counter
        .closest(".stat-number")
        ?.classList.remove(
          "about-counter-finished"
        );
    });
  };

  const runCounters = () => {
    if (reducedMotion) {
      counters.forEach((counter) => {
        const target =
          Number(counter.dataset.aboutCounter) || 0;

        counter.textContent =
          target.toLocaleString("es-GT");
      });

      return;
    }

    resetCounters();

    const start = performance.now();
    const duration = 1450;

    const tick = (now) => {
      const progress =
        Math.min(
          (now - start) / duration,
          1
        );

      /* easeOutCubic */
      const eased =
        1 -
        Math.pow(
          1 - progress,
          3
        );

      counters.forEach((counter) => {
        const target =
          Number(counter.dataset.aboutCounter) || 0;

        const value =
          Math.floor(
            target * eased
          );

        counter.textContent =
          value.toLocaleString("es-GT");
      });

      if (progress < 1) {
        counterFrame =
          requestAnimationFrame(tick);
      } else {
        counterFrame = null;

        counters.forEach((counter) => {
          const target =
            Number(counter.dataset.aboutCounter) || 0;

          counter.textContent =
            target.toLocaleString("es-GT");

          const number =
            counter.closest(".stat-number");

          number?.classList.remove(
            "about-counter-finished"
          );

          void number?.offsetWidth;

          number?.classList.add(
            "about-counter-finished"
          );
        });
      }
    };

    counterFrame =
      requestAnimationFrame(tick);
  };


  /* =======================================================
     SECUENCIA COMPLETA DE NOSOTROS
     ======================================================= */

  let sequenceTimer = null;
  let counterTimer = null;
  let armed = true;

  const clearSequenceTimers = () => {
    if (sequenceTimer) {
      clearTimeout(sequenceTimer);
      sequenceTimer = null;
    }

    if (counterTimer) {
      clearTimeout(counterTimer);
      counterTimer = null;
    }
  };

  const replayAboutSequence = () => {
    clearSequenceTimers();

    aboutSection.classList.remove(
      "about-full-play",
      "about-sequence-done"
    );

    aboutSection.classList.add(
      "about-sequence-ready"
    );

    if (aboutText) {
      aboutText.classList.remove(
        "about-protagonist-play"
      );
    }

    resetCounters();

    /* Reflow para poder repetir TODO */
    void aboutSection.offsetWidth;

    if (aboutText) {
      aboutText.classList.add(
        "about-protagonist-play"
      );
    }

    aboutSection.classList.add(
      "about-full-play"
    );

    /*
      El recuento empieza cuando las tarjetas
      de estadísticas ya están entrando.
    */
    counterTimer =
      window.setTimeout(
        runCounters,
        1030
      );

    /*
      Después de la entrada dejamos los elementos
      libres para sus hovers/transiciones normales.
    */
    sequenceTimer =
      window.setTimeout(
        () => {
          aboutSection.classList.remove(
            "about-sequence-ready",
            "about-full-play"
          );

          aboutSection.classList.add(
            "about-sequence-done"
          );
        },
        2550
      );
  };


  /* =======================================================
     CLIC EN NAV
     ======================================================= */

  document
    .querySelectorAll(
      '.nav-link[href^="#"], .logo-container[href^="#"]'
    )
    .forEach((link) => {
      link.addEventListener(
        "click",
        (event) => {
          const href =
            link.getAttribute("href");

          if (!href || href === "#") return;

          const id = href.slice(1);

          if (!visualTargets[id]) return;

          event.preventDefault();

          history.pushState(
            null,
            "",
            `#${id}`
          );

          scrollToVisualTarget(
            id,
            "smooth"
          );

          if (id === "nosotros") {
            window.setTimeout(
              replayAboutSequence,
              310
            );
          }
        }
      );
    });


  /* =======================================================
     HASH / RECARGA
     ======================================================= */

  const alignCurrentHash = (
    behavior = "auto"
  ) => {
    const id =
      window.location.hash
        .replace("#", "")
        .trim();

    if (!id || !visualTargets[id]) return;

    scrollToVisualTarget(
      id,
      behavior
    );

    if (id === "nosotros") {
      window.setTimeout(
        replayAboutSequence,
        behavior === "auto" ? 120 : 330
      );
    }
  };

  window.setTimeout(
    () => alignCurrentHash("auto"),
    80
  );

  window.addEventListener(
    "load",
    () => {
      window.setTimeout(
        () => alignCurrentHash("auto"),
        90
      );
    },
    { once: true }
  );

  window.addEventListener(
    "hashchange",
    () => {
      window.setTimeout(
        () => alignCurrentHash("smooth"),
        30
      );
    }
  );


  /* =======================================================
     AL ENTRAR A NOSOTROS MEDIANTE SCROLL
     ======================================================= */

  if (
    "IntersectionObserver" in window
  ) {
    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (
            entry.isIntersecting &&
            entry.intersectionRatio > .22
          ) {
            if (armed) {
              armed = false;
              replayAboutSequence();
            }
          } else if (
            !entry.isIntersecting ||
            entry.intersectionRatio < .06
          ) {
            armed = true;

            aboutSection.classList.remove(
              "about-full-play"
            );
          }
        },
        {
          threshold: [
            0,
            .06,
            .22,
            .40
          ]
        }
      );

    observer.observe(
      aboutSection
    );
  } else {
    replayAboutSequence();
  }
});
