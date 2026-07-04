import { useEffect, useId, useRef, useState } from "react";

export type DropdownOption<T> = {
  value: T;
  label: string;
};

type DropdownProps<T> = {
  label: string;
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
};

function Dropdown<T>({
  label,
  value,
  options,
  onChange,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? "";

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs uppercase tracking-widest">{label}</span>

      <div ref={containerRef} className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          onClick={() => setOpen((current) => !current)}
          className="flex min-w-[5rem] items-center justify-between gap-2 border border-black bg-white px-2 py-1 text-xs uppercase tracking-widest"
        >
          <span>{selectedLabel}</span>
          <span aria-hidden="true">{open ? "▴" : "▾"}</span>
        </button>

        {open && (
          <ul
            id={listboxId}
            role="listbox"
            aria-label={label}
            className="absolute left-0 top-full z-20 mt-1 max-h-48 min-w-full overflow-y-auto border border-black bg-white"
          >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <li key={String(option.label)} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`w-full px-2 py-1 text-left text-xs uppercase tracking-widest hover:bg-neutral-200 ${
                    isSelected ? "bg-black text-white hover:bg-black" : ""
                  }`}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
        )}
      </div>
    </div>
  );
}

export default Dropdown;
