export const formatLockupTime = (lockup: string) => {
  try {
    const seconds = parseInt(lockup);

    if (seconds < 3600) {
      return `${seconds} ${seconds === 1 ? "Second" : "Seconds"}`;
    }

    const hours = Math.ceil(seconds / 3600);
    if (hours < 24) {
      return `${hours} ${hours === 1 ? "Hour" : "Hours"}`;
    }

    const days = Math.ceil(seconds / (24 * 3600));
    return `${days} ${days === 1 ? "Day" : "Days"}`;
  } catch (error) {
    return "-";
  }
};

export const formatLockupTimeAbbreviated = (lockup: string) => {
  try {
    const seconds = parseInt(lockup);

    if (seconds < 3600) {
      return `${seconds}S`;
    }

    const hours = Math.ceil(seconds / 3600);
    if (hours < 24) {
      return `${hours}H`;
    }

    const days = Math.ceil(seconds / (24 * 3600));
    return `${days}D`;
  } catch (error) {
    return "-";
  }
};
