import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  title: string | undefined;
  description: string | undefined;
  className?: string;
};
function Title({ title = "", description = "", className }: Props) {
  return (
    <section className={cn("mt-9", className)}>
      <h1 className="text-4xl lg:text-5xl">{title}</h1>
      <div className="flex items-start justify-between gap-x-4">
        <p className="mt-9 md:mt-11 flex-1 md:max-w-1/2">{description}</p>
      </div>
    </section>
  );
}

export default Title;
