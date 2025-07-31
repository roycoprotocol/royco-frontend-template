import { api } from "@/app/api/royco";
import { atomWithQuery } from "jotai-tanstack-query";
import { MerkleMetadataResponse, MerkleClaimInfoResponse } from "royco/api";
import {
  defaultQueryOptions,
  defaultQueryOptionsFastRefresh,
} from "@/utils/query";
import { atomFamily } from "jotai/utils";
import { lastRefreshTimestampAtom } from "../global";

export const loadableMerkleMetadataFamilyAtom = atomFamily(
  ({ batchId }: { batchId: string }) =>
    atomWithQuery<MerkleMetadataResponse>((get) => ({
      queryKey: [
        "merkle-metadata",
        {
          batchId,
        },
      ],
      queryFn: async () => {
        return api
          .merkleControllerGetMerkleMetadata({
            batchId,
          })
          .then((res) => res.data);
      },
      ...defaultQueryOptions,
    }))
);

export const loadableMerkleClaimFamilyAtom = atomFamily(
  ({ batchId, accountAddress }: { batchId: string; accountAddress: string }) =>
    atomWithQuery<MerkleClaimInfoResponse>((get) => ({
      queryKey: [
        "merkle-claim",
        {
          batchId,
          accountAddress,
          lastRefreshTimestamp: get(lastRefreshTimestampAtom),
        },
      ],
      queryFn: async () => {
        return api
          .merkleControllerGetMerkleClaimInfo({
            batchId,
            accountAddress,
          })
          .then((res) => res.data);
      },
      ...defaultQueryOptionsFastRefresh,
    }))
);
