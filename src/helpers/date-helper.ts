import { Task, ViewMode } from "../types/public-types";
import DateTimeFormatOptions = Intl.DateTimeFormatOptions;
import DateTimeFormat = Intl.DateTimeFormat;

type DateHelperScales =
  | "year"
  | "month"
  | "day"
  | "hour"
  | "minute"
  | "second"
  | "millisecond";

const intlDTCache = {};
export const getCachedDateTimeFormat = (
  locString: string | string[],
  opts: DateTimeFormatOptions = {}
): DateTimeFormat => {
  const key = JSON.stringify([locString, opts]);
  let dtf = intlDTCache[key];
  if (!dtf) {
    dtf = new Intl.DateTimeFormat(locString, opts);
    intlDTCache[key] = dtf;
  }
  return dtf;
};

export const addToDate = (
  date: Date,
  quantity: number,
  scale: DateHelperScales
) => {
  const newDate = new Date(
    date.getFullYear() + (scale === "year" ? quantity : 0),
    date.getMonth() + (scale === "month" ? quantity : 0),
    date.getDate() + (scale === "day" ? quantity : 0),
    date.getHours() + (scale === "hour" ? quantity : 0),
    date.getMinutes() + (scale === "minute" ? quantity : 0),
    date.getSeconds() + (scale === "second" ? quantity : 0),
    date.getMilliseconds() + (scale === "millisecond" ? quantity : 0)
  );
  return newDate;
};

export const startOfDate = (date: Date, scale: DateHelperScales) => {
  const scores = [
    "millisecond",
    "second",
    "minute",
    "hour",
    "day",
    "month",
    "year",
  ];

  const shouldReset = (_scale: DateHelperScales) => {
    const maxScore = scores.indexOf(scale);
    return scores.indexOf(_scale) <= maxScore;
  };
  const newDate = new Date(
    date.getFullYear(),
    shouldReset("year") ? 0 : date.getMonth(),
    shouldReset("month") ? 1 : date.getDate(),
    shouldReset("day") ? 0 : date.getHours(),
    shouldReset("hour") ? 0 : date.getMinutes(),
    shouldReset("minute") ? 0 : date.getSeconds(),
    shouldReset("second") ? 0 : date.getMilliseconds()
  );
  return newDate;
};

export const ganttDateRange = (
  tasks: Task[],
  viewMode: ViewMode,
  preStepsCount: number
) => {
  let newStartDate: Date = tasks[0].start;
  let newEndDate: Date = tasks[0].start;
  for (const task of tasks) {
    if (task.start < newStartDate) {
      newStartDate = task.start;
    }
    if (task.end > newEndDate) {
      newEndDate = task.end;
    }
  }
  switch (viewMode) {
    case ViewMode.Year:
      newStartDate = addToDate(newStartDate, -1, "year");
      newStartDate = startOfDate(newStartDate, "year");
      newEndDate = addToDate(newEndDate, 1, "year");
      newEndDate = startOfDate(newEndDate, "year");
      break;
    case ViewMode.QuarterYear:
      newStartDate = addToDate(newStartDate, -3, "month");
      newStartDate = startOfDate(newStartDate, "month");
      newEndDate = addToDate(newEndDate, 3, "year");
      newEndDate = startOfDate(newEndDate, "year");
      break;
    case ViewMode.Month:
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, "month");
      newStartDate = startOfDate(newStartDate, "month");
      newEndDate = addToDate(newEndDate, 1, "year");
      newEndDate = startOfDate(newEndDate, "year");
      break;
    case ViewMode.Week:
      newStartDate = startOfDate(newStartDate, "day");
      newStartDate = addToDate(
        getMonday(newStartDate),
        -7 * preStepsCount,
        "day"
      );
      newEndDate = startOfDate(newEndDate, "day");
      newEndDate = addToDate(newEndDate, 1.5, "month");
      break;
    case ViewMode.Day:
      newStartDate = startOfDate(newStartDate, "day");
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, "day");
      newEndDate = startOfDate(newEndDate, "day");
      newEndDate = addToDate(newEndDate, 19, "day");
      break;
    case ViewMode.QuarterDay:
      newStartDate = startOfDate(newStartDate, "day");
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, "day");
      newEndDate = startOfDate(newEndDate, "day");
      newEndDate = addToDate(newEndDate, 66, "hour"); // 24(1 day)*3 - 6
      break;
    case ViewMode.HalfDay:
      newStartDate = startOfDate(newStartDate, "day");
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, "day");
      newEndDate = startOfDate(newEndDate, "day");
      newEndDate = addToDate(newEndDate, 108, "hour"); // 24(1 day)*5 - 12
      break;
    case ViewMode.Hour:
      newStartDate = startOfDate(newStartDate, "hour");
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, "hour");
      newEndDate = startOfDate(newEndDate, "day");
      newEndDate = addToDate(newEndDate, 1, "day");
      break;
  }
  return [newStartDate, newEndDate];
};

export const seedDates = (
  startDate: Date,
  endDate: Date,
  viewMode: ViewMode
) => {
  let currentDate: Date = new Date(startDate);
  const dates: Date[] = [currentDate];
  while (currentDate < endDate) {
    switch (viewMode) {
      case ViewMode.Year:
        currentDate = addToDate(currentDate, 1, "year");
        break;
      case ViewMode.QuarterYear:
        currentDate = addToDate(currentDate, 3, "month");
        break;
      case ViewMode.Month:
        currentDate = addToDate(currentDate, 1, "month");
        break;
      case ViewMode.Week:
        currentDate = addToDate(currentDate, 7, "day");
        break;
      case ViewMode.Day:
        currentDate = addToDate(currentDate, 1, "day");
        break;
      case ViewMode.HalfDay:
        currentDate = addToDate(currentDate, 12, "hour");
        break;
      case ViewMode.QuarterDay:
        currentDate = addToDate(currentDate, 6, "hour");
        break;
      case ViewMode.Hour:
        currentDate = addToDate(currentDate, 1, "hour");
        break;
    }
    dates.push(currentDate);
  }
  return dates;
};

export const getLocaleMonth = (date: Date, locale: string) => {
  return date.toLocaleDateString(locale, {month: "long"});
};

export const getLocalDayOfWeek = (
  date: Date,
  locale: string,
  format?: "long" | "short" | "narrow" | undefined
) => {
  let bottomValue = getCachedDateTimeFormat(locale, {
    weekday: format,
  }).format(date);
  bottomValue = bottomValue.replace(
    bottomValue[0],
    bottomValue[0].toLocaleUpperCase()
  );
  return bottomValue;
};

/**
 * Returns monday of current week
 * @param date date for modify
 */
const getMonday = (date: Date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(date.setDate(diff));
};

export const getWeekNumberISO8601 = (date: Date) => {
  const tmpDate = new Date(date.valueOf());
  const dayNumber = (tmpDate.getDay() + 6) % 7;
  tmpDate.setDate(tmpDate.getDate() - dayNumber + 3);
  const firstThursday = tmpDate.valueOf();
  tmpDate.setMonth(0, 1);
  if (tmpDate.getDay() !== 4) {
    tmpDate.setMonth(0, 1 + ((4 - tmpDate.getDay() + 7) % 7));
  }
  const weekNumber = (
    1 + Math.ceil((firstThursday - tmpDate.valueOf()) / 604800000)
  ).toString();

  if (weekNumber.length === 1) {
    return `0${weekNumber}`;
  } else {
    return weekNumber;
  }
};

export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};




type G = { gy: number; gm: number; gd: number };
type J = { jy: number; jm: number; jd: number };

const div = (a: number, b: number) => ~~(a / b);

// Gregorian <-> JDN
function g2d(gy: number, gm: number, gd: number) {
  const a = div(14 - gm, 12), y = gy + 4800 - a, m = gm + 12 * a - 3;
  return gd + div(153 * m + 2, 5) + 365 * y + div(y, 4) - div(y, 100) + div(y, 400) - 32045;
}
function d2g(jdn: number): G {
  const j = jdn + 32044;
  const g = div(j, 146097);
  const dg = j % 146097;
  const c = div((div(dg, 36524) + 1) * 3, 4);
  const dc = dg - c * 36524;
  const b = div(dc, 1461);
  const db = dc % 1461;
  const a = div((div(db, 365) + 1) * 3, 4);
  const da = db - a * 365;
  const y = g * 400 + c * 100 + b * 4 + a;
  const m = div(da * 5 + 308, 153) - 2;
  const d = da - div((m + 4) * 153, 5) + 122;
  return { gy: y - 4800 + div(m + 2, 12), gm: (m + 2) % 12 + 1, gd: d + 1 };
}

// Jalali <-> JDN
function j2d(jy: number, jm: number, jd: number) {
  const jy2 = jy <= 979 ? jy + 621 : jy - 979;
  const r =
    jy2 * 365 + div(jy2, 33) * 8 + div((jy2 % 33 + 3), 4) + 79 + jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  return r + 1948320;
}
function d2j(jdn: number): J {
  let j = jdn - 1948320;
  let y = 979 + 33 * div(j, 12053);
  j %= 12053;
  y += 4 * div(j, 1461);
  j %= 1461;
  if (j >= 366) { y += div(j - 1, 365); j = (j - 1) % 365; }
  const jm = j < 186 ? 1 + div(j, 31) : 7 + div(j - 186, 30);
  const jd = j < 186 ? 1 + (j % 31) : 1 + ((j - 186) % 30);
  return { jy: y, jm, jd };
}

export function toJalaali(d: Date): J { return d2j(g2d(d.getFullYear(), d.getMonth() + 1, d.getDate())); }
export function toGregorian(jy: number, jm: number, jd: number): G { return d2g(j2d(jy, jm, jd)); }

export function seedDatesJalaliMonths(start: Date, end: Date): Date[] {
  const sJ = toJalaali(start);
  let jy = sJ.jy, jm = sJ.jm;

  let g = toGregorian(jy, jm, 1);
  let cur = new Date(g.gy, g.gm - 1, g.gd);

  if (cur > start) {
    jm--; if (jm < 1) { jm = 12; jy--; }
    g = toGregorian(jy, jm, 1);
    cur = new Date(g.gy, g.gm - 1, g.gd);
  }

  const out: Date[] = [];
  while (cur <= end) {
    out.push(new Date(cur));
    jm++; if (jm > 12) { jm = 1; jy++; }
    g = toGregorian(jy, jm, 1);
    cur = new Date(g.gy, g.gm - 1, g.gd);
  }
  out.push(new Date(end)); // لبه‌ی راست آخرین ستون
  return out;
}


export const isPersianCalendarLocale = (locale: string) =>
  /fa/i.test(locale) || /u-ca-persian/i.test(locale);

const jalaliDTF = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

const getJalaliParts = (d: Date) => {
  const parts = jalaliDTF.formatToParts(d);
  const y = +parts.find(p => p.type === "year")!.value;
  const m = +parts.find(p => p.type === "month")!.value;
  const day = +parts.find(p => p.type === "day")!.value;
  return { y, m, day };
};

export const startOfJalaliMonth = (date: Date) => {
  let d = startOfDate(date, "day");
  while (getJalaliParts(d).day !== 1) {
    d = addToDate(d, -1, "day");
  }
  return d;
};

export const seedDatesPersianMonth = (startDate: Date, endDate: Date) => {
  const out: Date[] = [];
  let d = startOfJalaliMonth(startDate);
  out.push(d);
  while (d < endDate) {
    let next = addToDate(d, 1, "day");
    while (getJalaliParts(next).day !== 1) {
      next = addToDate(next, 1, "day");
    }
    out.push(next);
    d = next;
  }
  return out;
};

export function padDatesByLastStep(dates: Date[], howMany = 1): Date[] {
  if (!dates?.length || howMany <= 0) return dates;
  const n = dates.length;
  const step =
    n > 1 ? dates[n - 1].getTime() - dates[n - 2].getTime() : 365 * 24 * 3600 * 1000; 
  const out = dates.slice();
  for (let k = 0; k < howMany; k++) {
    const nextTs = out[out.length - 1].getTime() + step;
    const next = new Date(nextTs);
    if (next.getTime() === out[out.length - 1].getTime()) {
      next.setTime(next.getTime() + 1);
    }
    out.push(next);
  }
  return out;
}