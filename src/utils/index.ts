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
