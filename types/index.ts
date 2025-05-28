import { EnrichedTxOption } from "royco/transaction";

export type ModalTxOption = EnrichedTxOption & {
  txHash?: string;
  data?: any;
};
