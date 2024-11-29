import { imagesForDays } from "./images.config";
import "./index.css";

const days = Array(24)
  .fill(1)
  .map((base, index) => base + index);

// const today = new Date(Date.now()).getDate();
const today = 24;

const root = document.querySelector<HTMLDivElement>("#app")!;

root.innerHTML = `
  <main>
    ${days
      .map((day) => {
        const isAvailable = day <= today;

        return `<button class="day" ${
          !isAvailable ? "disabled" : ""
        }>${day}</button>`;
      })
      .join("")}
    <dialog id="day-dialog" />
  </main>
`;

const dialog = document.getElementById("day-dialog")! as HTMLDialogElement;

root.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;

  if (target.classList.contains("day")) {
    handleOnDayClick(Number.parseInt(target.innerText));
  }
});

const handleOnDayClick = (day: number) => {
  const imageCountForDay = imagesForDays[day];

  if (imageCountForDay == null) {
    console.log("Unknown day", day);
    return;
  }

  const getSlideId = (page: number) => `${day}-${page}`;

  const pages = Array(imageCountForDay)
    .fill(1)
    .map((base, index) => base + index);

  dialog.innerHTML = `
    <button class="close">${close}</button>
    <div class="slider">
      <button class="prev nav hidden">${arrow}</button>
      <button class="next nav hidden">${arrow}</button>
      <div class="slides">
      ${pages
        .map(
          (page) =>
            `<div id="#${getSlideId(page)}" data-page=${page} class="slide">
          <div>
          <img src="/images/${getSlideId(page)}.png" />
          </div></div>`
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

  dialog.querySelector(".close")?.addEventListener("click", () => {
    dialog.close();
  });

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

const close = `
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 30 30" fill="currentColor" stroke="currentColor">
      <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path>
  </svg>
`;
