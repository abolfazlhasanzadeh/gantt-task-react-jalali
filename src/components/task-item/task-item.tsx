import React, { useEffect, useRef, useState } from "react";
import { BarTask } from "../../types/bar-task";
import { GanttContentMoveAction } from "../../types/gantt-task-actions";
import { Bar } from "./bar/bar";
import { BarSmall } from "./bar/bar-small";
import { Milestone } from "./milestone/milestone";
import { Project } from "./project/project";
import TaskBarMeta from "./contentBar/TaskBarMeta";

type TooltipCtx = { name: string; start?: string | Date; end?: string | Date; progress?: number | null | undefined };

export type BarContentProps = {
  progress?: number | null;

  showPercent?: boolean;
  showDonut?: boolean;

  tooltip?: string[] | ((ctx: TooltipCtx) => string[]);

  donutRadius?: number;
  donutStroke?: number;
  gapX?: number;
  itemGap?: number;
  numberLocale?: string;
  trackColor?: string;
  arcColor?: string;
  percentColor?: string;

  showInfoIcon?: boolean;
  infoIconSize?: number;
  infoIconColor?: string;

  tooltipBg?: string;
  tooltipBgOpacity?: number;
  tooltipStroke?: string;
  tooltipStrokeOpacity?: number;
  tooltipTextColor?: string;

  // بک‌گراند قرص‌شکل
  bgEnabled?: boolean;
  bgFill?: string;
  bgOpacity?: number;
  bgStroke?: string;
  bgStrokeOpacity?: number;
  bgStrokeWidth?: number;
  bgPadX?: number;
  bgPadY?: number;
  bgRadius?: number;

  // فاصلهٔ اضافه وقتی بیرون از بار است
  outsideExtraGap?: number; // default در TaskBarMeta = 8
};

export type TaskItemProps = {
  task: BarTask;
  arrowIndent: number;
  taskHeight: number;
  isProgressChangeable: boolean;
  isDateChangeable: boolean;
  isDelete: boolean;
  isSelected: boolean;
  rtl: boolean;
  onEventStart: (
    action: GanttContentMoveAction,
    selectedTask: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent
  ) => any;
  barContent?: BarContentProps;
};

export const TaskItem: React.FC<TaskItemProps> = props => {
  const {
    task,
    arrowIndent,
    isDelete,
    taskHeight,
    isSelected,
    rtl,
    onEventStart,
    barContent,
  } = props;

  const labelTextRef = useRef<SVGTextElement>(null);
  const metaRef = useRef<SVGGElement>(null);
  const [taskItem, setTaskItem] = useState<JSX.Element>(<div />);
  const [isTextInside, setIsTextInside] = useState(true);

  const isMilestone =
  task.typeInternal === "milestone" || (task as any).type === "milestone";

  useEffect(() => {
    switch (task.typeInternal) {
      case "milestone":
        setTaskItem(<Milestone {...props} />);
        break;
      case "project":
        setTaskItem(<Project {...props} />);
        break;
      case "smalltask":
        setTaskItem(<BarSmall {...props} />);
        break;
      default:
        setTaskItem(<Bar {...props} />);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task, isSelected]);

useEffect(() => {
  if (labelTextRef.current) {
    const width = task.x2 - task.x1;
    const labelWidth = labelTextRef.current.getBBox().width;
    const inside = labelWidth + 80  < width;
    setIsTextInside(isMilestone ? false : inside);
  }
}, [task.x1, task.x2, task.name, isMilestone]);

  const getX = () => {
    const width = task.x2 - task.x1;
    const hasChild = task.barChildren.length > 0;
    if (isTextInside) {
      return task.x1 + width * 0.5;
    }
    if (rtl && labelTextRef.current) {
      return (
        task.x1 -
        labelTextRef.current.getBBox().width -
        arrowIndent * +hasChild -
        arrowIndent * 0.2
      );
    } else {
      return task.x1 + width + arrowIndent * +hasChild
    }
  };

  const xLabel = getX();
  const centerY = task.y + taskHeight * 0.5;
  
  return (
    <g
      onKeyDown={e => {
        switch (e.key) {
          case "Delete": {
            if (isDelete) onEventStart("delete", task, e);
            break;
          }
        }
        e.stopPropagation();
      }}
      onMouseEnter={e => {
        onEventStart("mouseenter", task, e);
      }}
      onMouseLeave={e => {
        onEventStart("mouseleave", task, e);
      }}
      onDoubleClick={e => {
        onEventStart("dblclick", task, e);
      }}
      onClick={e => {
        onEventStart("click", task, e);
      }}
      onFocus={() => {
        onEventStart("select", task);
      }}
    >
      {taskItem}

      <text
        x={xLabel}
        y={centerY}
        ref={labelTextRef}
        dominantBaseline="middle"
        textAnchor={isTextInside ? "middle" : (rtl ? "end" : "start")}
        style={{ opacity: 0, pointerEvents: "none" }}
      >
        {task.name}
      </text>

      {barContent && (
        <g ref={metaRef}>
        <TaskBarMeta
          
          xLabel={xLabel}
          y={centerY}
          rtl={rtl}
          name={task.name}
          start={(task as any).start}
          end={task.end}
          progress={task.progress}

          showPercent={barContent.showPercent}
          showDonut={barContent.showDonut}
          tooltip={barContent.tooltip}

          donutRadius={barContent.donutRadius}
          donutStroke={barContent.donutStroke}
          gapX={barContent.gapX}
          itemGap={barContent.itemGap}
          numberLocale={barContent.numberLocale}
          trackColor={barContent.trackColor}
          arcColor={barContent.arcColor}
          percentColor={barContent.percentColor}

          showInfoIcon={barContent.showInfoIcon}
          infoIconSize={barContent.infoIconSize}
          infoIconColor={barContent.infoIconColor}

          tooltipBg={barContent.tooltipBg}
          tooltipBgOpacity={barContent.tooltipBgOpacity}
          tooltipStroke={barContent.tooltipStroke}
          tooltipStrokeOpacity={barContent.tooltipStrokeOpacity}
          tooltipTextColor={barContent.tooltipTextColor}

          bgEnabled={barContent.bgEnabled}
          bgFill={barContent.bgFill}
          bgOpacity={barContent.bgOpacity}
          bgStroke={barContent.bgStroke}
          bgStrokeOpacity={barContent.bgStrokeOpacity}
          bgStrokeWidth={barContent.bgStrokeWidth}
          bgPadX={barContent.bgPadX}
          bgPadY={barContent.bgPadY}
          bgRadius={barContent.bgRadius}

          isInside={isTextInside}
          outsideExtraGap={barContent.outsideExtraGap ?? 5}
          deadline={task.deadline} 
          projectDelayLabel={`تاخیر پروژه `}
        />
        
        </g>
      )}
    </g>
  );
};
