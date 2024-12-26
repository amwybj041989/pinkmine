function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}
export let colors = window['linearColos'];
export let getColors = () => {
  let randomIndex = getRandomIndex(colors);
  // return {
  //   index: randomIndex,
  //   colors: colors[randomIndex],
  // };
  return colors[randomIndex];
};
