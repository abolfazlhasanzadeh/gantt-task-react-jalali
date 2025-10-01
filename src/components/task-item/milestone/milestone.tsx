import React from "react";
import { TaskItemProps } from "../task-item";
import styles from "./milestone.module.css";

export const Milestone: React.FC<TaskItemProps> = ({
  task,
  isDateChangeable,
  onEventStart,
  isSelected,
}) => {
  const transform = `rotate(45 ${task.x1 + task.height * 0.356} ${task.y + task.height * 0.85})`;

  const getBarColor = () =>
    isSelected ? task.styles.backgroundSelectedColor : task.styles.backgroundColor;

  // تنظیمات تست دستی
  const gl = {
    show: false,
    color: "#ef4444",
    width: 2,
    dash: "4 4",
    pixelSnap: true,
    xNudge: 0,
    placeUnderBar: true,
  };

  const isProjectEndByLabel = task.id === "-2"
  const shouldShowGuideline = isProjectEndByLabel ?? gl?.show ;

  const guideColor = gl?.color ?? "#ef4444";
  const guideWidth = gl?.width ?? 2;
  const guideDash = gl?.dash ?? "4 4";
  const guidePixelSnap = gl?.pixelSnap ?? true;
  const guideXNudge = gl?.xNudge ?? 0;
  const placeUnderBar = gl?.placeUnderBar ?? true;

  // X وسط مایلستون + نوج
  const guideX = (task.x1 + task.x2) / 2 + (typeof guideXNudge === "number" ? guideXNudge : 0);

  // ارتفاع بزرگ برای تست دستی
  const guideHeight = 100000;

  const lineProps = {
    x1: guideX,
    x2: guideX,
    y1: 0,
    y2: guideHeight, // 👈 مهم
    stroke: guideColor,
    strokeWidth: guideWidth,
    ...(guideDash ? { strokeDasharray: guideDash } : {}),
    vectorEffect: "non-scaling-stroke" as const,
    ...(guidePixelSnap ? { shapeRendering: "crispEdges" as const } : {}),
    style: { pointerEvents: "none" as const }, // اختیاری
  };

  return (
    <g tabIndex={0} className={styles.milestoneWrapper}>
      {shouldShowGuideline && placeUnderBar && <line {...lineProps} />}

      <rect
        fill={getBarColor()}
        x={task.x1}
        width={task.height}
        y={task.y}
        height={task.height}
        rx={task.barCornerRadius}
        ry={task.barCornerRadius}
        transform={transform}
        className={styles.milestoneBackground}
        onMouseDown={e => {
          isDateChangeable && onEventStart("move", task, e);
        }}
      />

      {shouldShowGuideline && !placeUnderBar && <line {...lineProps} />}
    </g>
  );
};