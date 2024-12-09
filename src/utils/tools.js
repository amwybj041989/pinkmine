function padNumber(num, length) {
	let numStr = num.toString();
	while (numStr.length < length) {
		numStr += '0';
	}
	return numStr;
}
export let formNumber = (v, width) => {
	if (v * 1 == 0 || !v || v == 'undefined' || v == undefined) {
		return '0.' + padNumber(0, width);
	} else {
		let value = v + '';
		if (!width) {
			if (value) {
				let list = value.split('.')
				return list[0];
			} else {
				return 0;
			}
			return

		}
		if (value) {
			let list = value.split('.')
			if (list.length == 2) {
				let str = list[1].substring(0, width)
				return list[0] + '.' + padNumber(str, width)
			}
			if (list.length == 1 && width != 0) {
				return list[0] + '.' + padNumber(0, width)
			}
			return list[0];
		} else {
			return '0.' + padNumber(0, width);
		}
	}
}