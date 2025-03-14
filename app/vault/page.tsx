import { ProtectorProvider } from "../_container/protector-provider";
import { MaxWidthProvider } from "../_container/max-width-provider";
import { VaultManager } from "./components/vault-manager";

const Page = () => {
  return (
    <ProtectorProvider>
      <div className="hide-scrollbar bg-background relative">
        {/**
         * Background
         */}
        <div className="absolute left-0 right-0 top-0 z-0 h-80 w-full bg-[#3b5a4a]"></div>

        {/**
         * Vault Manager
         */}
        <MaxWidthProvider className="relative z-10">
          <VaultManager />
        </MaxWidthProvider>
      </div>
    </ProtectorProvider>
  );
};

export default Page;
