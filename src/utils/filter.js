import {
  formNumber
} from './tools.js'

export default {
  loading: (el, binding) => {
    let value = binding.value;
    // if (!value) {
    //   el.classList.add('loading')
    // }
    // console.log('loading', value);
    var newNode = document.createElement('div');
    newNode.classList.add('loading')
    newNode.id = 'newNodeId';
    var rect = el.getBoundingClientRect();
    if (!value) {
      el.classList.add('relative')
      el.insertAdjacentElement('beforeend', newNode);
      var width = rect.width; // 元素的宽度
      var height = el.offsetHeight; // 元素的高度
      newNode.style.width = el.clientWidth + 'px'
      newNode.style.height = height + 'px'
      newNode.style.borderRadius = (el.clientHeight / 2) + 'px'
    } else {
      el.classList.remove('relative')
      var nodeToRemove = document.getElementById('newNodeId');
      if (nodeToRemove) {
        nodeToRemove.remove();
      }
    }
  },
  balance: (el, binding) => {
    let value = binding.value + '';
    let html = formNumber(value, 2)
    el.innerHTML = html
  },
  rate: (el, binding) => {
    let value = binding.value * 1;
    // console.log(value);
    let html = parseFloat(value * 100).toFixed(2)
    // console.log(html);
    el.innerHTML = html + '%'
  },
  bigNum: (el, binding) => {
    // let value = el.innerHTML * 1;
    let value = binding.value * 1;
    if (value < 0.0001) {
      el.innerHTML = 0;
      return;
    }
    if (!value) {
      el.innerHTML = 0;
      return;
    }
    if (typeof value == 'number') {
      function formatNumberWithCommasAndDecimals(number) {
        // 保留两位小数
        let roundedNumber = Math.round(number * 100) / 100;
        let numberString = roundedNumber.toString();
        let [integerPart, decimalPart] = numberString.split('.');
        let formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        // 如果有小数部分，则添加到格式化后的整数部分
        if (decimalPart) {
          return formattedIntegerPart + '.' + decimalPart;
        } else {
          return formattedIntegerPart;
        }
      }
      if (value) {
        el.innerHTML = formatNumberWithCommasAndDecimals(value);
        return;
      }
    }
  },
  timestamp: (el, binding) => {
    let value = binding.value * 1;
    if (!value || typeof value == 'undefined' || value == '') {
      el.innerHTML = '00-00  00:00'
      return
    }
    let date = new Date(value * 1000);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    // let times = `${month}-${day}  ${hours} : ${minutes} : ${seconds}`;
    let times = `${month}-${day}  ${hours} : ${minutes}`;
    el.innerHTML = times;
  },
  date: (el, binding) => {
    let value = binding.value;
    let date = new Date(value);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let year = date.getFullYear();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    let times = `${year}-${month}-${day}  ${hours} : ${minutes}`;
    el.innerHTML = times;
  },
  address: (el, binding) => {
    let value = binding.value;
    if (!value) {
      return '---';
    }
    let str = value.substr(0, 8) + '...' + value.substr(-8, 8);
    el.innerHTML = str;
  },
  addr: (el, binding) => {
    let value = binding.value;
    if (!value) {
      el.innerHTML = '---';
      return
    }
    let str = value.substr(0, 12) + '...' + value.substr(-12, 12);
    el.innerHTML = str;
  },
  hash: (el, binding) => {
    let value = binding.value;
    if (!value) {
      el.innerHTML = '---';
      return
    }
    let str = value.substr(0, 4) + '...' + value.substr(-4, 4);
    el.innerHTML = str;
  },
  bg: (el, binding) => {
    el.style.backgroundImage = `url(${binding.value})`;
  },
};
