import {
	usdtAddress,
	cycAddress,
	cycNftAddress,
	cycStakingAddress,
	pairAddress,
	earnAddress,
	bindingAddress,
	root,
	LOCK_PERIOD,
	ISSUE_PERIOD,
	ISSUE_SECONDS,
	NftPrice,
	mintLimit
} from './config.js'
import {
	getWalletError
} from '@/utils/index';
import {
	usdtABI,
	cycABI,
	cycNftABI,
	cycStakingABI,
	pairABI,
	earnABI,
	bindingABI
} from './abi.js'
import {
	ethers,
	BrowserProvider
} from 'ethers';

import {
	Snackbar
} from '@varlet/ui'
import store from '@/store';
var provider = null;
var signer = null
var cyc = null
var cycStaking = null
var cycNft = null
var earn = null
var pair = null
var feeData = null
var usdt = null

function handleError(error, token) {
	if (error.data && token) {
		let decodedError = token.interface.parseError(error.data);
		return `Transaction failed:${decodedError?.name} `
	} else {
		return getWalletError(error)
	}
}
export function getAddress() {
	return new Promise(async (resolve, reject) => {
		if (provider == null) {
			provider = new BrowserProvider(window.ethereum);
		}

		provider.send('eth_requestAccounts', []).then(async a => {
			return resolve(a[0])
		}).catch(err => {
			let message = handleError(err, provider)
			return reject(message)
		})
	})
}
export function connect() {
	return new Promise(async (resolve, reject) => {
		if (provider == null) {
			provider = new BrowserProvider(window.ethereum);
		}
		// let _network = provider.provider
		// if (Number(_network.chainId) != 56) {
		// 	Snackbar.error('The current network is not a BSC network, please replace the network')
		// 	return resolve(false)
		// }
		provider.send('eth_requestAccounts', []).then(async a => {
			sessionStorage.address = a[0]
			signer = await provider.getSigner();
			cyc = new ethers.Contract(cycAddress, cycABI, provider)
			cycStaking = new ethers.Contract(cycStakingAddress, cycStakingABI, signer);
			cycNft = new ethers.Contract(cycNftAddress, cycNftABI, signer);
			earn = new ethers.Contract(earnAddress, earnABI, signer);
			pair = new ethers.Contract(pairAddress, pairABI, signer)
			usdt = new ethers.Contract(usdtAddress, usdtABI, signer);
			feeData = await provider.getFeeData();
			store.commit('setConnect')
			return resolve(a[0])
		}).catch(err => {
			let message = handleError(err, provider)
			return reject(message)
		})
	})

}
export function totalBalance() {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			let cyc = new ethers.Contract(cycAddress, cycABI, provider)
			let total = await cyc.totalSupply();
			return resolve(ethers.formatEther(total))
		})
	})
}
export function bnbBalance() {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let balance = await provider.getBalance(signer.address);
			let start = await cyc.start();
			let result = {
				balance: ethers.formatEther(balance),
				mintTime: new Date(Number(start) * 1000),
			}
			return resolve(result)
		})
	})
}
export function tokenBalance() {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let decimals = await cyc.decimals()
			let balance = await cyc.balanceOf(signer.address)
			return resolve(ethers.formatUnits(balance, decimals))
		})
	})
}
export function mintedTotal() {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let minted = await cyc.minted();
			return resolve(ethers.formatEther(minted))
		})
	})
}
export function mintPrice(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let amount = ethers.parseEther('10');
			let price = await cyc.mintPrice(amount);
			return resolve(ethers.formatEther(price))
		})
	})
}
export function mint(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let signer = await provider.getSigner();
			let cyc = new ethers.Contract(cycAddress, cycABI, signer)
			let amount = ethers.parseEther(mintLimit + '');
			let price = await cyc.mintPrice(amount);
			let feeData = await provider.getFeeData();
			let gasUsed = await cyc.mint.estimateGas(amount, {
				value: price
			});
			let needBnb = ethers.formatEther(feeData.gasPrice * gasUsed);
			cyc.mint(amount, {
				value: price
			}).then(tx => {
				tx.wait().then(txReceipt => {
					if (txReceipt && txReceipt.status == 1) {
						return resolve(txReceipt.hash)
					}
				}).catch(err => {
					let message = handleError(err, cyc)
					return reject(message)
				});
			}).catch(err => {
				let message = handleError(err, cyc)
				return reject(message)
			});
		})
	})
}

export function stakeForNftApproveSataus(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let amount = ethers.parseEther(number + '');
			cyc.allowance(signer.address, cycStakingAddress).then(allowance => {
				if (allowance < amount) {
					return resolve(false)
				}
				return resolve(true)
			}).catch(err => {
				let message = handleError(err, cyc)
				return reject(message)
			})
		})
	})
}
export function stakeForNftApproveBnb(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let gasUsed = await cyc.approve.estimateGas(cycStakingAddress, ethers.MaxUint256);
			let needBnb = ethers.formatEther(feeData.gasPrice * gasUsed);
			return resolve(needBnb)
		})
	})
}

export function stakeForNftApprove() {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let cyc = new ethers.Contract(cycAddress, cycABI, signer)
			cyc.approve(cycStakingAddress, ethers.MaxUint256).then(tx => {
				tx.wait().then(txReceipt => {
					if (txReceipt && txReceipt.status == 1) {
						return resolve(txReceipt.hash)
					}
				}).catch(err => {
					let message = handleError(err, cyc)
					return reject(message)
				});
			}).catch(err => {
				let message = handleError(err, cyc)
				return reject(message)
			});
		})
	})
}
export function stakeForNftBnb(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let amount = ethers.parseEther(number + '');
			let gasUsed = await cycStaking.stake.estimateGas(amount);
			let needBnb = ethers.formatEther(feeData.gasPrice * gasUsed);
			return resolve(needBnb)
		})
	})
}
export function stakeForNft(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let amount = ethers.parseEther(number + '');
			cycStaking.stake(amount).then(tx => {
				tx.wait().then(txReceipt => {
					if (txReceipt && txReceipt.status == 1) {
						return resolve(txReceipt.hash)
					}
				}).catch(err => {
					let message = handleError(err, cycStaking)
					return reject(message)
				});
			}).catch(err => {
				let message = handleError(err, cycStaking)
				return reject(message)
			});
		})
	})
}

export function nftBalance() {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let address = signer.address
			// let address = '0x835eeda76ef68e3e8d54ec0b8efcf0aca9d5e7c2'
			let balance = await cycNft.balanceOf(address)
			let baseUri = await cycNft.baseURI();
			let imageUrl = baseUri.replace('meta', 'images');
			let imgs = []
			let superNft = false
			let ids = []
			for (let i = 0; i < balance; ++i) {
				let id = await cycNft.tokenOfOwnerByIndex(address, i);
				if (Number(id) == 1 || Number(id) == 2) {
					superNft = true
				}
				// ids.push(Number(id))
				if (id <= 2) {
					imgs.push({
						id: Number(id),
						img: `${imageUrl}1`
					})
				} else {
					imgs.push({
						id: Number(id),
						img: `${imageUrl}3`
					})
				}
			}
			let stake = await cycStaking.stakingPerAccount(signer.address);
			let redeem = await cycStaking.withdrawable(signer.address);
			let result = {
				balance: Number(balance),
				cyc: ethers.formatEther(stake),
				redeem: ethers.formatEther(redeem),
				imgs: imgs,
				superNft,
				nfts: Math.ceil(ethers.formatEther(stake) / NftPrice)
			}
			return resolve(result)
		})
	})
}

export function nftStakingClaimable() {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let claimable = ethers.formatEther(await cycStaking.claimable(signer.address))
			return resolve(claimable)
		})
	})
}

export function claim() {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			cycStaking.claim().then(tx => {
				tx.wait().then(txReceipt => {
					if (txReceipt && txReceipt.status == 1) {
						return resolve(txReceipt.hash)
					}
				}).catch(err => {
					return reject(err)
				});
			}).catch(err => {
				let message = handleError(err, cycStaking)
				return reject(message)
			});
		})
	})
}


export function unstake(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let amount = ethers.parseEther(number + '');
			cycStaking.unstake(amount).then(tx => {
				tx.wait().then(txReceipt => {
					if (txReceipt && txReceipt.status == 1) {
						return resolve(txReceipt.hash)
					}
				}).catch(err => {
					return reject(err)
				});
			}).catch(err => {
				let message = handleError(err, cycStaking)
				return reject(message)
			});
		})
	})
}
export function withdrawBnb() {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let gasUsed = await cycStaking.withdraw.estimateGas();
			let needBnb = ethers.formatEther(feeData.gasPrice * gasUsed);
		})
	})
}
export function withdraw() {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			cycStaking.withdraw().then(tx => {
				tx.wait().then(txReceipt => {
					if (txReceipt && txReceipt.status == 1) {
						return resolve(txReceipt.hash)
					}
				}).catch(err => {
					return reject(err)
				});
			}).catch(err => {
				let message = handleError(err, cycStaking)
				return reject(message)
			});
		})
	})
}

export function lockLPCalc(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let amount = ethers.parseEther(number + '');
			let pair = new ethers.Contract(pairAddress, pairABI, provider)
			let r = await pair.getReserves();
			let totalSupply = await pair.totalSupply();
			let usdt = 0
			let cyc = 0
			if (usdtAddress < cycAddress) {
				usdt = ethers.formatEther(r[0] * amount / totalSupply)
				cyc = ethers.formatEther(r[1] * amount / totalSupply)
			} else {
				cyc = ethers.formatEther(r[0] * amount / totalSupply)
				usdt = ethers.formatEther(r[1] * amount / totalSupply)
			}
			return resolve({
				usdt,
				cyc
			})
		})
	})

}
export function lpBalance() {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let pair = new ethers.Contract(pairAddress, pairABI, provider)
			let balance = await pair.balanceOf(signer.address)
			let totalSupply = await pair.totalSupply();
			let r = await pair.getReserves();
			let usdt = 0
			let cyc = 0
			if (usdtAddress < cycAddress) {
				usdt = ethers.formatEther(r[0] * balance / totalSupply)
				cyc = ethers.formatEther(r[1] * balance / totalSupply)
			} else {
				cyc = ethers.formatEther(r[0] * balance / totalSupply)
				usdt = ethers.formatEther(r[1] * balance / totalSupply)
			}
			let lpLock = ethers.formatEther(await earn.lockedPerAccount(signer.address))
			let latestLockTimestamp = await earn.latestLockPerAccount(signer.address);
			let now = Math.round(Date.now() / 1000);
			let lpExtractable = 0
			if (now - Number(latestLockTimestamp) >= LOCK_PERIOD) {
				lpExtractable = ethers.formatEther(await earn.lockedPerAccount(signer.address))
			}
			let result = {
				lpBalance: ethers.formatEther(balance),
				usdt,
				cyc,
				lpLock,
				lpExtractable,
				latestLockTimestamp: Number(latestLockTimestamp) + LOCK_PERIOD
			}
			return resolve(result)
		})
	})
}
export function lockLpApproveStatus(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			// let amount = ethers.parseEther(number + '');
			let cusd = ethers.parseEther(number + "");
			let needU = cusd / BigInt(8);
			let totalSupply = await pair.totalSupply();
			let r = await pair.getReserves();
			let amount;
			if (usdtAddress < cycAddress) {
				amount = needU * totalSupply / r[0];
			} else {
				amount = needU * totalSupply / r[1];
			}
			pair.allowance(signer.address, earnAddress).then(allowance => {
				if (allowance < amount) {
					return resolve(false)
				}
				return resolve(true)
			}).catch(err => {
				let message = handleError(err, pair)
				return reject(message)
			})
		})
	})
}
export function lockLpApproveBnb(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let gasUsed = await pair.approve.estimateGas(earnAddress, ethers.MaxUint256);
			let needBnb = ethers.formatEther(feeData.gasPrice * gasUsed);
			return resolve(needBnb)
		})
	})
}
export function lockLpTokenApprove() {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			pair.approve(earnAddress, ethers.MaxUint256).then(tx => {
				tx.wait().then(txReceipt => {
					if (txReceipt && txReceipt.status == 1) {
						return resolve(txReceipt.hash)
					}
				}).catch(err => {
					let message = handleError(err, pair)
					return reject(message)
				});
			}).catch(err => {
				let message = handleError(err, pair)
				return reject(message)
			});
		})
	})
}
export function lockLpBnb(number) {
	let amount = ethers.parseEther(number + '');
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let gasUsed = await earn.lockLp.estimateGas(amount);
			let needBnb = ethers.formatEther(feeData.gasPrice * gasUsed);
			return resolve(needBnb)
		})
	})
}
export function getLPuPrice(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let earn = new ethers.Contract(earnAddress, earnABI, signer);
			let pair = new ethers.Contract(pairAddress, pairABI, signer)

			let price = await cyc.price();
			let quota = ethers.parseEther(number + "");
			let needU = quota / BigInt(8);
			let cusd = ethers.parseEther((needU / price) + '')
			let r = await pair.getReserves();
			let totalSupply = await pair.totalSupply();
			let amount;
			if (usdtAddress < cycAddress) {
				amount = needU * totalSupply / r[0];
			} else {
				amount = needU * totalSupply / r[1];
			}
			let result = {
				cusd: ethers.formatEther(cusd) * 1 / 3,
				usdt: ethers.formatEther(needU) * 1,
				lp: ethers.formatEther(amount) * 1
			}
			return resolve(result)
		})
	})
}
export function lockLp(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			// let amount = ethers.parseEther(number + '');
			let quota = ethers.parseEther(number + "");
			let needU = quota / BigInt(8);
			let totalSupply = await pair.totalSupply();
			let r = await pair.getReserves();
			let amount;
			if (usdtAddress < cycAddress) {
				amount = needU * totalSupply / r[0];
			} else {
				amount = needU * totalSupply / r[1];
			}
			earn.lockLp(amount).then(tx => {
				tx.wait().then(txReceipt => {
					if (txReceipt && txReceipt.status == 1) {
						return resolve(txReceipt.hash)
					}
				}).catch(err => {
					let message = handleError(err, earn)
					return reject(message)
				});
			}).catch(err => {
				let message = handleError(err, earn)
				return reject(message)
			});
		})
	})
}
export function withdrawLpBnb(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let gasUsed = await earn.withdrawLp.estimateGas();
			let needBnb = ethers.formatEther(feeData.gasPrice * gasUsed);
			return resolve(needBnb)
		})
	})
}

export function withdrawLp() {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			earn.withdrawLp().then(tx => {
				tx.wait().then(txReceipt => {
					if (txReceipt && txReceipt.status == 1) {
						return resolve(txReceipt.hash)
					}
				}).catch(err => {
					let message = handleError(err, earn)
					return reject(message)
				});
			}).catch(err => {
				let message = handleError(err, earn)
				return reject(message)
			});
		})
	})
}

export function hasBind() {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let signer = await provider.getSigner();
			let binding = new ethers.Contract(bindingAddress, bindingABI, signer);
			binding.parents(signer.address).then(c => {
				if (c != ethers.ZeroAddress) {
					return resolve(true)
				} else {
					return resolve(false)
				}
			}).catch(err => {
				console.log('errr');
				let message = handleError(err, binding)
				return reject(message)
			});
		})
	})
}
export function bindBnb(address) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let binding = new ethers.Contract(bindingAddress, bindingABI, signer);
			let gasUsed = await binding.bind.estimateGas(root);
			let needBnb = ethers.formatEther(feeData.gasPrice * gasUsed);
			return resolve(needBnb)
		})
	})
}
export function bind(address) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let binding = new ethers.Contract(bindingAddress, bindingABI, signer);
			binding.bind(address).then(tx => {
				tx.wait().then(txReceipt => {
					if (txReceipt && txReceipt.status == 1) {
						return resolve(txReceipt.hash)
					}
				}).catch(err => {
					let message = handleError(err, binding)
					return reject(message)
				});
			}).catch(err => {
				console.log(err);
				let message = handleError(err, binding)
				return reject(message)
			});
		})
	})
}

export function home() {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			let signer = await provider.getSigner();
			let earn = new ethers.Contract(earnAddress, earnABI, signer);
			// let [pools, actualIssues] = await earn.poolsInfo();
			let [pools, actualIssues, poolIds] = await earn.poolsInfo();
			let list = []
			for (let i = 0; i < pools.length; ++i) {
				var today = new Date(Number(pools[i].startTime) *
					1000); // 参数需要毫秒数，所以这里将秒数乘于 1000
				//日期
				var DD = String(today.getDate()).padStart(2, '0'); // 获取日
				var MM = String(today.getMonth() + 1).padStart(2, '0'); //获取月份，1 月为 0
				var yyyy = today.getFullYear(); // 获取年

				// 时间
				let hh = String(today.getHours()).padStart(2, '0'); //获取当前小时数(0-23)
				let mm = String(today.getMinutes()).padStart(2, '0'); //获取当前分钟数(0-59)
				let ss = String(today.getSeconds()).padStart(2, '0'); //获取当前秒数(0-59)
				today = yyyy + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss;
				// console.log('startTime', today);
				// console.log(pools[i].stop);
				if (Number(actualIssues[i]) > 0 || pools[i].stop) {
					let pid = Number(pools[i].pid);
					let obj = {
						// poolIds: poolIds[i],
						name: String.fromCharCode(pid + 'A'.charCodeAt()),
						poolId: Number(poolIds[i]),
						idx: Number(pools[i].idx),
						pid: pid,
						issues: Number(actualIssues[i]),
						round: Math.ceil(Number(actualIssues[i]) / ISSUE_PERIOD),
						actualIssues: Number(actualIssues[i]) % ISSUE_PERIOD > 0 ? Number(
								actualIssues[i]) %
							ISSUE_PERIOD : ISSUE_PERIOD,
						currIssue: Number(pools[i].currIssue) % ISSUE_PERIOD > 0 ? Number(
							pools[
								i]
							.currIssue) % ISSUE_PERIOD : ISSUE_PERIOD,
						// actualIssues: Number(pools[i].currIssue) % ISSUE_PERIOD > 0 ? Number(pools[i]
						// 	.currIssue) % ISSUE_PERIOD : ISSUE_PERIOD,
						// currIssue: Number(actualIssues[i]) % ISSUE_PERIOD > 0 ? Number(actualIssues[i]) %
						// 	ISSUE_PERIOD : ISSUE_PERIOD,
						stop: pools[i].stop,
						isNextOne: false,
						isNextTwo: false,
						next: 0,
						currData: {
							currCap: ethers.formatEther(pools[i].currCap),
							currIssueAmount: ethers.formatEther(pools[i].currIssueAmount),
							remian: ethers.formatEther(pools[i].currCap) - ethers
								.formatEther(
									pools[i]
									.currIssueAmount)
							// totalAmount: ethers.formatEther(pools[i].totalAmount)
						}
					}
					if (!pools[i].stop) {

						if (Number(pools[i].currIssue) == Number(actualIssues[i]) + 2) {
							// obj.actualIssues=Number(actualIssues[i])
							obj.isNextOne = false
							obj.isNextTwo = true
							let issueAmount1 = await earn.amountByIssue(poolIds[i], Number(
								actualIssues[i]));
							let issueAmount2 = await earn.amountByIssue(poolIds[i], Number(
									actualIssues[i]) +
								1);
							let next = Number(pools[i].startTime) + Number(actualIssues[i]) *
								ISSUE_SECONDS;
							obj.next = next
							obj.currData = {
								currCap: ethers.formatEther(issueAmount1),
								currIssueAmount: ethers.formatEther(issueAmount1),
								remian: 0
							}
							obj.actualData = {
								currCap: ethers.formatEther(issueAmount2),
								currIssueAmount: ethers.formatEther(issueAmount2),
								remain: 0
							}
						} else if (Number(pools[i].currIssue) == Number(actualIssues[i]) + 1) {
							// obj.actualIssues=Number(actualIssues[i])
							obj.isNextOne = true
							obj.isNextTwo = false
							let lastIssueAmount = await earn.amountByIssue(poolIds[i], Number(
								actualIssues[i]));
							let next = Number(pools[i].startTime) + Number(actualIssues[i]) *
								ISSUE_SECONDS;
							obj.next = next
							obj.currData = {
								currCap: ethers.formatEther(lastIssueAmount),
								currIssueAmount: ethers.formatEther(lastIssueAmount),
								remain: 0
							}
							obj.actualData = {
								currCap: ethers.formatEther(pools[i].currCap),
								currIssueAmount: ethers.formatEther(pools[i]
									.currIssueAmount),
								remain: ethers.formatEther(pools[i].currCap - pools[i]
									.currIssueAmount)
							}
						} else if (Number(pools[i].currIssue) == Number(actualIssues[i])) {
							obj.isNextOne = false
							obj.isNextTwo = false
							let next = Number(pools[i].startTime) + Number(actualIssues[i]) *
								ISSUE_SECONDS;
							obj.next = next
							obj.currData = {
								currCap: ethers.formatEther(pools[i].currCap),
								currIssueAmount: ethers.formatEther(pools[i]
									.currIssueAmount),
								remain: ethers.formatEther(pools[i].currCap - pools[i]
									.currIssueAmount),
							}
						}
					}
					list.push(obj)
				} else {
					console.log(
						`${String.fromCharCode(pid+'A'.charCodeAt())}${pools[i].idx}仓-未开始`);
				}
			}
			// console.log(list);
			return resolve(list)
		})
	})
}

export function earnBalance() {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			let usdtBalance = await usdt.balanceOf(signer.address);
			let b = await earn.accountBalance(signer.address);
			// let b = await earn.accountBalance('0x9c563d4c180BD47be73F01de285a5A480f99C3F9');
			let tokenBalance = await cyc.balanceOf(signer.address);
			let price = await cyc.price();
			let len = await earn.stopPointsLength(signer.address);
			let a = BigInt(0);
			for (let i = 0; i < Number(len); ++i) {
				let sp = await earn.claimableStopPointsPerAccount(signer.address, i);
				a += sp.totalAmount;
			}

			let result = {
				usdtBalance: ethers.formatEther(usdtBalance),
				cycBalance: ethers.formatEther(tokenBalance),
				poolBalance: ethers.formatEther(b.balance),
				poolPoints: ethers.formatEther(b.points),
				poolLimit: ethers.formatEther(b.quota),
				stakingAmount: ethers.formatEther(b.stakingAmount),
				// claimableAmount: ethers.formatEther(b.claimableAmount),
				stopPoints: ethers.formatEther(b.stopPoints),
				claimableStopPoints: ethers.formatEther(b.claimableStopPoints),
				cycPrice: ethers.formatEther(price),
				compensatePoint: ethers.formatEther(a)
				// compensatePoint: 0
			}
			return resolve(result)
		})
	})
}
export function swapPointsApproveStatus(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let signer = await provider.getSigner();
			let earn = new ethers.Contract(earnAddress, earnABI, signer);
			let cyc = new ethers.Contract(cycAddress, cycABI, signer);
			let amount = ethers.parseEther(number + '');
			cyc.allowance(signer.address, earnAddress).then(allowance => {
				if (allowance < amount) {
					return resolve(false)
				}
				return resolve(true)
			}).catch(err => {
				let message = handleError(err, cyc)
				return reject(message)
			})
		})
	})
}
export function swapPointsApproveBnb(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let gasUsed = await cyc.approve.estimateGas(earnAddress, ethers.MaxUint256);
			let needBnb = ethers.formatEther(feeData.gasPrice * gasUsed);
			return resolve(needBnb)
		})
	})
}
export function swapPointsTokenApprove() {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let cyc = new ethers.Contract(cycAddress, cycABI, signer);
			cyc.approve(earnAddress, ethers.MaxUint256).then(tx => {
				tx.wait().then(txReceipt => {
					if (txReceipt && txReceipt.status == 1) {
						return resolve(txReceipt.hash)
					}
				}).catch(err => {
					return reject(err)
				});
			}).catch(err => {
				let message = handleError(err, cyc)
				return reject(message)
			});
		})
	})
}
export function swapPointsBnb(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let signer = await provider.getSigner();
			let earn = new ethers.Contract(earnAddress, earnABI, signer);
			let cyc = new ethers.Contract(cycAddress, cycABI, signer);
			let amount = ethers.parseEther(number + '');
			let feeData = await provider.getFeeData();
			earn.swapTokenToPoints.estimateGas(amount).then(gasUsed => {
				// 	let feeData = await provider.getFeeData();
				let needBnb = ethers.formatEther(feeData.gasPrice * gasUsed);
				return resolve(needBnb)
			}).catch(err => {
				return reject(handleError(err, earn))

			})
		})
	})
}
export function swapPoints(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let amount = ethers.parseEther(number + '');
			earn.swapTokenToPoints(amount).then(tx => {
				tx.wait().then(txReceipt => {
					if (txReceipt && txReceipt.status == 1) {
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
	})
}
export function depositUsdtApproveStatus(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			let amount = ethers.parseEther(number + '');
			usdt.allowance(signer.address, earnAddress).then(allowance => {
				if (allowance < amount) {
					return resolve(false)
				}
				return resolve(true)
			}).catch(err => {
				let message = getWalletError(err)
				return reject(message)
			})
		})
	})
}
export function depositTokenApproveBnb() {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			let gasUsed = await usdt.approve.estimateGas(cycStakingAddress, ethers.MaxUint256);
			let needBnb = ethers.formatEther(feeData.gasPrice * gasUsed);
			return resolve(needBnb)
		})
	})
}
export function depositTokenApprove() {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			usdt.approve(earnAddress, ethers.MaxUint256).then(tx => {
				tx.wait().then(txReceipt => {
					if (txReceipt && txReceipt.status == 1) {
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
	})
}
export function depositUsdtBnb(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			let amount = ethers.parseEther(number + '');
			let gasUsed = await earn.depositUsdt.estimateGas(amount);
			let needBnb = ethers.formatEther(feeData.gasPrice * gasUsed);
			return resolve(needBnb)
		})
	})
}
export function depositUsdt(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			let earn = new ethers.Contract(earnAddress, earnABI, signer);
			let usdt = new ethers.Contract(usdtAddress, usdtABI, signer);
			let amount = ethers.parseEther(number + '');
			earn.depositUsdt(amount).then(tx => {
				tx.wait().then(txReceipt => {
					if (txReceipt && txReceipt.status == 1) {
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
	})
}
export function buyBnb(number, poolId) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			let amount = ethers.parseEther(number + '');
			let earn = new ethers.Contract(earnAddress, earnABI, signer);
			let feeData = await provider.getFeeData();
			earn.buy.estimateGas(poolId, amount).then(gasUsed => {

				let needBnb = ethers.formatEther(feeData.gasPrice * gasUsed);
				return resolve(needBnb)
			}).catch(err => {
				let message = handleError(err, earn)
				return reject(message)
			});
		})
	})
}

export function buy_back(number, poolId) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			let amount = ethers.parseEther(number + '');
			let signer = await provider.getSigner();
			let earn = new ethers.Contract(earnAddress, earnABI, signer);
			earn.buy(poolId, amount).then(tx => {
				tx.wait().then(txReceipt => {
					if (txReceipt && txReceipt.status == 1) {
						return resolve(txReceipt.hash)
					}
				}).catch(err => {
					let message = getWalletError(err)
					return reject(message)
				});
			}).catch(err => {
				let message = handleError(err, earn)
				return reject(message)
			});
		})
	})
}
export function buy(number, poolId) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			let amount = ethers.parseEther(number + '');
			earn.buy(poolId, amount).then(tx => {
				tx.wait().then(txReceipt => {
					if (txReceipt && txReceipt.status == 1) {
						return resolve(txReceipt.hash)
					}
				}).catch(err => {
					let message = getWalletError(err)
					return reject(message)
				});
			}).catch(err => {
				let message = handleError(err, earn)
				return reject(message)
			});
		})
	})
}
export function earnWithdrawBnbValue(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			let amount = ethers.parseEther(number + '');
			let usdtBnb = await earn.getChainlinkDataFeedLatestAnswer();
			let bnbValue = amount * BigInt(3) / BigInt(100) * usdtBnb / ethers.parseEther(
				"1");
			return resolve(ethers.formatEther(bnbValue) * 1)
		})
	})
}
export function earnWithdrawBnb(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			let amount = ethers.parseEther(number + '');
			console.log('amount', amount);
			let usdtBnb = await earn.getChainlinkDataFeedLatestAnswer();
			let bnbValue = amount * BigInt(3) / BigInt(100) * usdtBnb / ethers.parseEther(
				"1");
			let feeData = await provider.getFeeData();
			console.log('feeData');
			let gasUsed = await earn.withdraw.estimateGas(amount, {
				value: bnbValue
			});
			console.log('gasUsed');
			let needBnb = ethers.formatEther(feeData.gasPrice * gasUsed);
			return resolve(needBnb)
		})
	})
}
export function earnWithdraw(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			let amount = ethers.parseEther(number + '');
			let usdtBnb = await earn.getChainlinkDataFeedLatestAnswer();
			let bnbValue = amount * BigInt(3) / BigInt(100) * usdtBnb / ethers.parseEther("1");
			earn.withdraw(amount, {
				value: bnbValue
			}).then(tx => {
				tx.wait().then(txReceipt => {
					if (txReceipt && txReceipt.status == 1) {
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
	})
}
export function earnClaimTokenBnb(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let amount = ethers.parseEther(number + '');
			let gasUsed = await earn.claimToken.estimateGas();
			let needBnb = ethers.formatEther(feeData.gasPrice * gasUsed);
			return resolve(needBnb)
		})
	})
}
export function earnClaimToken() {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			earn.claimToken().then(tx => {
				tx.wait().then(txReceipt => {
					if (txReceipt && txReceipt.status == 1) {
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
	})
}
export function sign(message) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			signer.signMessage(message).then(res => {
				return resolve(res)
			}).catch(err => {
				let message = handleError(err, signer)
				return reject(message)
			})
		})
	})
}

export function earnClaimStopPointsBnb() {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			let gasUsed = await earn.claimStopPoints.estimateGas();
			let needBnb = ethers.formatEther(feeData.gasPrice * gasUsed);
			return resolve(needBnb)
		})
	})
}
export function earnClaimStopPoints() {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			earn.claimStopPoints().then(tx => {
				tx.wait().then(txReceipt => {
					if (txReceipt && txReceipt.status == 1) {
						return resolve(txReceipt.hash)
					}
				}).catch(err => {
					return reject(err)
				});
			}).catch(err => {
				let message = handleError(err, err)
				return reject(message)
			});
		})
	})
}
export function earnSwapStopPointsBnb(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let earn = new ethers.Contract(earnAddress, earnABI, signer);
			let amount = ethers.parseEther(number + '');
			earn.swapStopPointsToToken.estimateGas(amount).then(gasUsed => {
				let needBnb = ethers.formatEther(feeData.gasPrice * gasUsed);
				return resolve(needBnb)
			}).catch(err => {
				let message = handleError(err, earn)
				return reject(message)
			});
		})
	})
}
export function earnSwapStopPoints(number) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {

			let amount = ethers.parseEther(number + '');
			earn.swapStopPointsToToken(amount).then(tx => {
				tx.wait().then(txReceipt => {
					if (txReceipt && txReceipt.status == 1) {
						return resolve(txReceipt.hash)
					}
				}).catch(err => {
					return reject(err)
				});
			}).catch(err => {
				let message = handleError(err, earn)
				return reject(message)
			});
		})
	})
}
export function getBlockNumber(params) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {})
		let bn = await provider.getBlockNumber()
		return resolve(bn)
	})
}
export function treasuryPropose(params) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			let cycNft = new ethers.Contract(cycNftAddress, cycNftABI, signer);
			let tokenAddress = params.coinType == 'USDT' ? usdtAddress : cycAddress;
			let receiver = params.receiver
			let amount = ethers.parseEther(params.amount + '');
			let startBlock = params.startBlock * 1;
			let endBlock = params.endsBlock * 1;
			let quorum = params.quorum * 1;
			cycNft.treasuryPropose(tokenAddress, receiver, amount, startBlock, endBlock,
				quorum).then(tx => {
				tx.wait().then(txReceipt => {
					if (txReceipt && txReceipt.status == 1) {
						let result = {
							...params,
							hash: txReceipt.hash,
							id: Number(txReceipt.logs[0].args[0])
						}
						return resolve(result)
					}
				}).catch(err => {
					let message = handleError(err, cycNft)
					return reject(message)
				});
			}).catch(err => {
				let message = handleError(err, cycNft)
				return reject(message)
			});
		})
	})
}
export function proposalList() {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			let cycNft = new ethers.Contract(cycNftAddress, cycNftABI, signer);
			let proposalLen = Number(await cycNft.treasuryProposalsCount());
			let list = []
			for (let i = 1; i <= proposalLen; ++i) {
				let p = await cycNft.treasuryProposals(i);
				let state = await cycNft.state(i);
				let obj = {
					idx: i,
					address: p.proposer,
					coinType: p.tokenAddress == usdtAddress ? 'USDT' : 'CYC',
					startBlock: Number(p.startBlock),
					endBlock: Number(p.endBlock),
					id: Number(p.id),
					receiver: p.receiver,
					amount: ethers.formatEther(p.amount),
					quorum: Number(p.quorum),
					forVotes: Number(p.forVotes),
					againstVotes: Number(p.againstVotes),
					totalVotes: Number(p.forVotes) + Number(p.againstVotes),
					state: Number(state)
				}
				list.push(obj)
			}
			return resolve(list)
		})
	})
}
export function getPriorVotes(startBlock) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			let cycNft = new ethers.Contract(cycNftAddress, cycNftABI, signer);
			let bn = startBlock
			cycNft.getPriorVotes(signer.address, bn).then(v => {
				return resolve(Number(v))
			}).catch(err => {
				let message = handleError(err, cycNft)
				return reject(message)
			});
		})
	})
}
export function myvote() {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			let cycNft = new ethers.Contract(cycNftAddress, cycNftABI, signer);
			let r = await cycNft.getReceipt(2, signer.address);
		})
	})
}
export function cast(id, support) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			let signer = await provider.getSigner();
			let cycNft = new ethers.Contract(cycNftAddress, cycNftABI, signer);
			// let id = vote_id;
			// let support = support;
			cycNft.castVote(id, support).then(tx => {
				tx.wait().then(txReceipt => {
					if (txReceipt && txReceipt.status == 1) {
						return resolve(txReceipt.hash)
					}
				}).catch(err => {
					let message = handleError(err, cycNft)
					return reject(message)
				});
			}).catch(err => {
				let message = handleError(err, cycNft)
				return reject(message)
			});
		})
	})
}
export function getExecuteStatus(id) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			cycNft.state(id).then(state => {
				return resolve(Number(state))
			}).catch(err => {
				let message = handleError(err, cycNft)
				return reject(message)
			});
		})
	})
}
export function execute(id) {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			cycNft.execute(id).then(tx => {
				console.log(tx);
				tx.wait().then(txReceipt => {
					if (txReceipt && txReceipt.status == 1) {
						return resolve(txReceipt.hash)
					}
				}).catch(err => {
					let message = handleError(err, cycNft)
					return reject(message)
				});
			}).catch(err => {
				let message = handleError(err, cycNft)
				return reject(message)
			});
		})
	})
}
export function getFundDate() {
	return new Promise(async (resolve, reject) => {
		connect().then(async () => {
			let usdtBalance = await usdt.balanceOf(cycNftAddress)
			let balance = await cyc.balanceOf(cycNftAddress)
			return resolve({
				usdtBalance: ethers.formatEther(usdtBalance),
				balance: ethers.formatEther(balance)
			})
		})
	})
}