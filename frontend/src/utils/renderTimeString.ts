export const convertSeconds = (time: number) => ({
  hours: Math.floor(time / (60 * 60)),
  minutes: Math.floor(time / 60),
  seconds: Math.ceil(time % (60 * 60)) % 60,
});

const renderTimeString = (time: number) => {
  const { hours, minutes, seconds } = convertSeconds(time);
  let timeStr = "";

  if (hours) {
    timeStr += `${hours}:`;
    timeStr += minutes ? `${minutes}:` : "0:";
    timeStr += seconds ? `${seconds.toString().padStart(2, "0")}` : "00";
  } else {
    timeStr += minutes ? `${minutes}:` : "0:";
    timeStr += seconds ? `${seconds.toString().padStart(2, "0")}` : "00";
  }

  return timeStr;
};

export default renderTimeString