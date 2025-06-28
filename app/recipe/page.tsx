import { FunctionSelector } from "./_components/function-selector/function-selector";
import { RecipeEditor } from "./_components/recipe-editor/recipe-editor";

export default function Page() {
  return (
    <div className="flex flex-col items-center bg-_surface_ p-5">
      <div className="grid h-[80vh] w-full max-w-screen-3xl grid-cols-12 divide-x divide-_divider_ border border-_divider_">
        <FunctionSelector className="col-span-4" />

        <RecipeEditor className="col-span-8" />
      </div>
    </div>
  );
}
