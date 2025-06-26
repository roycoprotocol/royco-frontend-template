import { HowSafesWork } from "@/app/_components/how-it-works/how-safes-work";
import { SafeModal } from "@/app/_components/safe-modal/safe-modal";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-_surface_ p-5">
      <div className="w-full max-w-2xl border border-_divider_ p-5">
        <HowSafesWork />
      </div>
    </div>
  );
}
