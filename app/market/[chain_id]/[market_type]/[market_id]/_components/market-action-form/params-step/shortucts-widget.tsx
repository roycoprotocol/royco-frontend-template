import React from "react";
import EnsoWidget, { SystemConfig } from "@ensofinance/shortcuts-widget";
import { Switch } from "@/components/ui/switch";

// Paste styling according to the design system
// https://www.chakra-ui.com/docs/theming/customization/overview
const themeConfig: SystemConfig = {};

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
        <div>
          <div className={"font-gt font-500"}>Step 1:</div>
          <div className={"mt-1 shadow"}>
            <EnsoWidget
              apiKey={"b4d83fec-53ff-48b4-96b9-e7ac64de2123"}
              obligatedTokenOut={token}
              obligatedChainId={chainId}
              themeConfig={themeConfig}
            />
          </div>
          <div className={"mt-3 font-gt font-500"}>Step 2:</div>
        </div>
      )}
    </div>
  );
}
