"use client";

export function Statistics({
  first,
  second,
  third,
}: {
  first: {
    title: string;
    data: any;
  };
  second: {
    title: string;
    data: any;
  };
  third: {
    title: string;
    data: any;
  };
}) {
  return (
    <div className="border border-slate-200 rounded-md w-full h-full items-center grid grid-rows-3 p-4 2xl:px-6 2xl:py-8">
      <div>
        <h4 className="font-semibold text-slate-800 2xl:text-xl">
          {first.title}
        </h4>
        <p className="text-slate-600 text-sm 2xl:text-lg">{first.data}</p>
      </div>
      <div>
        <h4 className="font-semibold text-slate-800 2xl:text-xl">
          {second.title}
        </h4>
        <p className="text-slate-600 text-sm 2xl:text-lg">
          {
            second.data.categories.find(
              (c: any) => c.value === second.data.category
            )?.label
          }
        </p>
      </div>
      <div>
        <h4 className="font-semibold text-slate-800 2xl:text-xl">
          {third.title}
        </h4>
        <p className="text-slate-600 text-sm 2xl:text-lg">{third.data}</p>
      </div>
    </div>
  );
}
