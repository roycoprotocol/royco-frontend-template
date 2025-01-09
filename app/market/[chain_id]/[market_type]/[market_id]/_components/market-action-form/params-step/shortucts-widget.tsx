import React from "react";
import EnsoWidget from "@ensofinance/shortcuts-widget";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function ShortcutsWidget({
  token,
  chainId,
}: {
  token: string;
  chainId?: number;
}) {
  const [zapInEnabled, setZapInEnabled] = React.useState(false);

  return (
    <div style={{ margin: "10px 0" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          justifyContent: "flex-end",
        }}
      >
        <label className={"font-gt font-500"} htmlFor={"zap-in"}>
          Get input token
        </label>
        <Switch
          id={"zap-in"}
          checked={zapInEnabled}
          onCheckedChange={setZapInEnabled}
        />
      </div>
      {zapInEnabled && (
        <>
          <Separator />
          <EnsoWidget
            apiKey={"b4d83fec-53ff-48b4-96b9-e7ac64de2123"}
            obligatedTokenOut={token}
            obligatedChainId={chainId}
          />{" "}
          <Separator />
        </>
      )}
    </div>
  );
}
