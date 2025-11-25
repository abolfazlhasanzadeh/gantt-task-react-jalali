import React, { useEffect, useMemo, useRef, useState } from "react";
import { INFO_ICON_PATH } from "../../../icons/InfoIcon";

type TooltipCtx = { name: string; start?: string | Date; end?: string | Date; progress?: number | null | undefined };

export type TaskBarMetaProps = {
  xLabel: number;     // X لیبل اصلی
  y: number;          // Y وسط سطر (y + taskHeight/2)
  rtl: boolean;

  name: string;
  start?: string | Date;
  end?: string | Date;
  progress?: number | null;

  showPercent?: boolean;                 // default: true
  showDonut?: boolean;                   // default: true
  tooltip?: string[] | ((ctx: TooltipCtx) => string[]);

  donutRadius?: number;                  // default: 10
  donutStroke?: number;                  // default: 4
  gapX?: number;                         // فاصله از لیبل؛ default: 12
  itemGap?: number;                      // فاصله بین آیتم‌ها؛ default: 10
  numberLocale?: string;                 // default: "fa-IR"
  trackColor?: string;                   // default: "#c9c9c9"
  arcColor?: string;                     // default: "#4b5563"
  percentColor?: string;                 // default: "#374151"

  showInfoIcon?: boolean;                // default: inferred from tooltip
  infoIconSize?: number;                 // default: 14
  infoIconColor?: string;                // default: "#6B7280"

  tooltipBg?: string;                    // default: "#111827"
  tooltipBgOpacity?: number;             // default: 0.95
  tooltipStroke?: string;                // default: "#FFFFFF"
  tooltipStrokeOpacity?: number;         // default: 0.08
  tooltipTextColor?: string;             // default: "#fff"

  bgEnabled?: boolean;                   // default: true
  bgFill?: string;                       // default: "#fff"
  bgOpacity?: number;                    // default: 0.95
  bgStroke?: string;                     // default: "#ccc"
  bgStrokeOpacity?: number;              // default: 1
  bgStrokeWidth?: number;                // default: 1
  bgPadX?: number;                       // default: 8
  bgPadY?: number;                       // default: 6
  bgRadius?: number;                     // default: pill (height/2)

  isInside?: boolean;                    // default: false → اگر true شد، حول xLabel سنتر می‌کنیم
  outsideExtraGap?: number;              // default: 8 → وقتی بیرون است، به gapX اضافه می‌شود
  deadline?: Date;          // اگر پروژه تاخیر داره
  projectDelayLabel?: string; 
};

const clampPct = (v: number | null | undefined) =>
  v == null ? null : Math.max(0, Math.min(100, v));

/* ---------- Donut ---------- */
function DonutProgress({
  x, y, r, stroke, progress, trackColor, arcColor,
}: {
  x: number; y: number; r: number; stroke: number;
  progress: number | null;
  trackColor: string; arcColor: string;
}) {
  const pct = clampPct(progress);
  const C = 2 * Math.PI * r;
  const dash = pct == null ? `0 ${C}` : `${(pct / 100) * C} ${C}`;
  return (
    <g transform={`translate(${x}, ${y}) rotate(-90)`} style={{ pointerEvents: "none" }}>
      <circle r={r} cx="0" cy="0" fill="none" stroke={trackColor} strokeWidth={stroke} />
      <circle r={r} cx="0" cy="0" fill="none" stroke={arcColor} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={dash} />
    </g>
  );
}

/* ---------- Percent ---------- */
function PercentText({
  x, y, rtl, text, color, onWidth,
}: {
  x: number; y: number; rtl: boolean; text: string; color: string;
  onWidth?: (w: number) => void;
}) {
  const ref = useRef<SVGTextElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const w = ref.current.getBBox().width;
    onWidth?.(w);
  }, [text]);
  if (!text) return null;
  return (
    <text
      ref={ref}
      x={x}
      y={y}
      textAnchor={rtl ? "end" : "start"}
      dominantBaseline="middle"
      fontSize="12"
      fontWeight={600}
      fill={color}
      style={{ pointerEvents: "none" }}
    >
      {text}
    </text>
  );
}

/* ---------- Info + Tooltip ---------- */
function InfoIconTip({
  x, y, size, color, rtl, lines,
  bg, bgOpacity, stroke, strokeOpacity, textColor,
  anchorHeight,
}: {
  x: number; y: number; size: number; color: string; rtl: boolean;
  lines: string[];
  bg: string; bgOpacity: number; stroke: string; strokeOpacity: number; textColor: string;
  anchorHeight: number;
}) {
  const [open, setOpen] = useState(false);
  const tipW = useMemo(() => {
    const longest = lines.reduce((a, b) => (a.length > b.length ? a : b), "");
    return Math.max(120, longest.length * 7 + 16);
  }, [lines]);
  const tipH = lines.length * 14 + 8;
  const tipDX = rtl ? -(tipW + 8) : 8;
  const tipDY = -(anchorHeight + 12);

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={{ cursor: lines.length ? "pointer" : "default" }}
    >
      {/* hitbox */}
      <rect
        x={-size / 2 - 4}
        y={-size / 2 - 4}
        width={size + 8}
        height={size + 8}
        fill="transparent"
      />
      <svg x={-size / 2 - 4}
        y={-size / 2 - 1} width={size} height={size} viewBox="0 0 12 12" fill={color} aria-hidden="true">
        <path d={INFO_ICON_PATH} />
      </svg>

      {lines.length > 0 && (
        <g className="tooltip-addon" transform={`translate(${tipDX}, ${tipDY})`} style={{ display: open ? "block" : "none" }}>
          <rect
            x="0" y="0" rx="6"
            width={tipW} height={tipH}
            fill={bg} fillOpacity={bgOpacity}
                        textAnchor={rtl ? "end" : "start"} // 👈 مهم
  direction={rtl ? "rtl" : "ltr"}  
            stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth={1}
          />
          <text x="8" y="14" fill={textColor} fontSize="11" fontWeight={500}
            textAnchor={rtl ? "end" : "start"} // 👈 مهم
  direction={rtl ? "rtl" : "ltr"}  
                style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system" }}>
            {lines.map((ln, i) => (
              <tspan key={i} x="8" y={14 + i * 14}>{ln}</tspan>
            ))}
          </text>
        </g>
      )}
    </g>
  );
}

export default function TaskBarMeta(props: TaskBarMetaProps) {
  const {
    xLabel, y, rtl,
    name, start, end, progress,

    showPercent = true,
    showDonut = true,
    tooltip,

    donutRadius = 10,
    donutStroke = 4,
    gapX = 5,
    itemGap = 10,
    numberLocale = "fa-IR",
    trackColor = "#c9c9c9",
    arcColor = "#4b5563",
    percentColor = "#374151",

    showInfoIcon,
    infoIconSize = 14,
    infoIconColor = "#6B7280",

    tooltipBg = "#111827",
    tooltipBgOpacity = 0.95,
    tooltipStroke = "#FFFFFF",
    tooltipStrokeOpacity = 0.08,
    tooltipTextColor = "#fff",

    // بک‌گراند
    bgEnabled = true,
    bgFill = "#fff",
    bgOpacity = 0.95,
    bgStroke = "#ccc",
    bgStrokeOpacity = 1,
    bgStrokeWidth = 1,
    bgPadX = 8,
    bgPadY = 6,
    bgRadius,

    // هماهنگی inside/outside با لیبل
    isInside = false,
    outsideExtraGap = 3,
    deadline,
    projectDelayLabel = "تاخیر پروژه",
  } = props;

  const pct = clampPct(progress);
  const percentText =
    pct == null ? "" : `${new Intl.NumberFormat(numberLocale).format(Math.round(pct))}\u066A\u200C`;

  // خطوط تولتیپ
  const fmtDate = (v?: any) => {
    if (!v) return "";
    const d = v instanceof Date ? v : new Date(v);
    return isNaN(d as any) ? "" : d.toLocaleDateString("fa-IR", { year: "numeric", month: "2-digit", day: "2-digit" });
  };
  const defaultLines = [
    name || "",
    start ? `شروع: ${fmtDate(start)}` : "",
    end   ? `پایان: ${fmtDate(end)}` : "",
    pct != null ? `پیشرفت: ${Math.round(pct)}%` : "",
  ].filter(Boolean);
  const lines = useMemo(() => {
    if (!tooltip) return defaultLines;
    if (Array.isArray(tooltip)) return tooltip.filter(Boolean);
    const out = tooltip({ name, start, end, progress: pct });
    return Array.isArray(out) ? out.filter(Boolean) : defaultLines;
  }, [tooltip, name, start, end, pct]);

  const hasTooltip = lines.length > 0;
  const showInfo = (showInfoIcon ?? hasTooltip) && hasTooltip;

  // layout افقی
  const diameter = donutRadius * 2;
  const anchorHeight = Math.max(20, diameter, infoIconSize);
  const [percentW, setPercentW] = useState(0);

  // عرض آیتم‌ها
  const donutW = showDonut ? diameter : 0;
  const pctW = (showPercent && percentText) ? Math.max(percentW, 22) : 0;
  const infoW = showInfo ? infoIconSize : 0;

  const visibleCount = [donutW, pctW, infoW].filter(w => w > 0).length;
  const contentW = (donutW + pctW + infoW) + Math.max(0, visibleCount - 1) * itemGap;

  // اندازه‌های قرص
  const bgW = contentW + 2 * bgPadX;
  const bgH = anchorHeight + 2 * bgPadY;
  const pillRadius = bgRadius ?? (bgH / 2);

  // تعیین baseX: inside = سنتر روی xLabel, outside = فاصله از xLabel
  let baseX: number;
  if (isInside) {
    baseX = rtl ? (xLabel + contentW / 2) : (xLabel - contentW / 2);
  } else {
    baseX = rtl ? (xLabel - (outsideExtraGap)) : (xLabel + (gapX + outsideExtraGap));
  }

  // محلِ بک‌گراند نسبت به مبدا گروه
  const bgX = rtl ? (-contentW - bgPadX) : (-bgPadX);
  const bgY = -(anchorHeight / 2) - bgPadY;

  // چیدن آیتم‌ها
  let cursor = 0;
  const children: React.ReactNode[] = [];

  if (showDonut) {
    const x = cursor + (rtl ? -diameter / 2 : diameter / 2);
    children.push(
      <DonutProgress
        key="donut"
        x={x}
        y={0}
        r={donutRadius}
        stroke={donutStroke}
        progress={pct}
        trackColor={trackColor}
        arcColor={arcColor}
      />
    );
    cursor += (rtl ? -(diameter + itemGap) : (diameter + itemGap));
  }

  if (showPercent && percentText) {
    const x = cursor;
    children.push(
      <PercentText
        key="percent"
        x={x}
        y={0}
        rtl={rtl}
        text={percentText}
        color={percentColor}
        onWidth={w => setPercentW(w)}
      />
    );
    cursor += (rtl ? -(pctW + itemGap) : (pctW + itemGap));
  }

  if (showInfo) {
    const x = cursor;
    children.push(
      <InfoIconTip
        key="info"
        x={x}
        y={0}
        size={infoIconSize}
        color={infoIconColor}
        rtl={rtl}
        lines={lines}
        bg={tooltipBg}
        bgOpacity={tooltipBgOpacity}
        stroke={tooltipStroke}
        strokeOpacity={tooltipStrokeOpacity}
        textColor={tooltipTextColor}
        anchorHeight={anchorHeight}
      />
    );
  }

  const strip = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const toDate = (v?: string | Date) => {
    if (!v) return undefined;
    const d = v instanceof Date ? v : new Date(v);
    return Number.isNaN(d.getTime()) ? undefined : strip(d);
  };

  const endD = toDate(end);
  const deadlineD = toDate(deadline);

  // اگر بیرون projectDelayed داده شده باشد همان را می‌گیریم؛ وگرنه محاسبه
  const computedDelayed =
      !!endD && !!deadlineD ? endD.getTime() > deadlineD.getTime() : false;
    const delayLabelGap = 6;

      console.log(endD);
  console.log(deadlineD);
  
    let labelX = 0;
    let labelAnchor: "start" | "end" = "start";

    if (rtl) { labelX = bgX - delayLabelGap;        labelAnchor = "end"; }
      else     { labelX = bgX + bgW + delayLabelGap;  labelAnchor = "start"; }


  return (
    <g  transform={`translate(${baseX}, ${y})`} style={{ pointerEvents: "visiblePainted" }}>
      {bgEnabled && (
        <rect
          x={bgX}
          y={bgY}
          width={bgW}
          height={bgH}
          rx={pillRadius}
          fill={bgFill}
          fillOpacity={bgOpacity}
          stroke={bgStroke}
          strokeOpacity={bgStrokeOpacity}
          strokeWidth={bgStrokeWidth}
          style={{ pointerEvents: "none" }}
        />
      )}
      {computedDelayed && (
        <text
          x={labelX}
          y={0}                          // وسط عمودی قرص؛ اگر بخواهی بالای قرص باشد، بگذار y={bgY - 6}
          textAnchor={labelAnchor}
          dominantBaseline="middle"
          fontSize="11"
          fontWeight={700}
          fill="#DC2626"
          style={{ pointerEvents: "none" }}
        >
          {projectDelayLabel}
        </text>
        
      )}
      {children}
    </g>

  );
}
