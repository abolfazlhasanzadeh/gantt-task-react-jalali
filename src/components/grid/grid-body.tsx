// src/components/grid/grid-body.tsx
import React, { ReactChild } from "react";
import { Task } from "../../types/public-types";
import { addToDate } from "../../helpers/date-helper";
import styles from "./grid.module.css";
import { isDailyGrid } from "../../helpers/bar-helper";

export type HolidayHighlightOptions = {
  includeFridays?: boolean;
  holidayDates?: string[];
  color?: string;
  placeUnderToday?: boolean;
};

export type GridBodyProps = {
  tasks: Task[];
  dates: Date[];
  svgWidth: number;
  rowHeight: number;
  columnWidth: number;
  todayColor: string;
  rtl: boolean;
  holidayHighlight?: HolidayHighlightOptions
};

const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

export const GridBody: React.FC<GridBodyProps> = ({
  tasks,
  dates,
  rowHeight,
  svgWidth,
  columnWidth,
  todayColor,
  rtl,
  holidayHighlight
}) => {


  const includeFridays = holidayHighlight?.includeFridays ?? true;
  const holidayDates = holidayHighlight?.holidayDates ?? [];
  const holidayColor = holidayHighlight?.color ?? "rgba(239,68,68,0.18)";
  const placeUnderToday = holidayHighlight?.placeUnderToday ?? true;
  const holidaySet = new Set(holidayDates.map(s => s.trim()));

  let y = 0;
  const gridRows: ReactChild[] = [];
  const rowLines: ReactChild[] = [
    <line
      key="RowLineFirst"
      x="0"
      y1={0}
      x2={svgWidth}
      y2={0}
      className={styles.gridRowLine}
    />,
  ];
  for (const task of tasks) {
    gridRows.push(
      <rect
        key={"Row" + task.id}
        x="0"
        y={y}
        width={svgWidth}
        height={rowHeight}
        className={styles.gridRow}
        strokeDasharray="4 3" 
      />
    );
    rowLines.push(
      <line
        key={"RowLine" + task.id}
        x="0"
        y1={y + rowHeight}
        x2={svgWidth}
        y2={y + rowHeight}
        className={styles.gridRowLine}
        strokeDasharray="4 3" 
      />
    );
    y += rowHeight;
  }

  const now = new Date();
  let tickX = 0;
  const ticks: ReactChild[] = [];
  let today: ReactChild = <rect />;

  // 👇 مستطیل‌های تعطیلی که می‌سازیم
  const holidaysRects: ReactChild[] = [];

  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];

    // خطوط عمودی
    ticks.push(
      <line
        key={date.getTime()}
        x1={tickX}
        y1={0}
        x2={tickX}
        y2={y}
        className={styles.gridTick}
      />
    );

    // امروز (همان منطق اصلی)
    if (
      (i + 1 !== dates.length &&
        date.getTime() < now.getTime() &&
        dates[i + 1].getTime() >= now.getTime()) ||
      // اگر آخرین ستون است
      (i !== 0 &&
        i + 1 === dates.length &&
        date.getTime() < now.getTime() &&
        addToDate(
          date,
          date.getTime() - dates[i - 1].getTime(),
          "millisecond"
        ).getTime() >= now.getTime())
    ) {
      today = (
        <rect
          x={tickX}
          y={0}
          width={columnWidth}
          height={y}
          fill={todayColor}
        />
      );
    }
    // RTL today
    if (
      rtl &&
      i + 1 !== dates.length &&
      date.getTime() >= now.getTime() &&
      dates[i + 1].getTime() < now.getTime()
    ) {
      today = (
        <rect
          x={tickX + columnWidth}
          y={0}
          width={columnWidth}
          height={y}
          fill={todayColor}
        />
      );
    }

    // 👇 تعطیلات: جمعه‌ها + لیست سفارشی
    const isFriday = date.getDay() === 5;
    const isListed = holidaySet.has(toISO(date));
    if ((includeFridays && isFriday) || isListed) {
      holidaysRects.push(
        <rect
          key={`holiday-${date.getTime()}`}
          x={tickX}
          y={0}
          width={columnWidth}
          height={y}
          fill={holidayColor}
        />
      );
    }

    tickX += columnWidth;
  }

  const daily = isDailyGrid(dates)  

  return (
    <g className="gridBody">
      <g className="rows">{gridRows}</g>
      <g className="rowLines">{rowLines}</g>
      <g className="ticks">{ticks}</g>

      {/* ترتیب لایه: زیر یا روی today */}
{placeUnderToday && daily && (
  <g className="holidays">{holidaysRects}</g>
)}
{placeUnderToday && daily  && (
  <g className="today">{today}</g>
)}

{!placeUnderToday && daily && (
  <g className="today">{today}</g>
)}
{!placeUnderToday && daily && (
  <g className="holidays">{holidaysRects}</g>
)}
    </g>
  );
};
