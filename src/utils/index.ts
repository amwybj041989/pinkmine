import { getColors, colors } from '@/utils/types/colors';

// animateNumber(numberElement, 0, 3519699.366184, 1000); // 从0增长到$3,519,699.366184，持续1秒

export function animateNumber(targetElement, startValue, endValue, duration) {
  const interval = 50;
  const increment = (endValue - startValue) / (duration / interval);
  let currentValue = startValue;
  // 使用Intl.NumberFormat来格式化数字，添加逗号分隔符
  const formatter = new Intl.NumberFormat();

  function updateNumber() {
    currentValue += increment;
    currentValue = Math.min(currentValue, endValue);
    // 使用formatter格式化当前值
    targetElement.textContent = `${formatter.format(currentValue.toFixed(2))}`;
    if (currentValue === endValue) {
      clearInterval(intervalId);
    }
  }

  const intervalId = setInterval(updateNumber, interval);
}
export function observeVisibility(targetElement, callback, options = {}) {
  const defaultOptions = {
    root: null, // 默认观察视口
    rootMargin: '0px', // 默认不扩展视口边界
    threshold: 0.1, // 默认阈值，当目标元素至少有10%可见时触发回调
  };

  // 合并默认选项和用户提供的选项
  const observerOptions = { ...defaultOptions, ...options };

  // 创建一个观察器实例并传入回调函数
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      // 当目标元素可见时调用回调函数
      if (entry.isIntersecting) {
        callback(true, entry);
      } else {
        callback(false, entry);
      }
    });
  }, observerOptions);

  // 开始观察目标元素
  observer.observe(targetElement);

  // 返回观察器实例，以便可以在需要时停止观察
  return observer;
}

export function generateRandomEthAddress() {
  // 以太坊地址是20字节的值，因此我们需要40个十六进制数字
  const addressLength = 40;
  let randomAddress = '0x';

  // 生成40个随机十六进制数字
  for (let i = 0; i < addressLength; i++) {
    // 生成一个0-15之间的随机数，然后转换为相应的十六进制数字
    const randomByte = Math.floor(Math.random() * 16);
    randomAddress += randomByte.toString(16);
  }

  return randomAddress;
}
export function generateFakeTronAddress() {
  const prefix = 'T'; // Tron地址前缀
  const hexChars = '0123456789abcdef'; // 十六进制字符集
  let fakeAddress = prefix;

  // 生成32个随机十六进制字符
  for (let i = 0; i < 32; i++) {
    fakeAddress += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
  }

  return fakeAddress;
}
export function generateRandomDecimalInRange(min, max, decimalPlaces = 8) {
  // 生成一个介于0和1之间的随机数
  const randomNumber = Math.random();

  // 将随机数映射到指定的范围
  const scaledNumber = min + randomNumber * (max - min);

  // 使用toFixed()确保结果有指定的小数位数
  const fixedNumber = scaledNumber.toFixed(decimalPlaces);

  // 转换回浮点数
  return parseFloat(fixedNumber);
}

// console.log(generateRandomDecimalInRange(0.07, 0.08, 8));

export function generateRandomGradient(v) {
  if (v != undefined) {
  }
  let colors = getColors();
  // 生成随机颜色的函数，排除黑色系和灰色系
  // function getRandomColor() {
  //   let color;
  //   let isBlackOrGray;
  //   do {
  //     color =
  //       '#' +
  //       Math.floor(Math.random() * 0xffffff)
  //         .toString(16)
  //         .padStart(6, '0');
  //     // 将颜色转换为RGB值
  //     const r = parseInt(color.substr(1, 2), 16);
  //     const g = parseInt(color.substr(3, 2), 16);
  //     const b = parseInt(color.substr(5, 2), 16);
  //     // 检查颜色是否接近黑色或灰色
  //     isBlackOrGray = (r < 64 && g < 64 && b < 64) || (Math.abs(r - g) < 32 && Math.abs(r - b) < 32 && Math.abs(g - b) < 32);
  //   } while (isBlackOrGray); // 如果是黑色或灰色，重新生成
  //   return color;
  // }

  // 更新CSS变量的值
  document.documentElement.style.setProperty('--gradient-color1', colors[0]);
  document.documentElement.style.setProperty('--gradient-color2', colors[1]);
  document.documentElement.style.setProperty('--gradient-color3', colors[2]);
}

export function bigNum(params) {
  // let value = el.innerHTML * 1;
  let value = params * 1;
  if (value < 0.0001) {
    return 0.0001;
  }
  if (typeof value == 'number') {
    function formatNumberWithCommasAndDecimals(number) {
      let roundedNumber = number * 1;
      let [integerPart, decimalPart] = roundedNumber.toString().split('.');
      let formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      // return formattedIntegerPart + '.' + decimalPart;
      return formattedIntegerPart;
    }
    if (value) {
      return formatNumberWithCommasAndDecimals(value);
    }
  }
}
export let chargeList = {
  tron: 'https://tronscan.org/#/',
  bsc: 'https://p2p.binance.com/express/buy/USDT/USD',
  eth: 'https://p2p.binance.com/express/buy/USDT/USD',
};
export let getAssetsFile=(url)=>{
   return new URL(`../assets/${url}`, import.meta.url).href;
}
