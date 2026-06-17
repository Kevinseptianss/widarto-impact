type RichTextChild = {
  type: string;
  text?: string;
};

export type RichTextBlock = {
  type: string;
  level?: number;
  children: RichTextChild[];
};

interface AboutProjectContentProps {
  content: RichTextBlock[];
}

export default function AboutProjectContent({
  content,
}: AboutProjectContentProps) {
  return (
    <div className="space-y-4.5">
      {content.map((block, index) => {
        const text = block.children.map((c) => c.text).join("");

        if (block.type === "heading") {
          if (block.level === 1) {
            return (
              <h2
                key={index}
                className="text-2xl lg:text-[28px] font-medium mt-9 first:mt-0"
              >
                {text}
              </h2>
            );
          }

          if (block.level === 2) {
            return (
              <h3 key={index} className="text-xl lg:text-2xl font-medium">
                {text}
              </h3>
            );
          }
        }

        if (block.type === "paragraph") {
          return (
            <p key={index} className="text-sm lg:text-base leading-relaxed">
              {text}
            </p>
          );
        }

        return null;
      })}
    </div>
  );
}
