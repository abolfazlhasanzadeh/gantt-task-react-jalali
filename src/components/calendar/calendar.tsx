// src/components/calendar/calendar.tsx
import React, { ReactChild } from "react";
import { ViewMode } from "../../types/public-types";
import { TopPartOfCalendar } from "./top-part-of-calendar";
import {
  getCachedDateTimeFormat,
  getDaysInMonth,
  getLocalDayOfWeek,
  getWeekNumberISO8601,
} from "../../helpers/date-helper";
import { DateSetup } from "../../types/date-setup";
import styles from "./calendar.module.css";

export type CalendarProps = {
  dateSetup: DateSetup;
  // locale را نادیده می‌گیریم و خودمان فارسی می‌گیریم
  locale?: string;
  viewMode: ViewMode;
  rtl: boolean;
  headerHeight: number;
  columnWidth: number;
  fontFamily: string;
  fontSize: string;
  weekName: string;
  quarterName: string;
};

// --- Persian calendar helpers (always-on) ---
const PERSIAN_FMT_NUM = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "numeric",
});
const PERSIAN_FMT_YEAR = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
});
const PERSIAN_FMT_MONTH_LONG = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  month: "long",
});
const PERSIAN_FMT_DAY = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  day: "numeric",
});

const faDigits = "۰۱۲۳۴۵۶۷۸۹";
const toLatinDigits = (s: string) =>
  s.replace(/[۰-۹]/g, d => String(faDigits.indexOf(d)));

const getPersianYear = (d: Date) => {
  const parts = PERSIAN_FMT_NUM.formatToParts(d);
  const y = parts.find(p => p.type === "year")?.value ?? "";
  return Number(toLatinDigits(y)); // 1403, 1404, ...
};
const getPersianMonthIdx = (d: Date) => {
  const parts = PERSIAN_FMT_NUM.formatToParts(d);
  const m = parts.find(p => p.type === "month")?.value ?? "1";
  return Number(toLatinDigits(m)) - 1; // 0..11
};
const monthLabelFA = (d: Date) => PERSIAN_FMT_MONTH_LONG.format(d);
const yearLabelFA = (d: Date) => PERSIAN_FMT_YEAR.format(d);
const dayNumericFA = (d: Date) => PERSIAN_FMT_DAY.format(d);

// Day name را از helper خودت می‌گیریم (با توجه به RTL)
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const Calendar: React.FC<CalendarProps> = ({
  dateSetup,
  // locale را عملاً نادیده می‌گیریم و فارسی رندر می‌کنیم
  viewMode,
  rtl,
  headerHeight,
  columnWidth,
  fontFamily,
  fontSize,
  weekName,
  quarterName,
}) => {
  const dates = dateSetup.dates || [];

  const getCalendarValuesForYear = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const yFA = getPersianYear(date);

      // bottom: سال شمسی
      bottomValues.push(
        <text
          key={`y-bottom-${yFA}-${i}`}
          y={headerHeight * 0.8}
          x={columnWidth * i + columnWidth * 0.5}
          className={styles.calendarBottomText}
        >
          {yearLabelFA(date)}
        </text>
      );

      // top: شروع سال شمسی جدید
      if (i === 0 || getPersianYear(date) !== getPersianYear(dates[i - 1])) {
        topValues.push(
          <TopPartOfCalendar
            key={`y-top-${yFA}-${i}`}
            value={yearLabelFA(date)}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={headerHeight}
            xText={(6 + i - yFA) * columnWidth /* صرفاً برای جای‌گذاری */}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues] as const;
  };

  const getCalendarValuesForQuarterYear = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const yFA = getPersianYear(date);
      const mFA = getPersianMonthIdx(date); // 0..11
      const q = Math.floor((mFA + 3) / 3); // 1..4
      const quarter = `${quarterName}${q}`;

      bottomValues.push(
        <text
          key={`q-bottom-${yFA}-Q${q}-${i}`}
          y={headerHeight * 0.8}
          x={columnWidth * i + columnWidth * 0.5}
          className={styles.calendarBottomText}
        >
          {quarter}
        </text>
      );

      if (i === 0 || getPersianYear(date) !== getPersianYear(dates[i - 1])) {
        topValues.push(
          <TopPartOfCalendar
            key={`q-top-${yFA}-${i}`}
            value={yearLabelFA(date)}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={Math.abs((6 + i - mFA) * columnWidth)}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues] as const;
  };

  const getCalendarValuesForMonth = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const yFA = getPersianYear(date);
      const mFA = getPersianMonthIdx(date);

      // bottom: نام ماه شمسی
      bottomValues.push(
        <text
          key={`m-bottom-${yFA}-${mFA}-${i}`}
          y={headerHeight * 0.8}
          x={columnWidth * i + columnWidth * 0.5}
          className={styles.calendarBottomText}
        >
          {monthLabelFA(date)}
        </text>
      );

      // top: شروع سال شمسی جدید
      if (i === 0 || getPersianYear(date) !== getPersianYear(dates[i - 1])) {
        topValues.push(
          <TopPartOfCalendar
            key={`m-top-${yFA}-${mFA}-${i}`}
            value={yearLabelFA(date)}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={(6 + i - mFA) * columnWidth}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues] as const;
  };

  const getCalendarValuesForWeek = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    let weeksCount = 1;
    const topDefaultHeight = headerHeight * 0.5;

    for (let i = dates.length - 1; i >= 0; i--) {
      const date = dates[i];
      const yFA = getPersianYear(date);
      const mFA = getPersianMonthIdx(date);
      const bottomValue = `${weekName}${getWeekNumberISO8601(date)}`;

      bottomValues.push(
        <text
          key={`w-bottom-${yFA}-${mFA}-${i}`}
          y={headerHeight * 0.8}
          x={columnWidth * (i + +rtl)}
          className={styles.calendarBottomText}
        >
          {bottomValue}
        </text>
      );

      // مرز تغییر «ماه شمسی»
      let topValue = "";
      if (i === 0 || getPersianMonthIdx(date) !== getPersianMonthIdx(dates[i - 1])) {
        topValue = `${monthLabelFA(date)}, ${yearLabelFA(date)}`;
      }

      if (topValue) {
        if (i !== dates.length - 1) {
          topValues.push(
            <TopPartOfCalendar
              key={`w-top-${yFA}-${mFA}-${i}`}
              value={topValue}
              x1Line={columnWidth * i + weeksCount * columnWidth}
              y1Line={0}
              y2Line={topDefaultHeight}
              xText={columnWidth * i + columnWidth * weeksCount * 0.5}
              yText={topDefaultHeight * 0.9}
            />
          );
        }
        weeksCount = 0;
      }
      weeksCount++;
    }
    return [topValues, bottomValues] as const;
  };

  const getCalendarValuesForDay = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];

    const cardSize = Math.min(60, Math.max(40, headerHeight - 10));
    const cardW = cardSize;
    const cardH = cardSize;
    const cardY = (headerHeight - cardH + 45) / 2;

    const today = new Date();

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const yFA = getPersianYear(date);
      const mFA = getPersianMonthIdx(date);
      const dayNum = dayNumericFA(date);
      const dayName = getLocalDayOfWeek(date, "fa-IR", "long"); // نام روز فارسی
      const xCenter = columnWidth * i + columnWidth * 0.5;

      const isToday = isSameDay(date, today);
      const fill = isToday ? "#D2E7FD" : "#D2E7FD";
      const textFill = isToday ? "#ffffff" : "#111827";

      bottomValues.push(
        <g key={`d-bottom-${yFA}-${mFA}-${date.getTime()}-${i}`}>
          <rect
            x={xCenter - cardW / 2}
            y={cardY}
            width={cardW}
            height={45}
            rx={8}
            ry={8}
            fill={fill}
          />
          <text
            x={xCenter}
            y={cardY + cardH / 2 - 18}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={textFill}
            fontFamily={fontFamily}
            className={styles.calendarBottomText}
          >
            <tspan x={xCenter} dy="0" fontSize="14" fontWeight={700}>
              {dayNum}
            </tspan>
            <tspan x={xCenter} dy="18" fontSize="12" fontWeight={500}>
              {dayName}
            </tspan>
          </text>
        </g>
      );

      // مرز تغییر «ماه شمسی»
      if (i + 1 !== dates.length &&
          getPersianMonthIdx(date) !== getPersianMonthIdx(dates[i + 1])) {
        const mLabel = monthLabelFA(date);
        const topDefaultHeight = headerHeight * 0.5;

        topValues.push(
          <TopPartOfCalendar
            key={`d-top-${yFA}-${mFA}-${i}`}
            value={mLabel}
            x1Line={columnWidth * (i + 1)}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={
              columnWidth * (i + 1) -
              getDaysInMonth(date.getMonth(), date.getFullYear()) * // فقط جهت تخمین پهنا
                columnWidth *
                0.5
            }
            yText={topDefaultHeight * 0.6}
          />
        );
      }
    }

    return [topValues, bottomValues] as const;
  };

  const getCalendarValuesForPartOfDay = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const ticks = viewMode === ViewMode.HalfDay ? 2 : 4;

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const yFA = getPersianYear(date);
      const mFA = getPersianMonthIdx(date);
      const bottomValue = getCachedDateTimeFormat("fa-IR", {
        hour: "numeric",
      }).format(date);

      bottomValues.push(
        <text
          key={`pod-bottom-${yFA}-${mFA}-${date.getTime()}-${i}`}
          y={headerHeight * 0.8}
          x={columnWidth * (i + +rtl)}
          className={styles.calendarBottomText}
          fontFamily={fontFamily}
        >
          {bottomValue}
        </text>
      );

      if (
        i === 0 ||
        getPersianMonthIdx(date) !== getPersianMonthIdx(dates[i - 1])
      ) {
        const topValue = `${getLocalDayOfWeek(date, "fa-IR", "short")}, ${dayNumericFA(
          date
        )} ${monthLabelFA(date)}`;

        topValues.push(
          <TopPartOfCalendar
            key={`pod-top-${yFA}-${mFA}-${i}`}
            value={topValue}
            x1Line={columnWidth * i + ticks * columnWidth}
            y1Line={0}
            y2Line={headerHeight * 0.5}
            xText={columnWidth * i + ticks * columnWidth * 0.5}
            yText={headerHeight * 0.5 * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues] as const;
  };

  const getCalendarValuesForHour = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const yFA = getPersianYear(date);
      const mFA = getPersianMonthIdx(date);
      const bottomValue = getCachedDateTimeFormat("fa-IR", {
        hour: "numeric",
      }).format(date);

      bottomValues.push(
        <text
          key={`h-bottom-${yFA}-${mFA}-${date.getTime()}-${i}`}
          y={headerHeight * 0.8}
          x={columnWidth * (i + +rtl)}
          className={styles.calendarBottomText}
          fontFamily={fontFamily}
        >
          {bottomValue}
        </text>
      );

      if (
        i !== 0 &&
        getPersianMonthIdx(date) !== getPersianMonthIdx(dates[i - 1])
      ) {
        const displayDate = dates[i - 1];
        const yFAp = getPersianYear(displayDate);
        const mFAp = getPersianMonthIdx(displayDate);
        const topValue = `${getLocalDayOfWeek(
          displayDate,
          "fa-IR",
          "long"
        )}, ${dayNumericFA(displayDate)} ${monthLabelFA(displayDate)}`;
        const topPosition = (date.getHours() - 24) / 2;

        topValues.push(
          <TopPartOfCalendar
            key={`h-top-${yFAp}-${mFAp}-${i}`}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={headerHeight * 0.5}
            xText={columnWidth * (i + topPosition)}
            yText={headerHeight * 0.5 * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues] as const;
  };

  let topValues: ReactChild[] = [];
  let bottomValues: ReactChild[] = [];
  switch (dateSetup.viewMode) {
    case ViewMode.Year:
      [topValues, bottomValues] = getCalendarValuesForYear();
      break;
    case ViewMode.QuarterYear:
      [topValues, bottomValues] = getCalendarValuesForQuarterYear();
      break;
    case ViewMode.Month:
      [topValues, bottomValues] = getCalendarValuesForMonth();
      break;
    case ViewMode.Week:
      [topValues, bottomValues] = getCalendarValuesForWeek();
      break;
    case ViewMode.Day:
      [topValues, bottomValues] = getCalendarValuesForDay();
      break;
    case ViewMode.QuarterDay:
    case ViewMode.HalfDay:
      [topValues, bottomValues] = getCalendarValuesForPartOfDay();
      break;
    case ViewMode.Hour:
      [topValues, bottomValues] = getCalendarValuesForHour();
      break;
  }

  return (
    <g className="calendar" fontSize={fontSize} fontFamily={fontFamily}>
      <rect
        x={0}
        y={0}
        width={columnWidth * dates.length}
        height={headerHeight}
        className={styles.calendarHeader}
      />
      <g key={`bottom-persian-${viewMode}`}>{bottomValues}</g>
      <g key={`top-persian-${viewMode}`}>{topValues}</g>
    </g>
  );
};
