import React, { ReactChild } from "react";
import { ViewMode } from "../../types/public-types";
import { TopPartOfCalendar } from "./top-part-of-calendar";
import {
  getCachedDateTimeFormat,
  getDaysInMonth,
  getLocalDayOfWeek,
  getLocaleMonth,
  getWeekNumberISO8601,
} from "../../helpers/date-helper";
import { DateSetup } from "../../types/date-setup";
import styles from "./calendar.module.css";

export type CalendarProps = {
  dateSetup: DateSetup;
  locale: string;
  viewMode: ViewMode;
  rtl: boolean;
  headerHeight: number;
  columnWidth: number;
  fontFamily: string;
  fontSize: string;
  weekName: string;
  quarterName: string;
};

export const Calendar: React.FC<CalendarProps> = ({
  dateSetup,
  locale,
  viewMode,
  rtl,
  headerHeight,
  columnWidth,
  fontFamily,
  fontSize,
  weekName,
  quarterName,
}) => {
  // کمک: مقایسه‌ی روز بدون زمان
  const isSameDay = (a: Date, b: Date) => {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  const getCalendarValuesForYear = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      const bottomValue = date.toLocaleDateString(locale, { year: "numeric" });
      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * i + columnWidth * 0.5}
          className={styles.calendarBottomText}
        >
          {bottomValue}
        </text>
      );
      if (i === 0 || date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()) {
        const topValue = date.toLocaleDateString(locale, { year: "numeric" });
        let xText: number;
        if (rtl) {
          xText = (6 + i + date.getFullYear() + 1) * columnWidth;
        } else {
          xText = (6 + i - date.getFullYear()) * columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={headerHeight}
            xText={xText}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForQuarterYear = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      const quarter = quarterName + Math.floor((date.getMonth() + 3) / 3);
      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * i + columnWidth * 0.5}
          className={styles.calendarBottomText}
        >
          {quarter}
        </text>
      );
      if (i === 0 || date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()) {
        const topValue = date.toLocaleDateString(locale, { year: "numeric" });
        let xText: number;
        if (rtl) {
          xText = (6 + i + date.getMonth() + 1) * columnWidth;
        } else {
          xText = (6 + i - date.getMonth()) * columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={Math.abs(xText)}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForMonth = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      const bottomValue = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { month: "long" }).format(date);
      bottomValues.push(
        <text
          key={bottomValue + date.getFullYear()}
          y={headerHeight * 0.8}
          x={columnWidth * i + columnWidth * 0.5}
          className={styles.calendarBottomText}
        >
          {bottomValue}
        </text>
      );
      if (i === 0 || date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()) {
        const topValue = date.toLocaleDateString(locale, { year: "numeric" });
        let xText: number;
        if (rtl) {
          xText = (6 + i + date.getMonth() + 1) * columnWidth;
        } else {
          xText = (6 + i - date.getMonth()) * columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={xText}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForWeek = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    let weeksCount: number = 1;
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;
    for (let i = dates.length - 1; i >= 0; i--) {
      const date = dates[i];
      let topValue = "";
      if (i === 0 || date.getMonth() !== dates[i - 1].getMonth()) {
        topValue = `${getLocaleMonth(date, locale)}, ${date.toLocaleDateString(locale, { year: "numeric" })}`;
      }
      const bottomValue = `${weekName}${getWeekNumberISO8601(date)}`;

      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * (i + +rtl)}
          className={styles.calendarBottomText}
        >
          {bottomValue}
        </text>
      );

      if (topValue) {
        if (i !== dates.length - 1) {
          topValues.push(
            <TopPartOfCalendar
              key={topValue}
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
    return [topValues, bottomValues];
  };

  // ======================
  // Day: کارت‌دار (استایل جدید)
  // ======================
  const getCalendarValuesForDay = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const dates = dateSetup.dates;

    // اندازه کارت براساس ارتفاع هدر:
    const cardSize = Math.min(60, Math.max(40, headerHeight - 10)); // 40..60
    const cardW = cardSize;
    const cardH = cardSize;
    const cardY = (headerHeight - cardH + 45) / 2; 

    const today = new Date();

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];

      // داده‌های کارت
      const dayNum = date.toLocaleDateString(locale, { day: "numeric" });
      const dayName = getLocalDayOfWeek(date, locale, "long");
      const xCenter = columnWidth * i + columnWidth * 0.5;

      const isToday = isSameDay(date, today);
      const fill = isToday ? "#D2E7FD" : "#D2E7FD";
      const textFill = isToday ? "#ffffff" : "#111827";

      // کارت + دو خط متن
      bottomValues.push(
        <g key={date.getTime()}>
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

      // اگر انتهای ماه شد، ماه بالا بیاد (مثل قبل)
      if (
        i + 1 !== dates.length &&
        getLocaleMonth(date, locale) !== getLocaleMonth(dates[i + 1], locale)
      ) {
        const topValue = getLocaleMonth(date, locale);
        const topDefaultHeight = headerHeight * 0.5;

        topValues.push(
          <TopPartOfCalendar
            key={topValue + date.toLocaleDateString(locale, { year: "numeric" })}
            value={topValue}
            x1Line={columnWidth * (i + 1)}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={
              columnWidth * (i + 1) -
              getDaysInMonth(date.getMonth(), date.getFullYear()) * columnWidth * 0.5
            }
            yText={topDefaultHeight * 0.6}
          />
        );
      }
    }

    return [topValues, bottomValues];
  };

  const getCalendarValuesForPartOfDay = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const ticks = viewMode === ViewMode.HalfDay ? 2 : 4;
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = getCachedDateTimeFormat(locale, {
        hour: "numeric",
      }).format(date);

      bottomValues.push(
        <text
          key={date.getTime()}
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
        date.toLocaleDateString(locale, { day: "numeric" }) !==
          dates[i - 1].toLocaleDateString(locale, { day: "numeric" })
      ) {
        const topValue = `${getLocalDayOfWeek(date, locale, "short")}, ${date.toLocaleDateString(locale, {
          day: "numeric",
        })} ${getLocaleMonth(date, locale)}`;
        topValues.push(
          <TopPartOfCalendar
            key={topValue + date.toLocaleDateString(locale, { year: "numeric" })}
            value={topValue}
            x1Line={columnWidth * i + ticks * columnWidth}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={columnWidth * i + ticks * columnWidth * 0.5}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }

    return [topValues, bottomValues];
  };

  const getCalendarValuesForHour = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = getCachedDateTimeFormat(locale, {
        hour: "numeric",
      }).format(date);

      bottomValues.push(
        <text
          key={date.getTime()}
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
        date.toLocaleDateString(locale, { day: "numeric" }) !==
          dates[i - 1].toLocaleDateString(locale, { day: "numeric" })
      ) {
        const displayDate = dates[i - 1];
        const topValue = `${getLocalDayOfWeek(
          displayDate,
          locale,
          "long"
        )}, ${displayDate.toLocaleDateString(locale, { day: "numeric" })} ${getLocaleMonth(displayDate, locale)}`;
        const topPosition = (date.getHours() - 24) / 2;
        topValues.push(
          <TopPartOfCalendar
            key={topValue + date.toLocaleDateString(locale, { year: "numeric" })}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={columnWidth * (i + topPosition)}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }

    return [topValues, bottomValues];
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
      [topValues, bottomValues] = getCalendarValuesForDay(); // ← کارت‌دار
      break;
    case ViewMode.QuarterDay:
    case ViewMode.HalfDay:
      [topValues, bottomValues] = getCalendarValuesForPartOfDay();
      break;
    case ViewMode.Hour:
      [topValues, bottomValues] = getCalendarValuesForHour();
  }


  const firstTs = dateSetup.dates[0]?.getTime();
const lastTs =
  (dateSetup.dates.length ? dateSetup.dates[dateSetup.dates.length - 1] : undefined)?.getTime();


  return (
    <g className="calendar" fontSize={fontSize} fontFamily={fontFamily}>
      <rect
        x={0}
        y={0}
        width={columnWidth * dateSetup.dates.length}
        height={headerHeight}
        className={styles.calendarHeader}
      />
<g key={`bottom-${viewMode}-${firstTs}-${lastTs}-${dateSetup.dates.length}`}>
  {bottomValues}
</g>
<g key={`top-${viewMode}-${firstTs}-${lastTs}-${dateSetup.dates.length}`}>
  {topValues}
</g>
    </g>
  );
};
