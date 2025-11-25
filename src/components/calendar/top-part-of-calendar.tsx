// src/components/calendar/top-part-of-calendar.tsx
import React from "react";
import styles from "./calendar.module.css";

type TopPartOfCalendarProps = {
  value: string;
  x1Line: number;
  y1Line: number;
  y2Line: number;
  xText: number;
  yText: number;
  uid?: string;
};

export const TopPartOfCalendar: React.FC<TopPartOfCalendarProps> = ({
  value,
  x1Line,
  y1Line,
  y2Line,
  xText,
  yText,
  uid,
}) => {
  const safeUid =
    uid ??
    `tp-${x1Line}-${y1Line}-${y2Line}-${xText}-${yText}-${value}-${Math.random()
      .toString(36)
      .slice(2, 7)}`;

  return (
    <g className={styles.calendarTop} >
      <line
        key={`tp-line-${safeUid}`}
        x1={x1Line}
        y1={y1Line}
        x2={x1Line}
        y2={y2Line}
        className={styles.calendarTopTick}
      />
      <text
        key={`tp-text-${safeUid}`}
        y={yText}
        x={xText}
        className={styles.calendarTopText}
      >
        {value}
      </text>
    </g>
  );
};
