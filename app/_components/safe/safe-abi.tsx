export const RoycoAbi = [
  {
    inputs: [
      { internalType: "address", name: "_owner", type: "address" },
      { internalType: "address", name: "_multiSend", type: "address" },
      { internalType: "address", name: "_safeSingleton", type: "address" },
      { internalType: "address", name: "_roycoMiddleware", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "AmountFilledExceedsQuantity", type: "error" },
  { inputs: [], name: "FailedDeployment", type: "error" },
  { inputs: [], name: "FailedToEnterNode", type: "error" },
  { inputs: [], name: "FailedToExitNode", type: "error" },
  {
    inputs: [
      { internalType: "uint256", name: "balance", type: "uint256" },
      { internalType: "uint256", name: "needed", type: "uint256" },
    ],
    name: "InsufficientBalance",
    type: "error",
  },
  { inputs: [], name: "InvalidInputToken", type: "error" },
  { inputs: [], name: "InvalidNodeHash", type: "error" },
  { inputs: [], name: "InvalidRoycoAccount", type: "error" },
  { inputs: [], name: "InvalidShortString", type: "error" },
  { inputs: [], name: "InvalidSignature", type: "error" },
  { inputs: [], name: "InvalidTaker", type: "error" },
  { inputs: [], name: "MarketAlreadyExists", type: "error" },
  { inputs: [], name: "NodeAlreadyExists", type: "error" },
  { inputs: [], name: "OrderCancelled", type: "error" },
  { inputs: [], name: "OrderExpired", type: "error" },
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
  {
    inputs: [{ internalType: "string", name: "str", type: "string" }],
    name: "StringTooLong",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "orderHash",
        type: "bytes32",
      },
    ],
    name: "CancelledOrder",
    type: "event",
  },
  { anonymous: false, inputs: [], name: "EIP712DomainChanged", type: "event" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "nodeHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "oracle",
        type: "address",
      },
      { indexed: false, internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "MarketCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "nodeHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "inputToken",
        type: "address",
      },
      {
        components: [
          { internalType: "bytes32[]", name: "commands", type: "bytes32[]" },
          { internalType: "bytes[]", name: "state", type: "bytes[]" },
        ],
        indexed: false,
        internalType: "struct Recipe",
        name: "depositRecipe",
        type: "tuple",
      },
      {
        components: [
          { internalType: "bytes32[]", name: "commands", type: "bytes32[]" },
          { internalType: "bytes[]", name: "state", type: "bytes[]" },
        ],
        indexed: false,
        internalType: "struct Recipe",
        name: "liquidityQuery",
        type: "tuple",
      },
      {
        components: [
          { internalType: "bytes32[]", name: "commands", type: "bytes32[]" },
          { internalType: "bytes[]", name: "state", type: "bytes[]" },
        ],
        indexed: false,
        internalType: "struct Recipe",
        name: "withdrawalRecipe",
        type: "tuple",
      },
      {
        indexed: true,
        internalType: "address",
        name: "outputToken",
        type: "address",
      },
    ],
    name: "NodeInserted",
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
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint96",
        name: "accountId",
        type: "uint96",
      },
      {
        indexed: false,
        internalType: "address",
        name: "roycoAccount",
        type: "address",
      },
    ],
    name: "RoycoAccountDeployed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newRoycoGuard",
        type: "address",
      },
    ],
    name: "RoycoGuardSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newRoycoExecutor",
        type: "address",
      },
    ],
    name: "RoycoMiddlewareSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newSafeSingleton",
        type: "address",
      },
    ],
    name: "SafeSingletonSet",
    type: "event",
  },
  {
    inputs: [],
    name: "ABSOLUTE_LIQUIDITY_ORDER_TYPEHASH",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "CANCEL_ORDER_TYPEHASH",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "CONDITION_TYPEHASH",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MULTISEND",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "OPERAND_TYPEHASH",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
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
        components: [
          { internalType: "address", name: "roycoAccount", type: "address" },
          { internalType: "address", name: "taker", type: "address" },
          {
            internalType: "bytes32",
            name: "targetMarketHash",
            type: "bytes32",
          },
          {
            internalType: "enum Comparator",
            name: "signalComparator",
            type: "uint8",
          },
          {
            components: [
              { internalType: "address", name: "target", type: "address" },
              { internalType: "bytes", name: "data", type: "bytes" },
            ],
            internalType: "struct Operand",
            name: "rhsSignalOperand",
            type: "tuple",
          },
          { internalType: "bool", name: "checkSignalBeforeFill", type: "bool" },
          {
            internalType: "bytes",
            name: "auxiliaryExecutionParams",
            type: "bytes",
          },
          { internalType: "uint256", name: "quantity", type: "uint256" },
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint40", name: "expiry", type: "uint40" },
          { internalType: "address", name: "allocator", type: "address" },
          { internalType: "bytes", name: "allocatorArgs", type: "bytes" },
          {
            components: [
              {
                components: [
                  { internalType: "address", name: "target", type: "address" },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct Operand",
                name: "lhs",
                type: "tuple",
              },
              { internalType: "enum Comparator", name: "cmp", type: "uint8" },
              {
                components: [
                  { internalType: "address", name: "target", type: "address" },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct Operand",
                name: "rhs",
                type: "tuple",
              },
            ],
            internalType: "struct Condition[]",
            name: "preChecks",
            type: "tuple[]",
          },
          {
            components: [
              {
                components: [
                  { internalType: "address", name: "target", type: "address" },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct Operand",
                name: "lhs",
                type: "tuple",
              },
              { internalType: "enum Comparator", name: "cmp", type: "uint8" },
              {
                components: [
                  { internalType: "address", name: "target", type: "address" },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct Operand",
                name: "rhs",
                type: "tuple",
              },
            ],
            internalType: "struct Condition[]",
            name: "postChecks",
            type: "tuple[]",
          },
          { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        internalType: "struct AbsoluteLiquidityOrder",
        name: "_order",
        type: "tuple",
      },
      { internalType: "bytes", name: "_cancellationSignature", type: "bytes" },
    ],
    name: "cancelOrder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_nodeHash", type: "bytes32" },
      {
        components: [
          { internalType: "address", name: "target", type: "address" },
          { internalType: "bytes", name: "data", type: "bytes" },
        ],
        internalType: "struct Operand",
        name: "_marketSignal",
        type: "tuple",
      },
    ],
    name: "createMarket",
    outputs: [{ internalType: "bytes32", name: "marketHash", type: "bytes32" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "_owners", type: "address[]" },
      { internalType: "uint256", name: "_threshold", type: "uint256" },
    ],
    name: "deployRoycoAccount",
    outputs: [
      { internalType: "uint96", name: "accountId", type: "uint96" },
      { internalType: "address", name: "roycoAccount", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_sourceNodeHash", type: "bytes32" },
      { internalType: "bytes32", name: "_targetNodeHash", type: "bytes32" },
    ],
    name: "edgeExists",
    outputs: [{ internalType: "bool", name: "exists", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      { internalType: "bytes1", name: "fields", type: "bytes1" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "version", type: "string" },
      { internalType: "uint256", name: "chainId", type: "uint256" },
      { internalType: "address", name: "verifyingContract", type: "address" },
      { internalType: "bytes32", name: "salt", type: "bytes32" },
      { internalType: "uint256[]", name: "extensions", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "roycoAccount", type: "address" },
          { internalType: "address", name: "taker", type: "address" },
          {
            internalType: "bytes32",
            name: "targetMarketHash",
            type: "bytes32",
          },
          {
            internalType: "enum Comparator",
            name: "signalComparator",
            type: "uint8",
          },
          {
            components: [
              { internalType: "address", name: "target", type: "address" },
              { internalType: "bytes", name: "data", type: "bytes" },
            ],
            internalType: "struct Operand",
            name: "rhsSignalOperand",
            type: "tuple",
          },
          { internalType: "bool", name: "checkSignalBeforeFill", type: "bool" },
          {
            internalType: "bytes",
            name: "auxiliaryExecutionParams",
            type: "bytes",
          },
          { internalType: "uint256", name: "quantity", type: "uint256" },
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint40", name: "expiry", type: "uint40" },
          { internalType: "address", name: "allocator", type: "address" },
          { internalType: "bytes", name: "allocatorArgs", type: "bytes" },
          {
            components: [
              {
                components: [
                  { internalType: "address", name: "target", type: "address" },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct Operand",
                name: "lhs",
                type: "tuple",
              },
              { internalType: "enum Comparator", name: "cmp", type: "uint8" },
              {
                components: [
                  { internalType: "address", name: "target", type: "address" },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct Operand",
                name: "rhs",
                type: "tuple",
              },
            ],
            internalType: "struct Condition[]",
            name: "preChecks",
            type: "tuple[]",
          },
          {
            components: [
              {
                components: [
                  { internalType: "address", name: "target", type: "address" },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct Operand",
                name: "lhs",
                type: "tuple",
              },
              { internalType: "enum Comparator", name: "cmp", type: "uint8" },
              {
                components: [
                  { internalType: "address", name: "target", type: "address" },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct Operand",
                name: "rhs",
                type: "tuple",
              },
            ],
            internalType: "struct Condition[]",
            name: "postChecks",
            type: "tuple[]",
          },
          { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        internalType: "struct AbsoluteLiquidityOrder",
        name: "_order",
        type: "tuple",
      },
      { internalType: "uint256", name: "_fillAmount", type: "uint256" },
    ],
    name: "fillOrder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32[]", name: "nodeHashes", type: "bytes32[]" },
    ],
    name: "getLiquidityQueries",
    outputs: [
      {
        components: [
          { internalType: "bytes32[]", name: "commands", type: "bytes32[]" },
          { internalType: "bytes[]", name: "state", type: "bytes[]" },
        ],
        internalType: "struct Recipe[]",
        name: "liquidityQueries",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "nodeHash", type: "bytes32" }],
    name: "getLiquidityQuery",
    outputs: [
      {
        components: [
          { internalType: "bytes32[]", name: "commands", type: "bytes32[]" },
          { internalType: "bytes[]", name: "state", type: "bytes[]" },
        ],
        internalType: "struct Recipe",
        name: "liquidityQuery",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "getNextRoycoAccountCounterfactualAddress",
    outputs: [
      { internalType: "uint96", name: "accountId", type: "uint96" },
      { internalType: "address", name: "roycoAccount", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "roycoAccount", type: "address" },
          { internalType: "address", name: "taker", type: "address" },
          {
            internalType: "bytes32",
            name: "targetMarketHash",
            type: "bytes32",
          },
          {
            internalType: "enum Comparator",
            name: "signalComparator",
            type: "uint8",
          },
          {
            components: [
              { internalType: "address", name: "target", type: "address" },
              { internalType: "bytes", name: "data", type: "bytes" },
            ],
            internalType: "struct Operand",
            name: "rhsSignalOperand",
            type: "tuple",
          },
          { internalType: "bool", name: "checkSignalBeforeFill", type: "bool" },
          {
            internalType: "bytes",
            name: "auxiliaryExecutionParams",
            type: "bytes",
          },
          { internalType: "uint256", name: "quantity", type: "uint256" },
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint40", name: "expiry", type: "uint40" },
          { internalType: "address", name: "allocator", type: "address" },
          { internalType: "bytes", name: "allocatorArgs", type: "bytes" },
          {
            components: [
              {
                components: [
                  { internalType: "address", name: "target", type: "address" },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct Operand",
                name: "lhs",
                type: "tuple",
              },
              { internalType: "enum Comparator", name: "cmp", type: "uint8" },
              {
                components: [
                  { internalType: "address", name: "target", type: "address" },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct Operand",
                name: "rhs",
                type: "tuple",
              },
            ],
            internalType: "struct Condition[]",
            name: "preChecks",
            type: "tuple[]",
          },
          {
            components: [
              {
                components: [
                  { internalType: "address", name: "target", type: "address" },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct Operand",
                name: "lhs",
                type: "tuple",
              },
              { internalType: "enum Comparator", name: "cmp", type: "uint8" },
              {
                components: [
                  { internalType: "address", name: "target", type: "address" },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct Operand",
                name: "rhs",
                type: "tuple",
              },
            ],
            internalType: "struct Condition[]",
            name: "postChecks",
            type: "tuple[]",
          },
          { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        internalType: "struct AbsoluteLiquidityOrder",
        name: "_order",
        type: "tuple",
      },
    ],
    name: "hashOrder",
    outputs: [{ internalType: "bytes32", name: "orderHash", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_inputToken", type: "address" },
      {
        components: [
          { internalType: "bytes32[]", name: "commands", type: "bytes32[]" },
          { internalType: "bytes[]", name: "state", type: "bytes[]" },
        ],
        internalType: "struct Recipe",
        name: "_depositRecipe",
        type: "tuple",
      },
      {
        components: [
          { internalType: "bytes32[]", name: "commands", type: "bytes32[]" },
          { internalType: "bytes[]", name: "state", type: "bytes[]" },
        ],
        internalType: "struct Recipe",
        name: "_liquidityQuery",
        type: "tuple",
      },
      {
        components: [
          { internalType: "bytes32[]", name: "commands", type: "bytes32[]" },
          { internalType: "bytes[]", name: "state", type: "bytes[]" },
        ],
        internalType: "struct Recipe",
        name: "_withdrawalRecipe",
        type: "tuple",
      },
      { internalType: "address", name: "_outputToken", type: "address" },
    ],
    name: "insertNode",
    outputs: [{ internalType: "bytes32", name: "nodeHash", type: "bytes32" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "marketHash", type: "bytes32" }],
    name: "marketHashToMarket",
    outputs: [
      { internalType: "bytes32", name: "nodeHash", type: "bytes32" },
      {
        components: [
          { internalType: "address", name: "target", type: "address" },
          { internalType: "bytes", name: "data", type: "bytes" },
        ],
        internalType: "struct Operand",
        name: "marketSignal",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "nodeHash", type: "bytes32" }],
    name: "nodeHashToNode",
    outputs: [
      { internalType: "address", name: "inputToken", type: "address" },
      {
        components: [
          { internalType: "bytes32[]", name: "commands", type: "bytes32[]" },
          { internalType: "bytes[]", name: "state", type: "bytes[]" },
        ],
        internalType: "struct Recipe",
        name: "depositRecipe",
        type: "tuple",
      },
      {
        components: [
          { internalType: "bytes32[]", name: "commands", type: "bytes32[]" },
          { internalType: "bytes[]", name: "state", type: "bytes[]" },
        ],
        internalType: "struct Recipe",
        name: "liquidityQuery",
        type: "tuple",
      },
      {
        components: [
          { internalType: "bytes32[]", name: "commands", type: "bytes32[]" },
          { internalType: "bytes[]", name: "state", type: "bytes[]" },
        ],
        internalType: "struct Recipe",
        name: "withdrawalRecipe",
        type: "tuple",
      },
      { internalType: "address", name: "outputToken", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "orderHash", type: "bytes32" }],
    name: "orderHashToAmountFilled",
    outputs: [
      { internalType: "uint256", name: "amountFilled", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "orderHash", type: "bytes32" }],
    name: "orderHashToIsCancelled",
    outputs: [{ internalType: "bool", name: "cancelled", type: "bool" }],
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
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "roycoMiddleware",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "safeSingleton",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_newRoycoMiddleware", type: "address" },
    ],
    name: "setRoycoMiddleware",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_newSafeSingleton", type: "address" },
    ],
    name: "setSafeSingleton",
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
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "userToNextAccountId",
    outputs: [{ internalType: "uint96", name: "accountId", type: "uint96" }],
    stateMutability: "view",
    type: "function",
  },
];
