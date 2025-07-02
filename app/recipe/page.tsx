import { FunctionSelector } from "./_components/function-selector/function-selector";
import { ActionEditor } from "./_components/action-editor/action-editor";

export default function Page() {
  return (
    <div className="flex flex-col items-center bg-_surface_ p-5">
      <div className="col-span-12 w-full border border-b-0 border-_divider_ bg-white px-2 py-1"></div>
      <div className="grid h-[70vh] w-full max-w-screen-3xl grid-cols-12 divide-x divide-_divider_ border border-_divider_ font-light">
        <FunctionSelector className="col-span-4" />

        <ActionEditor className="col-span-8" />
      </div>
    </div>
  );
}
