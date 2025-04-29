"use client";

import { TextMotion } from "@/components/animations/text-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ContentFlow } from "@/components/animations/content-flow";
import NumberFlow from "@number-flow/react";
import { LoadingCircle } from "@/components/animations/loading-circle";
import { LoadingSpinner } from "@/components/composables";

const Page = () => {
  const [value, setValue] = useState(0);

  const [changed, setChanged] = useState(false);

  const formattedValue = new Intl.NumberFormat("en-US").format(value);

  return (
    <div className="flex w-full flex-col place-content-center items-center gap-10 p-5">
      <Button className="w-40" onClick={() => setChanged(!changed)}>
        {changed ? "Change" : "No Change"}
      </Button>

      <div className="h-96 w-96 bg-white">
        {/* <NumberFlow className="w-60" value={value} /> */}

        <LoadingCircle />

        {/* 
        <ContentFlow className="w-60">
          {changed ? (
            <div className="h-32 w-60 bg-blue-500"></div>
          ) : (
            <div className="h-24 w-60 bg-green-500"></div>
          )}
        </ContentFlow> */}

        {/* <TextMotion>{changed ? "Change" : "Done Change"}</TextMotion> */}
      </div>
    </div>
  );
};

export default Page;
