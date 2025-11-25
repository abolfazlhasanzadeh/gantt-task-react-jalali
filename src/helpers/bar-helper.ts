import { RtlFixBar, Task } from "../types/public-types";
import { BarTask, TaskTypeInternal } from "../types/bar-task";
import { BarMoveAction } from "../types/gantt-task-actions";

const MS_DAY = 24 * 60 * 60 * 1000;

const uniqueAsc = (dates: Date[]) => {
  const seen = new Set<number>();
  return dates
    .slice()
    .sort((a, b) => a.getTime() - b.getTime())
    .filter(d => {
      const t = d.getTime();
      if (seen.has(t)) return false; 
      seen.add(t);
      return true;
    });
};

const median = (xs: number[]) => {
  if (xs.length === 0) return 0;
  const s = xs.slice().sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};

const stepDays = (dates: Date[]) => {
  const ds = uniqueAsc(dates);
  if (ds.length < 2) return 0;
  const diffs = [];
  for (let i = 1; i < ds.length; i++) {
    diffs.push(ds[i].getTime() - ds[i - 1].getTime());
  }
  return Math.round(median(diffs) / MS_DAY);
};

export const isYearlyGrid = (dates: Date[]) => {
  const d = stepDays(dates);
  return d >= 330; 
};

export const isMonthlyGrid = (dates: Date[]) => {
  const d = stepDays(dates);
  return d >= 27 && d <= 33;
};

export const isWeeklyGrid = (dates: Date[]) => {
  const d = stepDays(dates);
  return d >= 6 && d <= 8;
};

export const isDailyGrid = (dates: Date[]) => {
  const d = stepDays(dates);
  return d >= 1 && d <= 1; 
};

export const isQuarterlyGrid = (dates: Date[]) => {
  const d = stepDays(dates);
  return d >= 80 && d <= 100;
};


export const convertToBarTasks = (
  tasks: Task[],
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  rtl: boolean,
  barProgressColor: string,
  barProgressSelectedColor: string,
  barBackgroundColor: string,
  barBackgroundSelectedColor: string,
  projectProgressColor: string,
  projectProgressSelectedColor: string,
  projectBackgroundColor: string,
  projectBackgroundSelectedColor: string,
  milestoneBackgroundColor: string,
  milestoneBackgroundSelectedColor: string,
  RtlFixBar?: RtlFixBar
) => {
  let barTasks = tasks.map((t, i) => {
    return convertToBarTask(
      t,
      i,
      dates,
      columnWidth,
      rowHeight,
      taskHeight,
      barCornerRadius,
      handleWidth,
      rtl,
      barProgressColor,
      barProgressSelectedColor,
      barBackgroundColor,
      barBackgroundSelectedColor,
      projectProgressColor,
      projectProgressSelectedColor,
      projectBackgroundColor,
      projectBackgroundSelectedColor,
      milestoneBackgroundColor,
      milestoneBackgroundSelectedColor,
      RtlFixBar
    );
  });

  // set dependencies
  barTasks = barTasks.map(task => {
    const dependencies = task.dependencies || [];
    for (let j = 0; j < dependencies.length; j++) {
      const dependence = barTasks.findIndex(
        value => value.id === dependencies[j]
      );
      if (dependence !== -1) barTasks[dependence].barChildren.push(task);
    }
    return task;
  });

  return barTasks;
};

const convertToBarTask = (
  task: Task,
  index: number,
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  rtl: boolean,
  barProgressColor: string,
  barProgressSelectedColor: string,
  barBackgroundColor: string,
  barBackgroundSelectedColor: string,
  projectProgressColor: string,
  projectProgressSelectedColor: string,
  projectBackgroundColor: string,
  projectBackgroundSelectedColor: string,
  milestoneBackgroundColor: string,
  milestoneBackgroundSelectedColor: string,
  RtlFixBar?: RtlFixBar
): BarTask => {
  let barTask: BarTask;
  switch (task.type) {
    case "milestone":
      barTask = convertToMilestone(
        task,
        index,
        dates,
        columnWidth,
        rowHeight,
        taskHeight,
        barCornerRadius,
        handleWidth,
        milestoneBackgroundColor,
        milestoneBackgroundSelectedColor,
        RtlFixBar
      );
      break;
    case "project":
      barTask = convertToBar(
        task,
        index,
        dates,
        columnWidth,
        rowHeight,
        taskHeight,
        barCornerRadius,
        handleWidth,
        rtl,
        projectProgressColor,
        projectProgressSelectedColor,
        projectBackgroundColor,
        projectBackgroundSelectedColor
      );
      break;
    default:
      barTask = convertToBar(
        task,
        index,
        dates,
        columnWidth,
        rowHeight,
        taskHeight,
        barCornerRadius,
        handleWidth,
        rtl,
        barProgressColor,
        barProgressSelectedColor,
        barBackgroundColor,
        barBackgroundSelectedColor,
        RtlFixBar
      );
      break;
  }
  return barTask;
};

const convertToBar = (
  task: Task,
  index: number,
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  rtl: boolean,
  barProgressColor: string,
  barProgressSelectedColor: string,
  barBackgroundColor: string,
  barBackgroundSelectedColor: string,
  RtlFixBar?: RtlFixBar
): BarTask => {
  let x1: number;
  let x2: number;
  if (rtl) {
    x2 = taskXCoordinateRTL(task.start, dates, columnWidth, RtlFixBar);    
    x1 = taskXCoordinateRTL(task.end, dates, columnWidth, RtlFixBar);
  } else {
    x1 = taskXCoordinateRTL(task.start, dates, columnWidth, RtlFixBar);
    x2 = taskXCoordinateRTL(task.end, dates, columnWidth, RtlFixBar);
  }
  let typeInternal: TaskTypeInternal = task.type;
  if (typeInternal === "task" && x2 - x1 < handleWidth * 2) {
    typeInternal = "smalltask";
    x2 = x1 + handleWidth * 2;
  }

  const [progressWidth, progressX] = progressWithByParams(
    x1,
    x2,
    task.progress,
    rtl
  );
  const y = taskYCoordinate(index, rowHeight, taskHeight);
  const hideChildren = task.type === "project" ? task.hideChildren : undefined;

  const styles = {
    backgroundColor: barBackgroundColor,
    backgroundSelectedColor: barBackgroundSelectedColor,
    progressColor: barProgressColor,
    progressSelectedColor: barProgressSelectedColor,
    ...task.styles,
  };
  return {
    ...task,
    typeInternal,
    x1,
    x2,
    y,
    index,
    progressX,
    progressWidth,
    barCornerRadius,
    handleWidth,
    hideChildren,
    height: taskHeight,
    barChildren: [],
    styles,
  };
};

const convertToMilestone = (
  task: Task,
  index: number,
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  milestoneBackgroundColor: string,
  milestoneBackgroundSelectedColor: string,
  RtlFixBar?: RtlFixBar
): BarTask => {

const MONTHLY_RTL_FIX = RtlFixBar?.Mmonthly ?? 85;
const YEARLY_RTL_FIX = RtlFixBar?.Myearly ?? 308;
const WEEKLY_RTL_FIX = RtlFixBar?.Mweekly ?? 230;
const QUARTER_RTL_FIX = RtlFixBar?.Mquarter ?? 308;
const x =
      isMonthlyGrid(dates)
        ? taskXCoordinate(task.start, dates, columnWidth) + columnWidth - MONTHLY_RTL_FIX
        : isWeeklyGrid(dates)
          ? taskXCoordinate(task.start, dates, columnWidth) + columnWidth - WEEKLY_RTL_FIX
          : isYearlyGrid(dates)
            ? taskXCoordinate(task.start, dates, columnWidth) + columnWidth - YEARLY_RTL_FIX
            : isQuarterlyGrid(dates) 
              ? taskXCoordinate(task.start, dates, columnWidth) + columnWidth - QUARTER_RTL_FIX
              : taskXCoordinate(task.start, dates, columnWidth) + columnWidth
    

const y = taskYCoordinate(index, rowHeight, taskHeight);

  const x1 = x - taskHeight * 0.5;
  const x2 = x + taskHeight * 0.5;

  const rotatedHeight = taskHeight / 1.414;
  const styles = {
    backgroundColor: milestoneBackgroundColor,
    backgroundSelectedColor: milestoneBackgroundSelectedColor,
    progressColor: "",
    progressSelectedColor: "",
    ...task.styles,
  };
  return {
    ...task,
    end: task.start,
    x1,
    x2,
    y,
    index,
    progressX: 0,
    progressWidth: 0,
    barCornerRadius,
    handleWidth,
    typeInternal: task.type,
    progress: 0,
    height: rotatedHeight,
    hideChildren: undefined,
    barChildren: [],
    styles,
  };
};

  const taskXCoordinate = (
    xDate: Date,
    dates: Date[],
    columnWidth: number,
    rtl = false
  ) => {
    if (!dates || dates.length < 2) return 0;

    const asc = dates[0].getTime() <= dates[dates.length - 1].getTime();
    const ds = asc ? dates : [...dates].reverse();

    const t = xDate.getTime();

    if (t <= ds[0].getTime()) {
      const x = 0;
      const total = (ds.length - 1) * columnWidth;
      return rtl ? total - x : x;
    }
    if (t >= ds[ds.length - 1].getTime()) {
      const x = (ds.length - 1) * columnWidth;
      const total = (ds.length - 1) * columnWidth;
      return rtl ? total - x : x;
    }

    let i = ds.findIndex(d => d.getTime() > t) - 1; 
    i = Math.max(0, Math.min(ds.length - 2, i));

    const t0 = ds[i].getTime();
    const t1 = ds[i + 1].getTime();
    const percent = (t - t0) / Math.max(1, (t1 - t0));
    let x = i * columnWidth + percent * columnWidth;

    const total = (ds.length - 1) * columnWidth;
    if (!asc) x = total - x;   
    if (rtl) x = total - x;  

    return x;
  };
const taskXCoordinateRTL = (
  xDate: Date,
  dates: Date[],
  columnWidth: number,
  RtlFixBar?: RtlFixBar
) => {
  const x = taskXCoordinate(xDate, dates, columnWidth);
  const MONTHLY_RTL_FIX = RtlFixBar?.monthly ?? 85; 
  const YEARLY_RTL_FIX = RtlFixBar?.yearly ?? 288;
  const WEEKLY_RTL_FIX = RtlFixBar?.weekly ?? 230
  const QUARTERLY_RTL_FIX = (RtlFixBar?.quarter ?? RtlFixBar?.Mquarter) ?? 308;
return isMonthlyGrid(dates)
  ? (x + columnWidth - MONTHLY_RTL_FIX)
  : isWeeklyGrid(dates)
  ? (x + columnWidth - WEEKLY_RTL_FIX)
  : isQuarterlyGrid(dates)                      
  ? (x + columnWidth - QUARTERLY_RTL_FIX)
  : isYearlyGrid(dates)
  ? (x + columnWidth - YEARLY_RTL_FIX)
  : (x + columnWidth);
};
const taskYCoordinate = (
  index: number,
  rowHeight: number,
  taskHeight: number
) => {
  const y = index * rowHeight + (rowHeight - taskHeight) / 2;
  return y;
};

export const progressWithByParams = (
  taskX1: number,
  taskX2: number,
  progress: number,
  rtl: boolean
) => {
  const progressWidth = (taskX2 - taskX1) * progress * 0.01;
  let progressX: number;
  if (rtl) {
    progressX = taskX2 - progressWidth;
  } else {
    progressX = taskX1;
  }
  return [progressWidth, progressX];
};

export const progressByProgressWidth = (
  progressWidth: number,
  barTask: BarTask
) => {
  const barWidth = barTask.x2 - barTask.x1;
  const progressPercent = Math.round((progressWidth * 100) / barWidth);
  if (progressPercent >= 100) return 100;
  else if (progressPercent <= 0) return 0;
  else return progressPercent;
};

const progressByX = (x: number, task: BarTask) => {
  if (x >= task.x2) return 100;
  else if (x <= task.x1) return 0;
  else {
    const barWidth = task.x2 - task.x1;
    const progressPercent = Math.round(((x - task.x1) * 100) / barWidth);
    return progressPercent;
  }
};
const progressByXRTL = (x: number, task: BarTask) => {
  if (x >= task.x2) return 0;
  else if (x <= task.x1) return 100;
  else {
    const barWidth = task.x2 - task.x1;
    const progressPercent = Math.round(((task.x2 - x) * 100) / barWidth);
    return progressPercent;
  }
};

export const getProgressPoint = (
  progressX: number,
  taskY: number,
  taskHeight: number
) => {
  const point = [
    progressX - 5,
    taskY + taskHeight,
    progressX + 5,
    taskY + taskHeight,
    progressX,
    taskY + taskHeight - 8.66,
  ];
  return point.join(",");
};

const startByX = (x: number, xStep: number, task: BarTask) => {
  if (x >= task.x2 - task.handleWidth * 2) {
    x = task.x2 - task.handleWidth * 2;
  }
  const steps = Math.round((x - task.x1) / xStep);
  const additionalXValue = steps * xStep;
  const newX = task.x1 + additionalXValue;
  return newX;
};

const endByX = (x: number, xStep: number, task: BarTask) => {
  if (x <= task.x1 + task.handleWidth * 2) {
    x = task.x1 + task.handleWidth * 2;
  }
  const steps = Math.round((x - task.x2) / xStep);
  const additionalXValue = steps * xStep;
  const newX = task.x2 + additionalXValue;
  return newX;
};

const moveByX = (x: number, xStep: number, task: BarTask) => {
  const steps = Math.round((x - task.x1) / xStep);
  const additionalXValue = steps * xStep;
  const newX1 = task.x1 + additionalXValue;
  const newX2 = newX1 + task.x2 - task.x1;
  return [newX1, newX2];
};


const dateByX = (
  x: number,
  taskX: number,
  taskDate: Date,
  xStep: number,
  timeStep: number,
  rtl = false
) => {
  if (!Number.isFinite(xStep) || xStep === 0) return new Date(taskDate);

  const deltaMs = ((x - taskX) / xStep) * timeStep;

  const ms = taskDate.getTime() + (rtl ? -deltaMs : deltaMs);

  const newDate = new Date(ms);
  const offsetDiffMin =
    newDate.getTimezoneOffset() - taskDate.getTimezoneOffset();

  return new Date(newDate.getTime() + offsetDiffMin * 60000);
};

/**
 * Method handles event in real time(mousemove) and on finish(mouseup)
 */
export const handleTaskBySVGMouseEvent = (
  svgX: number,
  action: BarMoveAction,
  selectedTask: BarTask,
  xStep: number,
  timeStep: number,
  initEventX1Delta: number,
  rtl: boolean
): { isChanged: boolean; changedTask: BarTask } => {
  let result: { isChanged: boolean; changedTask: BarTask };
  switch (selectedTask.type) {
    case "milestone":
      result = handleTaskBySVGMouseEventForMilestone(
        svgX,
        action,
        selectedTask,
        xStep,
        timeStep,
        initEventX1Delta,
        rtl
      );
      break;
    default:
      result = handleTaskBySVGMouseEventForBar(
        svgX,
        action,
        selectedTask,
        xStep,
        timeStep,
        initEventX1Delta,
        rtl
      );
      break;
  }
  return result;
};

const handleTaskBySVGMouseEventForBar = (
  svgX: number,
  action: BarMoveAction,
  selectedTask: BarTask,
  xStep: number,
  timeStep: number,
  initEventX1Delta: number,
  rtl: boolean
): { isChanged: boolean; changedTask: BarTask } => {
  const changedTask: BarTask = { ...selectedTask };
  let isChanged = false;
  switch (action) {
    case "progress":
      if (rtl) {
        changedTask.progress = progressByXRTL(svgX, selectedTask);
      } else {
        changedTask.progress = progressByX(svgX, selectedTask);
      }
      isChanged = changedTask.progress !== selectedTask.progress;
      if (isChanged) {
        const [progressWidth, progressX] = progressWithByParams(
          changedTask.x1,
          changedTask.x2,
          changedTask.progress,
          rtl
        );
        changedTask.progressWidth = progressWidth;
        changedTask.progressX = progressX;
      }
      break;
    case "start": {
      const newX1 = startByX(svgX, xStep, selectedTask);
      changedTask.x1 = newX1;
      isChanged = changedTask.x1 !== selectedTask.x1;
      if (isChanged) {
        if (rtl) {
          changedTask.end = dateByX(
            newX1,
            selectedTask.x1,
            selectedTask.end,
            xStep,
            timeStep,
            true
          );
        } else {
          changedTask.start = dateByX(
            newX1,
            selectedTask.x1,
            selectedTask.start,
            xStep,
            timeStep,
            false
          );
        }
        const [progressWidth, progressX] = progressWithByParams(
          changedTask.x1,
          changedTask.x2,
          changedTask.progress,
          rtl
        );
        changedTask.progressWidth = progressWidth;
        changedTask.progressX = progressX;
      }
      break;
    }
    case "end": {
      const newX2 = endByX(svgX, xStep, selectedTask);
      changedTask.x2 = newX2;
      isChanged = changedTask.x2 !== selectedTask.x2;
      if (isChanged) {
        if (rtl) {
          changedTask.start = dateByX(
            newX2,
            selectedTask.x2,
            selectedTask.start,
            xStep,
            timeStep,
            true
          );
        } else {
          changedTask.end = dateByX(
            newX2,
            selectedTask.x2,
            selectedTask.end,
            xStep,
            timeStep,
            false
          );
        }
        const [progressWidth, progressX] = progressWithByParams(
          changedTask.x1,
          changedTask.x2,
          changedTask.progress,
          rtl
        );
        changedTask.progressWidth = progressWidth;
        changedTask.progressX = progressX;
      }
      break;
    }
    case "move": {
      const [newMoveX1, newMoveX2] = moveByX(
        svgX - initEventX1Delta,
        xStep,
        selectedTask
      );
      isChanged = newMoveX1 !== selectedTask.x1;
      if (isChanged) {
        changedTask.start = dateByX(
          newMoveX1,
          selectedTask.x1,
          selectedTask.start,
          xStep,
          timeStep,
          rtl
        );
        changedTask.end = dateByX(
          newMoveX2,
          selectedTask.x2,
          selectedTask.end,
          xStep,
          timeStep,
          rtl
        );
        changedTask.x1 = newMoveX1;
        changedTask.x2 = newMoveX2;
        const [progressWidth, progressX] = progressWithByParams(
          changedTask.x1,
          changedTask.x2,
          changedTask.progress,
          rtl
        );
        changedTask.progressWidth = progressWidth;
        changedTask.progressX = progressX;
      }
      break;
    }
  }
  return { isChanged, changedTask };
};

const handleTaskBySVGMouseEventForMilestone = (
  svgX: number,
  action: BarMoveAction,
  selectedTask: BarTask,
  xStep: number,
  timeStep: number,
  initEventX1Delta: number,
  rtl: any
): { isChanged: boolean; changedTask: BarTask } => {
  const changedTask: BarTask = { ...selectedTask };
  let isChanged = false;
  switch (action) {
    case "move": {
      const [newMoveX1, newMoveX2] = moveByX(
        svgX - initEventX1Delta,
        xStep,
        selectedTask
      );
      isChanged = newMoveX1 !== selectedTask.x1;
      if (isChanged) {
        changedTask.start = dateByX(
          newMoveX1,
          selectedTask.x1,
          selectedTask.start,
          xStep,
          timeStep,
          rtl
        );
        changedTask.end = changedTask.start;
        changedTask.x1 = newMoveX1;
        changedTask.x2 = newMoveX2;
      }
      break;
    }
  }
  return { isChanged, changedTask };
};
