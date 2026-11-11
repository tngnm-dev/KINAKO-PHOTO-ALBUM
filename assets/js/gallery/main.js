import { loadPhotos, makeYearGroups } from "./photos.js";
import { makeFilter, makePhotoItems } from "./render.js";
import { countPhotos, initYearFilter } from "./filter.js";
import { initSliders } from "./slider.js";

const statusElement = document.querySelector(".gallery-status");
const filterOptionsContainer = document.querySelector(".gallery-filter__options");
const yearsContainer = document.querySelector(".gallery__years");
const motionOK = window.matchMedia("(prefers-reduced-motion: no-preference)");

async function init() {
  if (!statusElement || !yearsContainer) return;

  statusElement.textContent = "写真を読み込んでいます…";

  try {
    const photos = await loadPhotos("../assets/data/photos.json");
    const yearGroups = makeYearGroups(photos);

    makeFilter("all", filterOptionsContainer);

    for (const [year, photos] of yearGroups) {
      makeFilter(year, filterOptionsContainer);
      makePhotoItems(year, photos, yearsContainer);
    }

    document.querySelector(".gallery-filter").hidden = false;
    countPhotos(statusElement, yearsContainer);
    initSliders(yearsContainer);

  } catch (error) {
    console.error(error);
    statusElement.textContent = "時間をおいて再読み込みしてください";
  }
  yearsContainer.addEventListener("focusin", (e) => {
    const focusedElement = e.target.closest(".photo-grid__link");
    if (focusedElement !== null) {
      const scrollBehavior = motionOK.matches ? "smooth" : "instant";
      focusedElement.scrollIntoView({
        behavior: scrollBehavior,
        inline: "start",
        block: "nearest",
      });
    }
  });

  const dialog = document.querySelector(".photo-dialog");
  const prevBtn = document.querySelector(".photo-dialog__prev");
  const nextBtn = document.querySelector(".photo-dialog__next");
  let currentDialogLink = null;
  let prevLink = null;
  let nextLink = null;

  function updateDialogImage(linkElement) {
    const image = linkElement.querySelector("img");
    const targetElement = dialog.querySelector(".photo-dialog__image");
    targetElement.sizes = "80vw"; // CSSのmax-inline-size 80dvwとそろえる

    ["src", "srcset", "width", "height", "alt"].forEach((key) => {
      targetElement[key] = image[key];
    });
  }
  function checkCurrentNode(element) {
    currentDialogLink = element;
    const currentSection = currentDialogLink.closest(".gallery-year");
    const currentNodes = currentSection.querySelectorAll(".photo-grid__link");
    const index = Array.from(currentNodes).indexOf(element);
    dialog.querySelector(".photo-dialog__current").textContent = index + 1;
    dialog.querySelector(".photo-dialog__total").textContent = currentNodes.length;
    // 読み上げ用：「3 / 10」はスラッシュと読まれてしまうため、文章にして写真の説明（alt）も添える
    dialog.querySelector(".photo-dialog__status").textContent =
      `${currentNodes.length}枚中${index + 1}枚目：${element.querySelector("img").alt}`;
    if (index !== -1) {
      prevLink = currentNodes[index - 1];
      nextLink = currentNodes[index + 1];

      [
        { button: prevBtn, link: prevLink },
        { button: nextBtn, link: nextLink },
      ].forEach(({ button, link }) => {
        button.setAttribute("aria-disabled", String(link === undefined));
      });
    }
  }
  yearsContainer.addEventListener("click", (e) => {
    const checkElement = e.target.closest(".photo-grid__link");
    if (checkElement !== null) {
      e.preventDefault();
      updateDialogImage(checkElement);
      checkCurrentNode(checkElement);
      dialog.showModal();
    }
  });
  prevBtn.addEventListener("click", (e) => {
    if (prevLink !== undefined) {
      updateDialogImage(prevLink);
      checkCurrentNode(prevLink)
    }
  });
  nextBtn.addEventListener("click", (e) => {
    if (nextLink !== undefined) {
      updateDialogImage(nextLink);
      checkCurrentNode(nextLink)
    }
  });
  function updateCurrentFilter(year) {
    const options = filterOptionsContainer.querySelectorAll(".gallery-filter__option")
    for (const option of options) {
      option.classList.remove('gallery-filter__option--current');
    }
    const putElement = filterOptionsContainer.querySelector(`input[value="${year}"]`);
    if (putElement !== null) {
      putElement.closest(".gallery-filter__option").classList.add('gallery-filter__option--current');
    }
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const entryYear = entry.target.dataset.year;
        updateCurrentFilter(entryYear);
      }
    }
    //50%でPCスマホ両方で正しい挙動に
  }, { rootMargin: "-50% 0px -50% 0px" });
  const observeTargets = yearsContainer.querySelectorAll(".gallery-year");
  for (const target of observeTargets) {
    observer.observe(target);
  }
  dialog.querySelector(".photo-dialog__close")
    .addEventListener("click", () => {
      dialog.close();
    });

  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;

    const rect = dialog.getBoundingClientRect();
    const isOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (isOutside) {
      dialog.close();
    }
  });
}
init();

initYearFilter(statusElement, filterOptionsContainer, yearsContainer);


