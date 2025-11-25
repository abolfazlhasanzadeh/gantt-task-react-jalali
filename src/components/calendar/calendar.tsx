import React, { ReactChild } from "react";
import { ViewMode } from "../../types/public-types";
import { TopPartOfCalendar } from "./top-part-of-calendar";
import {
  getCachedDateTimeFormat,
  getLocalDayOfWeek,
} from "../../helpers/date-helper";
import { DateSetup } from "../../types/date-setup";
import styles from "./calendar.module.css";

export type CalendarProps = {
  dateSetup: DateSetup;
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



function getPersianDayOfMonth(date: Date) {
  const f = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { day: "numeric" });
  return Number(f.format(date).replace(/[^\d]/g, ""));
}

function isJalaliLeap(jy: number) {
  const breaks = [-61,9,38,199,426,686,756,818,1111,1181,1210,1635,2060,2097,2192,2262,2324,2394,2456,3178];
  let bl = breaks.length, jp = breaks[0], leapJ = -14;
  for (let i = 1; i < bl; i++) {
    const jm = breaks[i], jump = jm - jp;
    if (jy < jm) break;
    leapJ += Math.floor(jump / 33) * 8 + Math.floor((jump % 33) / 4);
    jp = jm;
  }
  const N = jy - jp;
  leapJ += Math.floor(N / 33) * 8 + Math.floor(((N % 33) + 3) / 4);
  return ((leapJ + 1) % 33) === 0;
}

function jalaliDayOfYear(date: Date) {
  const jy = getPersianYear(date);
  const jm = getPersianMonthIdx(date);        
  const jd = getPersianDayOfMonth(date);      
  const lens = [31,31,31,31,31,31,30,30,30,30,30, isJalaliLeap(jy) ? 30 : 29];
  let sum = jd;
  for (let i = 0; i < jm; i++) sum += lens[i];
  return sum; 
}

export function getWeekNumberJalali(date: Date) {
  const doy = jalaliDayOfYear(date);     
  return Math.floor((doy - 1) / 7) + 1;  
}


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

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const Calendar: React.FC<CalendarProps> = ({
  dateSetup,
  viewMode,
  rtl,
  headerHeight,
  columnWidth,
  fontFamily,
  fontSize,
  weekName,
}) => {
  const dates = dateSetup.dates || [];

  const getCalendarValuesForYear = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const yFA = getPersianYear(date);

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

      if (i === 0 || getPersianYear(date) !== getPersianYear(dates[i - 1])) {
        topValues.push(
          <TopPartOfCalendar
            key={`y-top-${yFA}-${i}`}
            value={yearLabelFA(date)}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={headerHeight}
            xText={(6 + i - yFA) * columnWidth }
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

  const seasonFA = (mFA: number) => {
    if (mFA >= 0 && mFA <= 2) return "بهار";
    if (mFA >= 3 && mFA <= 5) return "تابستان";
    if (mFA >= 6 && mFA <= 8) return "پاییز";
    return "زمستان"; 
  };

  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    const yFA = getPersianYear(date);
    const mFA = getPersianMonthIdx(date); 
    const season = seasonFA(mFA);

    bottomValues.push(
      <text
        key={`season-bottom-${yFA}-${mFA}-${i}`}
        y={headerHeight * 0.8}
        x={columnWidth * i + columnWidth * 0.5}
        className={styles.calendarBottomText}
      >
        {season}
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
      const bottomValue = `${weekName}${getWeekNumberJalali(date)}`;

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


function groupMonthRuns(dates: Date[]) {
  const runs: Array<{ start: number; end: number; label: string }> = [];
  if (!dates.length) return runs;

  let start = 0;
  let curMonth = getPersianMonthIdx(dates[0]);

  for (let i = 1; i < dates.length; i++) {
    const m = getPersianMonthIdx(dates[i]);

    if (m !== curMonth) {
      runs.push({
        start,
        end: i - 1,
        label: monthLabelFA(dates[i - 1]),
      });
      start = i;
      curMonth = m;
    }
  }

  runs.push({
    start,
    end: dates.length - 1,
    label: monthLabelFA(dates[dates.length - 1]),
  });

  return runs;
}



const getCalendarValuesForDay = () => {
  const topValues: ReactChild[] = [];
  const bottomValues: ReactChild[] = [];

  const cardSize = Math.min(60, Math.max(40, headerHeight - 10));
  const cardW = cardSize;
  const cardH = cardSize;
  const cardY = (headerHeight - cardH + 58) / 2;

  const today = new Date();

  const bandH = Math.max(18, headerHeight * 0.38);
  const bandY = 5;

  const monthRuns = groupMonthRuns(dates);

monthRuns.forEach((run, idx) => {
  const pad = Math.min(8, columnWidth * 0.15); 
  const x1 = columnWidth * run.start + pad;     
  const x2 = columnWidth * (run.end + 1) - pad; 
  const width = Math.max(0, x2 - x1);

  const midIdx = Math.floor((run.start + run.end) / 2);
  const midX = columnWidth * midIdx + columnWidth * 0.5;

  topValues.push(
    <g key={`month-band-${idx}`} className={styles.calendarTop}>
      <rect
        x={x1}
        y={bandY}
        width={width}
        height={bandH}
        rx={6}
        ry={6}
        fill="#D2E7FD"
        className={styles.calendarTopBand}
      />
      <text
        x={midX}
        y={bandY + bandH * 0.66}
        textAnchor="middle"
        className={styles.calendarTopText}
        fontFamily={fontFamily}
      >
        {run.label}
      </text>
    </g>
  );
});

  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    const yFA = getPersianYear(date);
    const mFA = getPersianMonthIdx(date);
    const dayNum = dayNumericFA(date);
    const dayName = getLocalDayOfWeek(date, "fa-IR", "long");
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
