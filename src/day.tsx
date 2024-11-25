import { forwardRef, useImperativeHandle, useRef } from "react";

export type DayHandle = {
  open: (day: number) => void;
};

type DayProps = {
  test: string;
};

export const Day = forwardRef<DayHandle, DayProps>((props, ref) => {
  const dialog = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    open: (day: number) => {
      console.log("Open thing", day);
      dialog.current?.showModal();
    },
  }));

  return <dialog ref={dialog}>Dialog</dialog>;
});
