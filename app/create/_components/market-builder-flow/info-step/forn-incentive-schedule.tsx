"use client";

export const IncentiveScheduleMap = {
  upfront: {
    id: "upfront",
    label: "Upfront",
    tag: "",
    description: "Pay all incentives at the completion of action.",
  },
  arrear: {
    id: "arrear",
    label: "Arrear",
    tag: "",
    description:
      "Lock Action Provider's assets and pay incentives once unlocked.",
  },
  forfeitable: {
    id: "forfeitable",
    label: "Forfeitable",
    tag: "",
    description:
      "Lock Action Provider's assets and stream incentives, which are forfeited if withdrawn early.",
  },
};
