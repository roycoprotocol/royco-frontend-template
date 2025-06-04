import { cn } from "@/lib/utils";
import { MarketBuilder } from "./_components";
import "./local.css";
import { Protector } from "../_components/common/protector";

const Page = () => {
  const Content = () => {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center bg-[#FBFBF8]",
          "px-5 py-5 xl:px-[12.44rem] xl:py-10"

          // "px-5 py-5 md:px-12 md:py-10 lg:px-[10.44rem] xl:px-[12.44rem]"
        )}
      >
        {/* <div className="flex aspect-[1920/900] w-full max-w-screen-2xl flex-col gap-5 overflow-hidden rounded-2xl border border-divider"> */}
        <MarketBuilder />
        {/* </div> */}
      </div>
    );
  };

  const frontendTag = process.env.NEXT_PUBLIC_FRONTEND_TAG ?? "default";

  if (frontendTag === "internal" || frontendTag === "testnet") {
    return <Protector children={<Content />} />;
  } else {
    return <Content />;
  }
};

export default Page;
