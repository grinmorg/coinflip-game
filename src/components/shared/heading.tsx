import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  level: "h1" | "h2" | "h3";
  text: string;
  highlight?: string;
  highlightClassName?: string;
  className?: string;
}

export const Heading: React.FC<
  Props
> = ({
  level,
  text,
  highlight,
  highlightClassName = "px-2 text-white bg-secondary rounded-sm",
  className = "",
}) => {
  const textParts = text.split(" ");
  const HeadingTag = level;

  const baseClasses = {
    h1: "mb-8 text-4xl font-extrabold leading-none text-center tracking-tight text-gray-800 md:text-5xl lg:text-6xl",
    h2: "mb-6 text-3xl font-bold text-center text-gray-800 md:text-4xl",
    h3: "mb-4 text-2xl font-semibold text-center text-gray-800 md:text-3xl",
  };

  return (
    <HeadingTag
      className={cn(
        baseClasses[level],
        className
      )}>
      {textParts.map((part, index) => (
        <React.Fragment key={index}>
          {part === highlight ? (
            <mark
              className={
                highlightClassName
              }>
              {part}
            </mark>
          ) : (
            <span>{part}</span>
          )}
          {index < textParts.length - 1
            ? " "
            : ""}
        </React.Fragment>
      ))}
    </HeadingTag>
  );
};
