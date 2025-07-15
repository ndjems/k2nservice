import React, { createElement } from "react";
// import { SvgProps } from "@iconscout/react-unicons"; // Removed: not exported by the package

// Icône personnalisée "Usage" (simple icône d'engrenage pour illustrer l'utilisation)
export default function UilUsage(props: React.SVGProps<SVGSVGElement>) {
  return createElement(
    "svg",
    {
      ...props,
      width: 24,
      height: 24,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    createElement("circle", { cx: 12, cy: 12, r: 10, stroke: "currentColor", fill: "none" }),
    createElement("path", { d: "M12 8v4l3 3" })
  );
}
