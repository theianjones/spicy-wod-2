export const scoreToMinutesAndSeconds = (score: number) => {
  const minutes = Math.floor(score / 60);
  const seconds = score % 60;
  return { minutes, seconds };
};
