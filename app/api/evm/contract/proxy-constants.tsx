/**
 * @description Proxy constants from `EVM Proxy Detection` by @abipub
 * @see {@link https://github.com/abipub/evm-proxy-detection}
 * @credits {@link https://github.com/abipub}
 */

export const PROXY_CONSTANTS = {
  // bytes32(uint256(keccak256('eip1967.proxy.implementation')) - 1)
  EIP_1967_LOGIC_SLOT:
    "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc",

  // keccak256("org.zeppelinos.proxy.implementation")
  OPEN_ZEPPELIN_IMPLEMENTATION_SLOT:
    "0x7050c9e0f4ca769c69bd3a8ef740bc37934f8e2c036e5a723fd8ee048ed3f8c3",

  // keccak256("PROXIABLE")
  EIP_1822_LOGIC_SLOT:
    "0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7",

  // bytes32(uint256(keccak256('eip1967.proxy.beacon')) - 1)
  EIP_1967_BEACON_SLOT:
    "0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50",

  EIP_897_INTERFACE: [
    // bytes4(keccak256("implementation()")) padded to 32 bytes
    "0x5c60da1b00000000000000000000000000000000000000000000000000000000",

    // bytes4(keccak256("proxyType()")) padded to 32 bytes
    "0x4555d5c900000000000000000000000000000000000000000000000000000000",
  ],

  EIP_1967_BEACON_METHODS: [
    // bytes4(keccak256("implementation()")) padded to 32 bytes
    "0x5c60da1b00000000000000000000000000000000000000000000000000000000",

    // bytes4(keccak256("childImplementation()")) padded to 32 bytes
    // some implementations use this over the standard method name so that the beacon contract is not detected as an EIP-897 proxy itself
    "0xda52571600000000000000000000000000000000000000000000000000000000",
  ],

  SAFE_PROXY_INTERFACE: [
    // bytes4(keccak256("masterCopy()")) padded to 32 bytes
    "0xa619486e00000000000000000000000000000000000000000000000000000000",
  ],

  COMPTROLLER_PROXY_INTERFACE: [
    // bytes4(keccak256("comptrollerImplementation()")) padded to 32 bytes
    "0xbb82aa5e00000000000000000000000000000000000000000000000000000000",
  ],
};
