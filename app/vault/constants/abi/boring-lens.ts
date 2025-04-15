export const BoringLensABI = [
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      {
        internalType: "contract BoringVault",
        name: "boringVault",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "shares", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      {
        internalType: "contract BoringVault",
        name: "boringVault",
        type: "address",
      },
      {
        internalType: "contract AccountantWithRateProviders",
        name: "accountant",
        type: "address",
      },
    ],
    name: "balanceOfInAssets",
    outputs: [{ internalType: "uint256", name: "assets", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "contract ERC20", name: "depositAsset", type: "address" },
      { internalType: "uint256", name: "depositAmount", type: "uint256" },
      {
        internalType: "contract BoringVault",
        name: "boringVault",
        type: "address",
      },
      {
        internalType: "contract TellerWithMultiAssetSupport",
        name: "teller",
        type: "address",
      },
    ],
    name: "checkUserDeposit",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "contract ERC20", name: "depositAsset", type: "address" },
      { internalType: "uint256", name: "depositAmount", type: "uint256" },
      {
        internalType: "contract TellerWithMultiAssetSupport",
        name: "teller",
        type: "address",
      },
    ],
    name: "checkUserDepositWithPermit",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract AccountantWithRateProviders",
        name: "accountant",
        type: "address",
      },
    ],
    name: "exchangeRate",
    outputs: [{ internalType: "uint256", name: "rate", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "contract ERC20", name: "asset", type: "address" },
      { internalType: "address", name: "account", type: "address" },
      {
        internalType: "contract DelayedWithdraw",
        name: "delayedWithdraw",
        type: "address",
      },
    ],
    name: "getWithdrawAssetAndWithdrawRequest",
    outputs: [
      {
        components: [
          { internalType: "bool", name: "allowWithdraws", type: "bool" },
          { internalType: "uint32", name: "withdrawDelay", type: "uint32" },
          { internalType: "uint32", name: "completionWindow", type: "uint32" },
          {
            internalType: "uint128",
            name: "outstandingShares",
            type: "uint128",
          },
          { internalType: "uint16", name: "withdrawFee", type: "uint16" },
          { internalType: "uint16", name: "maxLoss", type: "uint16" },
        ],
        internalType: "struct DelayedWithdraw.WithdrawAsset",
        name: "withdrawAsset",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "bool",
            name: "allowThirdPartyToComplete",
            type: "bool",
          },
          { internalType: "uint16", name: "maxLoss", type: "uint16" },
          { internalType: "uint40", name: "maturity", type: "uint40" },
          { internalType: "uint96", name: "shares", type: "uint96" },
          {
            internalType: "uint96",
            name: "exchangeRateAtTimeOfRequest",
            type: "uint96",
          },
        ],
        internalType: "struct DelayedWithdraw.WithdrawRequest",
        name: "req",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "contract ERC20[]", name: "assets", type: "address[]" },
      { internalType: "address[]", name: "accounts", type: "address[]" },
      {
        internalType: "contract DelayedWithdraw",
        name: "delayedWithdraw",
        type: "address",
      },
    ],
    name: "getWithdrawAssetAndWithdrawRequests",
    outputs: [
      {
        components: [
          { internalType: "bool", name: "allowWithdraws", type: "bool" },
          { internalType: "uint32", name: "withdrawDelay", type: "uint32" },
          { internalType: "uint32", name: "completionWindow", type: "uint32" },
          {
            internalType: "uint128",
            name: "outstandingShares",
            type: "uint128",
          },
          { internalType: "uint16", name: "withdrawFee", type: "uint16" },
          { internalType: "uint16", name: "maxLoss", type: "uint16" },
        ],
        internalType: "struct DelayedWithdraw.WithdrawAsset[]",
        name: "withdrawAssets",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "bool",
            name: "allowThirdPartyToComplete",
            type: "bool",
          },
          { internalType: "uint16", name: "maxLoss", type: "uint16" },
          { internalType: "uint40", name: "maturity", type: "uint40" },
          { internalType: "uint96", name: "shares", type: "uint96" },
          {
            internalType: "uint96",
            name: "exchangeRateAtTimeOfRequest",
            type: "uint96",
          },
        ],
        internalType: "struct DelayedWithdraw.WithdrawRequest[]",
        name: "reqs",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract TellerWithMultiAssetSupport",
        name: "teller",
        type: "address",
      },
    ],
    name: "isTellerPaused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "contract ERC20", name: "depositAsset", type: "address" },
      { internalType: "uint256", name: "depositAmount", type: "uint256" },
      {
        internalType: "contract BoringVault",
        name: "boringVault",
        type: "address",
      },
      {
        internalType: "contract AccountantWithRateProviders",
        name: "accountant",
        type: "address",
      },
    ],
    name: "previewDeposit",
    outputs: [{ internalType: "uint256", name: "shares", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "contract ERC20", name: "asset", type: "address" },
      { internalType: "address", name: "account", type: "address" },
      {
        internalType: "contract BoringVault",
        name: "boringVault",
        type: "address",
      },
      {
        internalType: "contract AccountantWithRateProviders",
        name: "accountant",
        type: "address",
      },
      {
        internalType: "contract DelayedWithdraw",
        name: "delayedWithdraw",
        type: "address",
      },
    ],
    name: "previewWithdraw",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "assetsOut", type: "uint256" },
          { internalType: "bool", name: "withdrawsNotAllowed", type: "bool" },
          { internalType: "bool", name: "withdrawNotMatured", type: "bool" },
          { internalType: "bool", name: "noShares", type: "bool" },
          { internalType: "bool", name: "maxLossExceeded", type: "bool" },
          {
            internalType: "bool",
            name: "notEnoughAssetsForWithdraw",
            type: "bool",
          },
        ],
        internalType: "struct ArcticArchitectureLens.PreviewWithdrawResult",
        name: "res",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "contract ERC20[]", name: "assets", type: "address[]" },
      { internalType: "address[]", name: "accounts", type: "address[]" },
      {
        internalType: "contract BoringVault",
        name: "boringVault",
        type: "address",
      },
      {
        internalType: "contract AccountantWithRateProviders",
        name: "accountant",
        type: "address",
      },
      {
        internalType: "contract DelayedWithdraw",
        name: "delayedWithdraw",
        type: "address",
      },
    ],
    name: "previewWithdraws",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "assetsOut", type: "uint256" },
          { internalType: "bool", name: "withdrawsNotAllowed", type: "bool" },
          { internalType: "bool", name: "withdrawNotMatured", type: "bool" },
          { internalType: "bool", name: "noShares", type: "bool" },
          { internalType: "bool", name: "maxLossExceeded", type: "bool" },
          {
            internalType: "bool",
            name: "notEnoughAssetsForWithdraw",
            type: "bool",
          },
        ],
        internalType: "struct ArcticArchitectureLens.PreviewWithdrawResult[]",
        name: "res",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract BoringVault",
        name: "boringVault",
        type: "address",
      },
      {
        internalType: "contract AccountantWithRateProviders",
        name: "accountant",
        type: "address",
      },
    ],
    name: "totalAssets",
    outputs: [
      { internalType: "contract ERC20", name: "asset", type: "address" },
      { internalType: "uint256", name: "assets", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      {
        internalType: "contract TellerWithMultiAssetSupport",
        name: "teller",
        type: "address",
      },
    ],
    name: "userUnlockTime",
    outputs: [{ internalType: "uint256", name: "time", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];
