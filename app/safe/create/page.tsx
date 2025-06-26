import { SafeCreator } from "@/app/_components/safe/safe-creator";
import { TransactionModal } from "@/app/_components/transaction-modal/transaction-modal";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-_surface_ p-12">
      <SafeCreator />
      <TransactionModal />
    </div>
  );
}
