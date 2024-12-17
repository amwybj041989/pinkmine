export function initPoolData(action) {
  if (localStorage.userRevenue && localStorage.participant && localStorage.validNode && localStorage.totalOutput) {
    let obj1 = {
      userRevenue: localStorage.userRevenue * 1,
      participant: localStorage.participant * 1,
      validNode: localStorage.validNode * 1,
      totalOutput: localStorage.totalOutput * 1,
    };
    return;
  }
  let baseData = parseInt(new Date().getTime() / 100000);
  let randon_base = Math.random() * (0.005 - 0.001) + 0.001;
  // let baseNumber = parseInt(baseData * randon_base);
  let baseNumber = parseInt(baseData * (1 + randon_base));
  let randon = Math.random() * (0.005 - 0.001) + 0.001;
  let userRevenue = parseFloat(baseNumber * (1 - randon) * 0.1).toFixed(2);
  let participant = parseInt(baseNumber * (1 - randon) * 0.006);
  let validNode = parseInt(baseNumber * (1 - randon) * 0.007);
  let totalOutput = parseInt(baseNumber * (1 - randon) * 0.0002);
  let obj = {
    userRevenue,
    participant,
    validNode,
    totalOutput,
  };
  return obj;
}
export function clearPoolData() {
  localStorage.removeItem('userRevenue');
  localStorage.removeItem('participant');
  localStorage.removeItem('validNode');
  localStorage.removeItem('totalOutput');
}
export function initTrendData() {
  let now = 0;
  if (localStorage.userRevenue) {
    now = localStorage.userRevenue * 1;
  } else {
    let data = initPoolData();
    now = data.userRevenue;
  }
  function random() {
    return Math.random() * (0.05 - 0.001) + 0.001;
  }

  return {
    now,
    up: random(),
    list: [parseFloat(now * (1 - random())).toFixed(2), parseFloat(now * (1 - random())).toFixed(2), parseFloat(now * (1 - random())).toFixed(2), parseFloat(now * (1 - random())).toFixed(2), now],
  };
}
