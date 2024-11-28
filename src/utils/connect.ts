import {
	createWeb3Modal,
	defaultConfig,
	useWeb3Modal,
	useWeb3ModalState,
	useWeb3ModalEvents,
	useWeb3ModalAccount,
	useWeb3ModalProvider,
	useDisconnect
} from '@web3modal/ethers/vue';
const timeout = 180
// console.log(useWeb3ModalProvider);
import {
	ethers
} from 'ethers';
let USDTAddress = '0x9703fa7D52F925387a2E738457936F162218129c';
let USDTAbi = [
	'function name() view returns (string)',
	'function symbol() view returns (string)',
	'function balanceOf(address) view returns (uint)',
	'function transfer(address to, uint amount)',
	'event Transfer(address indexed from, address indexed to, uint amount)'
];
let projectId = 'b5b9bf25c2eb3ffdf92152e71cfa4627';
// let mainnet = {
// 	chainId: 1,
// 	name: 'Ethereum',
// 	currency: 'ETH',
// 	explorerUrl: 'https://etherscan.io',
// 	rpcUrl: 'https://cloudflare-eth.com'
// };
let mainnet = {
	chainId: 56,
	name: 'Smart Chain',
	currency: 'BNB',
	explorerUrl: 'https://bscscan.com',
	rpcUrl: 'https://bsc-dataseed.binance.org/'
};

let metadata = {
	name: 'My Website',
	description: 'My Website description',
	url: 'https://mywebsite.com',
	icons: ['https://avatars.mywebsite.com/']
};
createWeb3Modal({
	ethersConfig: defaultConfig({
		metadata,
		enableInjected: true,
	}),
	chains: [mainnet],
	projectId,
	// enableAnalytics: true
});

export let modal = useWeb3Modal()
export let events = useWeb3ModalEvents()

export let sign = (message) => {
	let provider = new ethers.providers.Web3Provider(window.ethereum, "any");
	let signer = provider.getSigner();
	return signer.signMessage(message);
}
export let checkoutConnect = () => {
	let {
		address,
		chainId,
		isConnected
	} = useWeb3ModalAccount()
	// console.log(address);
	return new Promise((res, rej) => {

		if (isConnected._value) {
			store.commit('setAccount', address._value)
			sessionStorage.address = address._value
			return res(address._value)
		} else {
			store.commit('setAccount', '')
			return rej('')
		}
	})
}
export let connectStatus = () => {
	return useWeb3ModalAccount()
}
export let disconnect = () => {
	let {
		disconnect
	} = useDisconnect()
	sessionStorage.clear()
	store.commit('init')

}
