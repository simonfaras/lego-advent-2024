type DayConfig = {
  day: number;
  book: 1 | 2;
  spans: [number, number][];
};

export const imagesForDays: DayConfig[] = [
  {
    day: 1,
    book: 1,
    spans: [
      [1, 3],
      [2, 4],
      [9, 11],
      [12, 13],
    ],
  },
];
