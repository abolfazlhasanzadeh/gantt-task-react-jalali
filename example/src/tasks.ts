// Auto-generated from backend activities -> react-task-gantt Task[]
// All dates are real Date objects (not strings).
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Task } from "../../dist";

export type GanttTask = Task & { linkType?: "FS" | "SS" | "FF" | "SF"};

export const tasks: GanttTask[] = [
  { id: "5234939", name: "فرزند دوم", start: new Date(2025, 8, 29), end: new Date(2025, 9, 3), type: "task", progress: 0, project: "5225091", displayOrder: 5 },
  { id: "5219690", name: "1", start: new Date(2025, 8, 25), end: new Date(2025, 9, 3), type: "task", progress: 0, displayOrder: 1 },
  { id: "5234949", name: "پدرر نمونه 2", start: new Date(2025, 8, 29), end: new Date(2025, 9, 14), type: "task", progress: 0, project: "5225091", displayOrder: 6 },
  { id: "5225091", name: "پدرر نمونه", start: new Date(2025, 8, 29), end: new Date(2025, 9, 14), type: "project", progress: 0, displayOrder: 3 },
  { id: "5240879", name: "3.4 فرزند", start: new Date(2025, 8, 25), end: new Date(2025, 9, 2), type: "task", progress: 0, project: "5225091", displayOrder: 10 },
  { id: "5225105", name: "فرزند اول پدر نمونه", start: new Date(2025, 9, 9), end: new Date(2025, 9, 17), type: "task", progress: 0, project: "5225091", displayOrder: 4 },
  { id: "5240926", name: "فرزند 3.3.3", start: new Date(2025, 8, 25), end: new Date(2025, 8, 25), type: "milestone", progress: 0, project: "5225091", displayOrder: 9, dependencies: ["5234949"], linkType: "FS" },
  { id: "5219704", name: "2", start: new Date(2025, 9, 8), end: new Date(2025, 9, 15), type: "task", progress: 0, displayOrder: 2, dependencies: ["5225105"], linkType: "SS" },
  { id: "5234959", name: "فرزند اول پدرر نمونه 2", start: new Date(2025, 8, 29), end: new Date(2025, 9, 7), type: "task", progress: 34, project: "5225091", displayOrder: 7, dependencies: ["5234949"], linkType: "FS" },
  { id: "5234971", name: "فرزند دوم پدرر نمونه 2", start: new Date(2025, 8, 29), end: new Date(2025, 9, 2), type: "task", progress: 33, project: "5225091", displayOrder: 8, dependencies: ["5234949"], linkType: "FS" },
  { id: "-1", name: "شروع", start: new Date(2025, 8, 25), end: new Date(2025, 8, 25), type: "milestone", progress: 0, displayOrder: 12 },
  { id: "-2", name: "پایان", end: new Date(2025, 9, 17), type: "milestone", progress: 0, displayOrder: 11 }
];
