export const IncentiveLockerABI = [
  {
    inputs: [
      { internalType: "address", name: "_owner", type: "address" },
      {
        internalType: "address",
        name: "_defaultProtocolFeeClaimant",
        type: "address",
      },
      { internalType: "uint64", name: "_defaultProtocolFee", type: "uint64" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "ArrayLengthMismatch", type: "error" },
  {
    inputs: [{ internalType: "address", name: "incentive", type: "address" }],
    name: "CannotOfferZeroIncentives",
    type: "error",
  },
  { inputs: [], name: "CannotProcessDuplicateIncentives", type: "error" },
  {
    inputs: [{ internalType: "address", name: "incentive", type: "address" }],
    name: "CannotRemoveZeroIncentives",
    type: "error",
  },
  { inputs: [], name: "OnlyIP", type: "error" },
  { inputs: [], name: "OnlyPointsProgramOwner", type: "error" },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  { inputs: [], name: "ReentrancyGuardReentrantCall", type: "error" },
  { inputs: [], name: "SpendCapExceeded", type: "error" },
  { inputs: [], name: "TokenDoesNotExist", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "pointsId",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Award",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "incentiveCampaignId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "coIPs",
        type: "address[]",
      },
    ],
    name: "CoIPsAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "incentiveCampaignId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "coIPs",
        type: "address[]",
      },
    ],
    name: "CoIPsRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newDefaultProtocolFeeClaimant",
        type: "address",
      },
    ],
    name: "DefaultProtocolFeeClaimantSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "newDefaultProtocolFee",
        type: "uint64",
      },
    ],
    name: "DefaultProtocolFeeSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "claimant",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "incentive",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "FeesClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "incentiveCampaignId",
        type: "bytes32",
      },
      { indexed: true, internalType: "address", name: "ip", type: "address" },
      {
        indexed: true,
        internalType: "address",
        name: "actionVerifier",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "actionParams",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "defaultProtocolFee",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "incentivesOffered",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "incentiveAmountsOffered",
        type: "uint256[]",
      },
    ],
    name: "IncentiveCampaignCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "incentiveCampaignId",
        type: "bytes32",
      },
      { indexed: true, internalType: "address", name: "ip", type: "address" },
      {
        indexed: false,
        internalType: "address[]",
        name: "incentivesOffered",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "incentiveAmountsOffered",
        type: "uint256[]",
      },
    ],
    name: "IncentivesAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "incentiveCampaignId",
        type: "bytes32",
      },
      { indexed: true, internalType: "address", name: "ap", type: "address" },
      {
        indexed: false,
        internalType: "address[]",
        name: "incentivesClaimed",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "incentiveAmountsPaid",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "protocolFeesPaid",
        type: "uint256[]",
      },
    ],
    name: "IncentivesClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "incentiveCampaignId",
        type: "bytes32",
      },
      { indexed: true, internalType: "address", name: "ip", type: "address" },
      {
        indexed: false,
        internalType: "address[]",
        name: "incentivesRemoved",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "incentiveAmountsRemoved",
        type: "uint256[]",
      },
    ],
    name: "IncentivesRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "pointsId",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      { indexed: true, internalType: "string", name: "symbol", type: "string" },
      {
        indexed: false,
        internalType: "uint8",
        name: "decimals",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "whitelistedIPs",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "spendCaps",
        type: "uint256[]",
      },
    ],
    name: "PointsProgramCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "pointsId",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "PointsProgramOwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "pointsId",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "ip", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PointsSpent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "incentiveCampaignId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newProtocolFeeClaimant",
        type: "address",
      },
    ],
    name: "ProtocolFeeClaimantForCampaignSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "incentiveCampaignId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "newProtocolFee",
        type: "uint64",
      },
    ],
    name: "ProtocolFeeForCampaignSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "pointsId",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "ips",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "spendCaps",
        type: "uint256[]",
      },
    ],
    name: "SpendCapsUpdated",
    type: "event",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_incentiveCampaignId",
        type: "bytes32",
      },
      { internalType: "address[]", name: "_coIPs", type: "address[]" },
    ],
    name: "addCoIPs",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_incentiveCampaignId",
        type: "bytes32",
      },
      {
        internalType: "address[]",
        name: "_incentivesOffered",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_incentiveAmountsOffered",
        type: "uint256[]",
      },
      { internalType: "bytes", name: "_additionParams", type: "bytes" },
    ],
    name: "addIncentives",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_incentiveToken", type: "address" },
      { internalType: "address", name: "_to", type: "address" },
    ],
    name: "claimFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_incentiveCampaignId",
        type: "bytes32",
      },
      { internalType: "address", name: "_ap", type: "address" },
      { internalType: "bytes", name: "_claimParams", type: "bytes" },
    ],
    name: "claimIncentives",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_ap", type: "address" },
      {
        internalType: "bytes32[]",
        name: "_incentiveCampaignIds",
        type: "bytes32[]",
      },
      { internalType: "bytes[]", name: "_claimParams", type: "bytes[]" },
    ],
    name: "claimIncentives",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_actionVerifier", type: "address" },
      { internalType: "bytes", name: "_actionParams", type: "bytes" },
      {
        internalType: "address[]",
        name: "_incentivesOffered",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_incentiveAmountsOffered",
        type: "uint256[]",
      },
    ],
    name: "createIncentiveCampaign",
    outputs: [
      { internalType: "bytes32", name: "incentiveCampaignId", type: "bytes32" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_symbol", type: "string" },
      { internalType: "uint8", name: "_decimals", type: "uint8" },
      { internalType: "address[]", name: "_whitelistedIPs", type: "address[]" },
      { internalType: "uint256[]", name: "_spendCaps", type: "uint256[]" },
    ],
    name: "createPointsProgram",
    outputs: [{ internalType: "address", name: "pointsId", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "defaultProtocolFee",
    outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "defaultProtocolFeeClaimant",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "claimant", type: "address" },
      { internalType: "address", name: "token", type: "address" },
    ],
    name: "feeClaimantToTokenToAmount",
    outputs: [{ internalType: "uint256", name: "amountOwed", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_incentiveCampaignId",
        type: "bytes32",
      },
      { internalType: "address", name: "_incentive", type: "address" },
    ],
    name: "getIncentiveAmountOfferedAndRemaining",
    outputs: [
      { internalType: "bool", name: "exists", type: "bool" },
      { internalType: "address", name: "ip", type: "address" },
      {
        internalType: "uint256",
        name: "incentiveAmountOffered",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "incentiveAmountRemaining",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_incentiveCampaignId",
        type: "bytes32",
      },
      { internalType: "address[]", name: "_incentives", type: "address[]" },
    ],
    name: "getIncentiveAmountsOfferedAndRemaining",
    outputs: [
      { internalType: "bool", name: "exists", type: "bool" },
      { internalType: "address", name: "ip", type: "address" },
      {
        internalType: "uint256[]",
        name: "incentiveAmountsOffered",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "incentiveAmountsRemaining",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_incentiveCampaignId",
        type: "bytes32",
      },
    ],
    name: "getIncentiveCampaignIncentiveInfo",
    outputs: [
      { internalType: "bool", name: "exists", type: "bool" },
      { internalType: "address", name: "ip", type: "address" },
      {
        internalType: "address[]",
        name: "incentivesOffered",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "incentiveAmountsOffered",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "incentiveAmountsRemaining",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_incentiveCampaignId",
        type: "bytes32",
      },
    ],
    name: "getIncentiveCampaignState",
    outputs: [
      { internalType: "bool", name: "exists", type: "bool" },
      { internalType: "address", name: "ip", type: "address" },
      { internalType: "uint64", name: "protocolFee", type: "uint64" },
      { internalType: "address", name: "protocolFeeClaimant", type: "address" },
      { internalType: "address", name: "actionVerifier", type: "address" },
      { internalType: "bytes", name: "actionParams", type: "bytes" },
      {
        internalType: "address[]",
        name: "incentivesOffered",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "incentiveAmountsOffered",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "incentiveAmountsRemaining",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_incentiveCampaignId",
        type: "bytes32",
      },
    ],
    name: "getIncentiveCampaignVerifierAndParams",
    outputs: [
      { internalType: "bool", name: "exists", type: "bool" },
      { internalType: "address", name: "ip", type: "address" },
      { internalType: "address", name: "actionVerifier", type: "address" },
      { internalType: "bytes", name: "actionParams", type: "bytes" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_pointsId", type: "address" },
      { internalType: "address", name: "_ip", type: "address" },
    ],
    name: "getIpSpendCap",
    outputs: [{ internalType: "uint256", name: "spendCap", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_pointsId", type: "address" }],
    name: "getPointsProgramMetadata",
    outputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "symbol", type: "string" },
      { internalType: "uint8", name: "decimals", type: "uint8" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_incentiveCampaignId",
        type: "bytes32",
      },
    ],
    name: "incentiveCampaignExists",
    outputs: [
      { internalType: "bool", name: "exists", type: "bool" },
      { internalType: "address", name: "ip", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "id", type: "bytes32" }],
    name: "incentiveCampaignIdToICS",
    outputs: [
      { internalType: "address", name: "ip", type: "address" },
      { internalType: "address", name: "protocolFeeClaimant", type: "address" },
      { internalType: "uint64", name: "protocolFee", type: "uint64" },
      { internalType: "address", name: "actionVerifier", type: "address" },
      { internalType: "bytes", name: "actionParams", type: "bytes" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_incentiveCampaignId",
        type: "bytes32",
      },
      { internalType: "address", name: "_coIP", type: "address" },
    ],
    name: "isCoIP",
    outputs: [{ internalType: "bool", name: "whitelisted", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_pointsId", type: "address" }],
    name: "isPointsProgram",
    outputs: [{ internalType: "bool", name: "exists", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_incentiveCampaignId",
        type: "bytes32",
      },
      {
        internalType: "address[]",
        name: "_incentivesToRemove",
        type: "address[]",
      },
      { internalType: "bytes", name: "_removalParams", type: "bytes" },
      { internalType: "address", name: "_recipient", type: "address" },
    ],
    name: "maxRemoveIncentives",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "numIncentiveCampaignIds",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "numPointsPrograms",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pendingOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "pointsId", type: "address" }],
    name: "pointsIdToProgram",
    outputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "symbol", type: "string" },
      { internalType: "uint8", name: "decimals", type: "uint8" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_incentiveCampaignId",
        type: "bytes32",
      },
      { internalType: "address[]", name: "_coIPs", type: "address[]" },
    ],
    name: "removeCoIPs",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_incentiveCampaignId",
        type: "bytes32",
      },
      {
        internalType: "address[]",
        name: "_incentivesToRemove",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_incentiveAmountsToRemove",
        type: "uint256[]",
      },
      { internalType: "bytes", name: "_removalParams", type: "bytes" },
      { internalType: "address", name: "_recipient", type: "address" },
    ],
    name: "removeIncentives",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint64", name: "_defaultProtocolFee", type: "uint64" },
    ],
    name: "setDefaultProtocolFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_defaultProtocolFeeClaimant",
        type: "address",
      },
    ],
    name: "setDefaultProtocolFeeClaimant",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_incentiveCampaignId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_protocolFeeClaimant",
        type: "address",
      },
    ],
    name: "setProtocolFeeClaimantForCampaign",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_incentiveCampaignId",
        type: "bytes32",
      },
      { internalType: "uint64", name: "_protocolFee", type: "uint64" },
    ],
    name: "setProtocolFeeForCampaign",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_pointsId", type: "address" },
      { internalType: "address", name: "_newOwner", type: "address" },
    ],
    name: "transferPointsProgramOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_pointsId", type: "address" },
      { internalType: "address[]", name: "_ips", type: "address[]" },
      { internalType: "uint256[]", name: "_spendCaps", type: "uint256[]" },
    ],
    name: "updateSpendCaps",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
