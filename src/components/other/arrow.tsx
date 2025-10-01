// components/other/arrow.tsx
import React from "react";
import { BarTask } from "../../types/bar-task";

export type LinkType = "FS" | "SS" | "FF" | "SF";

type ArrowProps = {
  taskFrom: BarTask;
  taskTo: BarTask;
  rowHeight: number;
  taskHeight: number;
  arrowIndent: number;
  rtl: boolean;
  linkType?: LinkType; // FS / SS / FF / SF
};

export const Arrow: React.FC<ArrowProps> = ({
  taskFrom,
  taskTo,
  rowHeight,
  taskHeight,
  arrowIndent,
  rtl,
  linkType = "FS",
}) => {
  const [path, trianglePoints] = rtl
    ? buildPathAndTriangleRTL(taskFrom, taskTo, rowHeight, taskHeight, arrowIndent, linkType)
    : buildPathAndTriangleLTR(taskFrom, taskTo, rowHeight, taskHeight, arrowIndent, linkType);

  return (
    <g className="arrow">
      <path strokeWidth="1.5" d={path} fill="none" />
      <polygon points={trianglePoints} />
    </g>
  );
};

/* =========================
 * مسیر کلاسیک FS برای LTR
 * ========================= */
function routeFSLTR(
  fromX2: number,
  fromY: number,
  toX1: number,
  toY: number,
  rowH: number,
  indent: number
) {
  const sign = fromY > toY ? -1 : 1;
  const fromEnd = fromX2 + indent * 2;

  const path = `M ${fromX2} ${fromY}
h ${indent}
v ${(sign * rowH) / 2}
${fromEnd < toX1 ? "" : `H ${toX1 - indent}`}
V ${toY}
h ${fromEnd > toX1 ? indent : toX1 - fromX2 - indent}`;

  // نوک → (به سمت راست)
  const tri = `${toX1},${toY} ${toX1 - 5},${toY - 5} ${toX1 - 5},${toY + 5}`;
  return [path, tri] as const;
}

/* ==========================================
 * نزدیک‌شدن از بیرونِ راست (برای هدف x2) LTR
 * ========================================== */
function routeToRightEdgeLTR(
  fromX: number,
  fromY: number,
  toX2: number,
  toY: number,
  rowH: number,
  indent: number
) {
  const sign = fromY > toY ? -1 : 1;
  const path = `M ${fromX} ${fromY}
h ${indent}
v ${(sign * rowH) / 2}
H ${toX2 + indent}
V ${toY}
h ${-indent}`;
  // نوک ← (به سمت چپ)
  const tri = `${toX2},${toY} ${toX2 + 5},${toY - 5} ${toX2 + 5},${toY + 5}`;
  return [path, tri] as const;
}

/* =========================
 * نگاشت LTR
 * ========================= */
function buildPathAndTriangleLTR(
  from: BarTask,
  to: BarTask,
  rowH: number,
  taskH: number,
  indent: number,
  type: LinkType
) {
  const yFrom = from.y + taskH / 2;
  const yTo = to.y + taskH / 2;

  switch (type) {
    case "FS": // end → start
      return routeFSLTR(from.x2, yFrom, to.x1, yTo, rowH, indent);

    case "SS": // start → start
      return routeFSLTR(from.x1, yFrom, to.x1, yTo, rowH, indent);

    case "FF": // end → end (بیرون راست)
      return routeToRightEdgeLTR(from.x2, yFrom, to.x2, yTo, rowH, indent);

    case "SF": // start → end (بیرون راست)
      return routeToRightEdgeLTR(from.x1, yFrom, to.x2, yTo, rowH, indent);

    default:
      return routeFSLTR(from.x2, yFrom, to.x1, yTo, rowH, indent);
  }
}

/* =========================
 * مسیر کلاسیک FS برای RTL
 * (from.x1 → to.x2)
 * ========================= */
function routeFSRTL(
  fromX1: number,
  fromY: number,
  toX2: number,
  toY: number,
  rowH: number,
  indent: number
) {
  const sign = fromY > toY ? -1 : 1;
  const fromEnd = fromX1 - indent * 2;

  const path = `M ${fromX1} ${fromY}
h ${-indent}
v ${(sign * rowH) / 2}
${fromEnd > toX2 ? "" : `H ${toX2 + indent}`}
V ${toY}
h ${fromEnd < toX2 ? -indent : toX2 - fromX1 + indent}`;

  // نوک ← (به سمت چپ)، روی x2
  const tri = `${toX2},${toY} ${toX2 + 5},${toY + 5} ${toX2 + 5},${toY - 5}`;
  return [path, tri] as const;
}

/* ===================================================
 * RTL: نزدیک‌شدن از بیرونِ راست برای هدف x2 (مثل SS)
 * =================================================== */
function routeToRightEdgeRTL(
  fromX: number,
  fromY: number,
  toX2: number,
  toY: number,
  rowH: number,
  indent: number
) {
  const sign = fromY > toY ? -1 : 1;
  const path = `M ${fromX} ${fromY}
h ${-indent}
v ${(sign * rowH) / 2}
H ${toX2 + indent}
V ${toY}
h ${-indent}`;
  // نوک ← (tip روی x2)
  const tri = `${toX2},${toY} ${toX2 + 5},${toY + 5} ${toX2 + 5},${toY - 5}`;
  return [path, tri] as const;
}

/* ==================================================
 * RTL: نزدیک‌شدن از بیرونِ چپ برای هدف x1 (برای FF/SF)
 * ================================================== */
function routeToLeftEdgeRTL(
  fromX: number,
  fromY: number,
  toX1: number,
  toY: number,
  rowH: number,
  indent: number
) {
  const sign = fromY > toY ? -1 : 1;
  const path = `M ${fromX} ${fromY}
h ${-indent}
v ${(sign * rowH) / 2}
H ${toX1 - indent}
V ${toY}
h ${indent}`;
  // نوک → (tip روی x1)
  const tri = `${toX1},${toY} ${toX1 - 5},${toY - 5} ${toX1 - 5},${toY + 5}`;
  return [path, tri] as const;
}

/* =========================
 * نگاشت RTL (اصلاح‌شده)
 * ========================= */
function buildPathAndTriangleRTL(
  from: BarTask,
  to: BarTask,
  rowH: number,
  taskH: number,
  indent: number,
  type: LinkType
) {
  const yFrom = from.y + taskH / 2;
  const yTo = to.y + taskH / 2;

  switch (type) {
    case "FS":
      // start → end  (from.x1 → to.x2) کلاسیک
      return routeFSRTL(from.x1, yFrom, to.x2, yTo, rowH, indent);

    case "SS":
      // start → start  (from.x2 → to.x2) نزدیک شدن از بیرون راست، دقیق روی x2
      return routeToRightEdgeRTL(from.x2, yFrom, to.x2, yTo, rowH, indent);

    case "FF":
      // end → end  (from.x1 → to.x1) نزدیک شدن از بیرون چپ، دقیق روی x1
      return routeToLeftEdgeRTL(from.x1, yFrom, to.x1, yTo, rowH, indent);

    case "SF":
      // start → end  (from.x2 → to.x1) راستِ مبدا → چپِ مقصد
      return routeToLeftEdgeRTL(from.x2, yFrom, to.x1, yTo, rowH, indent);

    default:
      return routeFSRTL(from.x1, yFrom, to.x2, yTo, rowH, indent);
  }
}
