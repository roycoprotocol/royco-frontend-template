export const testAbi = [
  {
    type: "function",
    inputs: [
      {
        name: "address_type",
        internalType: "address",
        type: "address",
      },
      {
        name: "int_type",
        internalType: "uint256",
        type: "uint256",
      },
      {
        name: "bool_type",
        internalType: "bool",
        type: "bool",
      },
      {
        name: "string_type",
        internalType: "string",
        type: "string",
      },
      {
        name: "bytes_type",
        internalType: "bytes",
        type: "bytes",
      },
    ],
    name: "base_function",
    outputs: [
      {
        name: "",
        internalType: "uint256",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      {
        name: "address_array_type",
        internalType: "address[]",
        type: "address[]",
      },
      {
        name: "int_array_type",
        internalType: "uint256[]",
        type: "uint256[]",
      },
      {
        name: "bool_array_type",
        internalType: "bool[]",
        type: "bool[]",
      },
      {
        name: "string_array_type",
        internalType: "string[]",
        type: "string[]",
      },
      {
        name: "bytes_array_type",
        internalType: "bytes[]",
        type: "bytes[]",
      },
    ],
    name: "array_function",
    outputs: [],
    stateMutability: "view",
  },
] as const;
