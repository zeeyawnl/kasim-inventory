export const PRICING = {
  DEFAULT_TAX_RATE: 18, // GST percentage
  MAX_DISCOUNT_PERCENT: 50,
  CURRENCY: "INR",
  LOCALE: "en-IN",
} as const;

export const PRICE_TYPES = {
  RETAIL: "retail",
  WHOLESALE: "wholesale",
} as const;

export type PriceType = (typeof PRICE_TYPES)[keyof typeof PRICE_TYPES];
