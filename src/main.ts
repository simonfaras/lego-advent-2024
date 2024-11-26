import { imagesForDays } from "./images.config";
import "./index.css";

const days = Array(24)
  .fill(1)
  .map((base, index) => base + index);

// const today = new Date(Date.now()).getDate();
const today = 12;

const root = document.querySelector<HTMLDivElement>("#app")!;

type ClassListArg = string | undefined | boolean;
const classList = (...args: ClassListArg[]) =>
  args.filter((v) => !!v).join(" ");

root.innerHTML = `
  <main>
    ${days
      .map((day) => {
        const isAvailable = day <= today;

        return `<button class="${classList(
          "day",
          isAvailable && "available"
        )}" ${!isAvailable ? "disabled" : ""}>${day}</button>`;
      })
      .join("")}
    <dialog id="day-dialog" />
  </main>
`;

const dialog = document.getElementById("day-dialog")! as HTMLDialogElement;

// dialog.addEventListener("click", () => {
//   dialog.close();
// });

root.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;

  if (target.classList.contains("day")) {
    handleOnDayClick(Number.parseInt(target.innerText));
  }
});

const handleOnDayClick = (day: number) => {
  const imageCountForDay = imagesForDays[day];

  console.log(`=====> `, imagesForDays);

  if (imageCountForDay == null) {
    console.log("Unknown day", day);
    return;
  }

  const getSlideId = (page: number) => `${day}-${page}`;

  const pages = Array(imageCountForDay)
    .fill(1)
    .map((base, index) => base + index);

  dialog.innerHTML = `
    <div class="slider">
      <a class="prev nav">${arrow}</a>
      <a class="next nav">${arrow}</a>
      <div class="slides">
      ${pages
        .map(
          (page) =>
            `<div id="#${getSlideId(page)}" data-page=${page}>
          <div>
          <img src="/lego-advent-2024/images/${getSlideId(
            page
          )}.png" /></div></div>`
        )
        .join("")}
      </div>
    </div>
  `;
  dialog.showModal();

  const slides = dialog.querySelector(".slides");

  dialog.querySelectorAll(".nav").forEach((el) =>
    el.addEventListener("click", (event) => {
      const target = event.currentTarget as HTMLElement;

      const isNext = target.classList.contains("next");
      slides?.scrollBy({ left: isNext ? 1 : -1, behavior: "smooth" });
    })
  );

  const prev = dialog.querySelector(".prev");
  const next = dialog.querySelector(".next");

  dialog
    .querySelector(".slides")
    ?.addEventListener("scrollsnapchange", (event) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const target = (event as any).snapTargetInline as HTMLElement;
      const page = Number(target.dataset.page);

      if (!page) {
        console.warn("Missing page for target", target);
        return;
      }

      prev?.classList.toggle("hidden", page === 1);
      next?.classList.toggle("hidden", page === imageCountForDay);
    });
};

const arrow = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <g>
      <path d="M12,2A10,10,0,1,0,22,12,10.011,10.011,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,12,20Z"/>
      <polygon points="13.293 7.293 8.586 12 13.293 16.707 14.707 15.293 11.414 12 14.707 8.707 13.293 7.293"/>
  </g>
  </svg>
`;
