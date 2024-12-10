return new Promise(async (resolve, reject) => {
	let amount = ethers.parseEther(number + ''); //数量
	earn.lockLp(amount).then(tx => {
		tx.wait().then(txReceipt => {
			if (txReceipt && txReceipt.status == 1) { //交易成功
				return resolve(txReceipt.hash)
			}
		}).catch(err => {
			let message = getWalletError(err)
			return reject(message)
		});
	}).catch(err => {
		let message = getWalletError(err)
		return reject(message)
	});
})

return new Promise(async (resolve, reject) => {
	let amount = ethers.parseEther(number + ''); //数量
	pair.allowance(signer.address, earnAddress).then(allowance => {
		if (allowance < amount) { //如果allowance<质押数量，则需要重新授权
			return resolve(false)
		}
		return resolve(true)
	}).catch(err => {
		let message = getWalletError(err)
		return reject(message)
	})
})

return new Promise(async (resolve, reject) => {
	let gasUsed = await pair.approve.estimateGas(earnAddress, ethers.MaxUint256);
	let needBnb = ethers.formatEther(feeData.gasPrice * gasUsed);
	return resolve(needBnb)
})
return new Promise(async (resolve, reject) => {
	pair.approve(earnAddress, ethers.MaxUint256).then(tx => {
		tx.wait().then(txReceipt => {
			if (txReceipt && txReceipt.status == 1) { //交易成功
				return resolve(txReceipt.hash)
			}
		}).catch(err => {
			return reject(err)
		});
	}).catch(err => {
		let message = getWalletError(err)
		return reject(message)
	});
})