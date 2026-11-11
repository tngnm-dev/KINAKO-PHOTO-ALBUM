const motionOK = window.matchMedia("(prefers-reduced-motion: no-preference)");

export function initSliders(sectionsContainer) {
  const sections = sectionsContainer.querySelectorAll(".gallery-year");
  for (const section of sections) {
    const grid = section.querySelector(".photo-grid");
    const prevBtn = section.querySelector(".gallery-year__prev");
    const nextBtn = section.querySelector(".gallery-year__next");
    const controls = section.querySelector(".gallery-year__controls");
    grid.addEventListener("scroll", () => {
      updateButtons(grid, prevBtn, nextBtn);
    }, { passive: true });

    const observer = new ResizeObserver(() => {
      controls.hidden = !(grid.scrollWidth > grid.clientWidth);
      updateButtons(grid, prevBtn, nextBtn);
    });
    observer.observe(grid);
  }
  sectionsContainer.addEventListener("click", (e) => {
    const button = e.target.closest(".gallery-year__prev, .gallery-year__next");
    if (button === null) return;
    if (button.getAttribute("aria-disabled") === "true") return;

    const grid = button.closest(".gallery-year").querySelector(".photo-grid");
    const isPrev = button.classList.contains("gallery-year__prev");
    const distance = isPrev ? -grid.clientWidth : grid.clientWidth;
    const scrollBehavior = motionOK.matches ? "smooth" : "instant";

    grid.scrollBy({ left: distance, behavior: scrollBehavior });
  });
}

function updateButtons(grid, prevBtn, nextBtn) {
  if (grid.scrollLeft <= 0) {
    prevBtn.setAttribute("aria-disabled", "true");
  } else {
    prevBtn.removeAttribute("aria-disabled");
  }
  if (grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 1) {
    nextBtn.setAttribute("aria-disabled", "true");
  } else {
    nextBtn.removeAttribute("aria-disabled");
  }
}