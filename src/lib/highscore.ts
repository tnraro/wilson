const enum Key {
  Highscore = "highscore"
}
export const getHighscore = () => {
  const highscore = localStorage.getItem(Key.Highscore);
  if (highscore == null) return 0;
  return Math.round((parseInt(highscore, 36) - 53) / 53);
}
export const setHighscore = (score: number) => {
  const highscore = getHighscore();
  if (score > highscore) {
    localStorage.setItem(Key.Highscore, (score * 53 + 53).toString(36));
    return true;
  }
  return false;
}