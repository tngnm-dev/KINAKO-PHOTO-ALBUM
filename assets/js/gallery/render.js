export function makeFilter(filterValue, container) {
  const filterTemplate = document.getElementById("gallery-filter-option-template").content.cloneNode(true);
  filterTemplate.querySelector(".gallery-filter__option input").value = filterValue;
  if (filterValue === 'all') {
    filterTemplate.querySelector(".gallery-filter__option input").checked = true;
    filterTemplate.querySelector(".gallery-filter__label").textContent = "すべて";
  } else {
    filterTemplate.querySelector(".gallery-filter__label").textContent = filterValue;
  }
  container.append(filterTemplate);
}

export function makePhotoItems(year, photos, container) {
  const yearSection = document.getElementById("gallery-year-template").content.cloneNode(true);
  const yearSectionElement = yearSection.querySelector(".gallery-year");
  yearSectionElement.dataset.year = year;
  yearSectionElement.querySelector(".gallery-year__title time").textContent = year;

  const gridId = `photos-${year}`;
  yearSectionElement.querySelector(".photo-grid").id = gridId;
  for (const button of yearSectionElement.querySelectorAll(".gallery-year__controls button")) {
    button.setAttribute("aria-controls", gridId);
  }


  for (const photo of photos) {
    const photoTemplate = document.getElementById("photo-item-template").content.cloneNode(true);

    const photoItem = photoTemplate.querySelector(".photo-grid__item");
    const imgElement = photoItem.querySelector(".photo-grid__image");

    const photoUrls = photo.widths.map((width) => {
      return `../assets/photos/${photo.id}-${width}.webp ${width}w`;
    });
    const link = photoTemplate.querySelector(".photo-grid__link");
    link.href = `../assets/photos/${photo.id}-${photo.widths.at(-1)}.webp`;
    imgElement.srcset = photoUrls.join(",");
    imgElement.src = `../assets/photos/${photo.id}-${photo.widths[0]}.webp`;
    imgElement.sizes = `min(80vw, 24rem)`;
    imgElement.width = photo.width;
    imgElement.height = photo.height;
    imgElement.loading = "lazy";
    imgElement.alt = photo.alt;

    yearSectionElement.querySelector(".photo-grid").append(photoItem);
  }
  container.append(yearSectionElement);
}
