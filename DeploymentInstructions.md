# Royco Deployment Instructions

All contracts should be deployed by interacting directly with the Deterministic Deployment Proxy at 0x4e59b44847b379578588920ca78fbf26c0b4956c. Deployment should use a consistent salt (zeroes) so that deployment addresses can be recalculated to ensure the bytecode was not altered.

## Deployment Contracts and Parameters
### PointsFactory:
`address _owner` - 0x85De42e5697D16b853eA24259C42290DaCe35190

### WrappedVaultFactory:
`address _protoocolFeeRecipient` - 0x85De42e5697D16b853eA24259C42290DaCe35190

`uint256 _protocolFee` - 0%

`uint256 _minimumFrontendFee` - .005e18 = .5% minimum fee

`address _pointsFactory` - address of PointsFactory deployment

### WeirollWallet:
None

### RecipeMarketHub:

`address _weirollWalletImplementation` - address of WeirollWallet deployment

`uint256 _protocolFee` - 0%

`uint256 _minimumFrontendFee` - .005e18 = .5% minimum fee

`address _owner` - 0x85De42e5697D16b853eA24259C42290DaCe35190

`address _pointsFactory` - PointsFactory deployment address

### VaultMarketHub:
`address _owner` - 0x85De42e5697D16b853eA24259C42290DaCe35190
