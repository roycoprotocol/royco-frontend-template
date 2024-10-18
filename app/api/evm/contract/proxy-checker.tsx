/**
 * @description Proxy Checker from `EVM Proxy Detection` by @abipub
 * @see {@link https://github.com/abipub/evm-proxy-detection}
 * @credits {@link https://github.com/abipub}
 */

import type {
  BlockTag,
  GetStorageAtReturnType,
  PublicClient,
  Address,
  GetBytecodeReturnType,
  CallReturnType,
} from "viem";

import { isAddressEqual } from "viem";
import { PROXY_CONSTANTS } from "./proxy-constants";
import { parse1167Bytecode } from "./parse-1167-bytecode";

export enum ProxyType {
  Eip1167 = "EIP 1167",
  Eip1967Direct = "EIP 1967 (Direct)",
  Eip1967Beacon = "EIP 1967 (Beacon)",
  Eip1822 = "EIP 1822",
  Eip897 = "EIP 897",
  OpenZeppelin = "OpenZeppelin",
  Safe = "Safe",
  Comptroller = "Comptroller",
}

export const nullAddress = ("0x" + "0".repeat(40)) as Address;

export const isNullAddress = (address: Address) => {
  return isAddressEqual(address, nullAddress);
};

export const throwOnNullAddress = (
  value: GetStorageAtReturnType | GetBytecodeReturnType | CallReturnType
) => {
  let value_data = null;

  if (typeof value === "string") {
    value_data = value;
  } else if (typeof value === "object") {
    value_data = value.data;
  }

  if (!value_data) {
    throw new Error("Not a proxy");
  }

  const value_string = value_data as string;

  const address =
    value_string.length === 66
      ? (("0x" + value_string.slice(-40)) as Address)
      : (value as Address);

  if (isNullAddress(address)) {
    throw new Error("Not a proxy");
  }

  return address as Address;
};

export type isProxy = {
  client: PublicClient;
  contract_address: Address;
  block_tag?: BlockTag;
};

export type isProxyReturnType = {
  type: ProxyType;
  address: Address;
} | null;

export const isProxy = async ({
  client,
  contract_address,
  block_tag = "latest",
}: isProxy): Promise<isProxyReturnType> => {
  return Promise.any([
    // EIP 1167 Minimal Proxy Pattern
    client
      .getBytecode({ address: contract_address, blockTag: block_tag })
      .then(parse1167Bytecode)
      .then(throwOnNullAddress)
      .then((address) => {
        return {
          type: ProxyType.Eip1167,
          address: address,
        };
      }),

    // EIP 1967 Direct Proxy Pattern
    client
      .getStorageAt({
        address: contract_address,
        slot: PROXY_CONSTANTS.EIP_1967_LOGIC_SLOT as Address,
        blockTag: block_tag,
      })
      .then(throwOnNullAddress)
      .then((address) => {
        return {
          type: ProxyType.Eip1967Direct,
          address: address,
        };
      }),

    // EIP 1967 Beacon Proxy Pattern
    client
      .getStorageAt({
        address: contract_address,
        slot: PROXY_CONSTANTS.EIP_1967_BEACON_SLOT as Address,
        blockTag: block_tag,
      })
      .then(throwOnNullAddress)
      .then((beacon_address) =>
        client
          .call({
            to: beacon_address,
            data: PROXY_CONSTANTS.EIP_1967_BEACON_METHODS[0] as Address,
            blockTag: block_tag,
          })
          .catch(() =>
            client.call({
              to: beacon_address,
              data: PROXY_CONSTANTS.EIP_1967_BEACON_METHODS[1] as Address,
              blockTag: block_tag,
            })
          )
      )
      .then(throwOnNullAddress)
      .then((address) => {
        return {
          type: ProxyType.Eip1967Beacon,
          address: address,
        };
      }),

    // OpenZeppelin Proxy Pattern
    client
      .getStorageAt({
        address: contract_address,
        slot: PROXY_CONSTANTS.OPEN_ZEPPELIN_IMPLEMENTATION_SLOT as Address,
        blockTag: block_tag,
      })
      .then(throwOnNullAddress)
      .then((address) => {
        return {
          type: ProxyType.OpenZeppelin,
          address: address,
        };
      }),

    // EIP 1822 Proxy Pattern
    client
      .getStorageAt({
        address: contract_address,
        slot: PROXY_CONSTANTS.EIP_1822_LOGIC_SLOT as Address,
        blockTag: block_tag,
      })
      .then(throwOnNullAddress)
      .then((address) => {
        return {
          type: ProxyType.Eip1822,
          address: address,
        };
      }),

    // EIP 897 Proxy Pattern
    client
      .call({
        to: contract_address,
        data: PROXY_CONSTANTS.EIP_897_INTERFACE[0] as Address,
        blockTag: block_tag,
      })
      .then(throwOnNullAddress)
      .then((address) => {
        return {
          type: ProxyType.Eip897,
          address: address,
        };
      }),

    // Safe Proxy Pattern
    client
      .call({
        to: contract_address,
        data: PROXY_CONSTANTS.SAFE_PROXY_INTERFACE[0] as Address,
        blockTag: block_tag,
      })
      .then(throwOnNullAddress)
      .then((address) => {
        return {
          type: ProxyType.Safe,
          address: address,
        };
      }),

    // Comptroller Proxy Pattern
    client
      .call({
        to: contract_address,
        data: PROXY_CONSTANTS.COMPTROLLER_PROXY_INTERFACE[0] as Address,
        blockTag: block_tag,
      })
      .then(throwOnNullAddress)
      .then((address) => {
        return {
          type: ProxyType.Comptroller,
          address: address,
        };
      }),
  ]).catch(() => null);
};
