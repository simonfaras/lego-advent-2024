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
  const config = imagesForDays.find((d) => d.day === day);

  console.log(`=====> `, imagesForDays);

  if (config == null) {
    console.log("Unknown day", day);
    return;
  }

  const getSlideId = ([from, to]: [number, number]) =>
    [config.book, from, to].join("-");

  dialog.innerHTML = `
    <div class="slider">
      
      <div class="slides">
      ${config.spans
        .map(
          (span) =>
            `<div><img src="/lego-advent-2024/images/${getSlideId(
              span
            )}.png" /></div>`
        )
        .join("")}
      </div>
    </div>
  `;
  dialog.showModal();
};
