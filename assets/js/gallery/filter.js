export function countPhotos(element, container) {
  const revealPhotosSection = container.querySelectorAll(".gallery-year:not([hidden])");
  let count = 0;
  for (const section of revealPhotosSection) {
    count = count + section.querySelectorAll(".photo-grid__item").length;
  }
  element.textContent = `現在${count}枚の画像を表示しています`;
}

export function initYearFilter(statusElement, filterOptionsContainer, yearsContainer) {
  filterOptionsContainer.addEventListener("change", (event) => {
    if (event.target.name === "year") {
      const checkedValue = event.target.value;
      const yearSections = yearsContainer.querySelectorAll('[data-year]');

      yearSections.forEach(element => {
        const dataYearElement = element.dataset.year;
        if (dataYearElement !== checkedValue && checkedValue !== "all") {
          element.hidden = true;
        } else {
          element.hidden = false;
        }
      });
      countPhotos(statusElement, yearsContainer);

      const filterWrap = filterOptionsContainer.closest(".gallery-filter-wrap");
      const filterWrapBottom = filterWrap.getBoundingClientRect().bottom;
      const statusTop = statusElement.getBoundingClientRect().top;

      if (statusTop < filterWrapBottom) {
        window.scrollBy({
          top: statusTop - filterWrapBottom - 8,
          behavior: "instant",
        });
      }
    }
  })
}