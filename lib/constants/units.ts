export const UNITS = [
  { value: "pcs", label: "Pieces" },
  { value: "kg", label: "Kilograms" },
  { value: "g", label: "Grams" },
  { value: "l", label: "Litres" },
  { value: "ml", label: "Millilitres" },
  { value: "m", label: "Metres" },
  { value: "cm", label: "Centimetres" },
  { value: "box", label: "Boxes" },
  { value: "pack", label: "Packs" },
  { value: "dozen", label: "Dozen" },
] as const;

export type Unit = (typeof UNITS)[number]["value"];
