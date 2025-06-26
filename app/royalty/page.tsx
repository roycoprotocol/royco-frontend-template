import "./local.css";
import { JoinContainer } from "@/components/join";
import { RoyaltyFormWrapper } from "./royalty-form-wrapper";
import { AnimatePresence } from "framer-motion";

const Page = () => {
  return (
    <div className="relative flex w-full flex-col items-center justify-center p-5">
      {/* <div className="absolute left-0 top-0 z-20 flex h-full w-full flex-col items-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="sticky left-0 top-24 z-30 flex h-96 w-96 flex-col items-center bg-red-500 p-5 backdrop-blur-sm"></div>
      </div> */}

      <AnimatePresence mode="popLayout">
        <RoyaltyFormWrapper />
      </AnimatePresence>

      <JoinContainer className="mt-10" />
    </div>
  );
};

export default Page;
