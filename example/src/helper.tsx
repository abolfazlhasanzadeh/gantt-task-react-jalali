import { Task } from "../../dist/types/public-types";

export function initTasks() {
  // const currentDate = new Date();
  // const tasks: Task[] = [
  //   {
  //     start: new Date(currentDate.getFullYear(), currentDate.getMonth(), -8),
  //     end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
  //     name: "Some Project",
  //     id: "ProjectSample",
  //     progress: 25,
  //     type: "project",
  //     hideChildren: false,
  //     displayOrder: 1,
  //   },
  //   {
  //     start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
  //     end: new Date(
  //       currentDate.getFullYear(),
  //       currentDate.getMonth(),
  //       2,
  //       12,
  //       28
  //     ),
  //     name: "Idea",
  //     id: "Task 0",
  //     progress: 45,
  //     type: "task",
  //     project: "ProjectSample",
  //     displayOrder: 2,
  //   },
  //   {
  //     start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
  //     end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
  //     name: "Research",
  //     id: "Task 1",
  //     progress: 25,
  //     dependencies: ["Task 0"],
  //     linkType: "FS",
  //     type: "task",
  //     project: "ProjectSample",
  //     displayOrder: 3,
  //   },
  //   {
  //     start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
  //     end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
  //     name: "Discussion with team",
  //     id: "Task 2",
  //     progress: 10,
  //     dependencies: ["Task 1"],
  //     type: "task",
  //     project: "ProjectSample",
  //     displayOrder: 4,
  //   },
  //   {
  //     start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
  //     end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
  //     name: "Developing",
  //     id: "Task 3",
  //     progress: 2,
  //     dependencies: ["Task 2"],
  //     type: "task",
  //     project: "ProjectSample",
  //     displayOrder: 5,
  //   },
  //   {
  //     start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
  //     end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
  //     name: "Review",
  //     id: "Task 4",
  //     type: "task",
  //     progress: 70,
  //     dependencies: ["Task 2"],
  //     project: "ProjectSample",
  //     displayOrder: 6,
  //   },
  //   {
  //     start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
  //     end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
  //     name: "Release",
  //     id: "Task 6",
  //     progress: currentDate.getMonth(),
  //     type: "milestone",
  //     dependencies: ["Task 4"],
  //     project: "ProjectSample",
  //     displayOrder: 7,
  //   },
  //   {
  //     start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
  //     end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
  //     name: "Party Time",
  //     id: "Task 9",
  //     progress: 0,
  //     isDisabled: true,
  //     type: "task",
  //   },
  // ];



const currentDate = new Date();

 const tasks: Task[] = [
  // ===== Project: 3 =====
  {
    id: "5225091",
    name: "1",
    type: "project",
    progress: 0,
    // 2025-09-29 -> month Oct (9), day -1
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), -1),
    // 2025-10-14 -> day 14
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 14),
    displayOrder: 1,
  },

  // ===== WBS: 1 =====
  {
    id: "5219690",
    name: "1",
    type: "task",
    progress: 0,
    // 2025-09-25 -> day -5
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), -5),
    // 2025-10-03 -> day 3
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 3),
    displayOrder: 2,
  },

  // ===== WBS: 2 =====
  {
    id: "5219704",
    name: "2",
    type: "task",
    progress: 0,
    // 2025-10-08 -> day 8
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
    // 2025-10-15 -> day 15
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
    displayOrder: 3,
    // از رابطه START_START با 5225105 (lag: -1)
    dependencies: ["5225105"],
    linkType: "SS",
  },

  // ===== WBS: 3.1 =====
  {
    id: "5225105",
    name: "فرزند اول پدر نمونه",
    type: "task",
    progress: 0,
    // parent: 3
    project: "5225091",
    // 2025-10-09 -> day 9
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9),
    // 2025-10-17 -> day 17
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 17),
    displayOrder: 4,
  },

  // ===== WBS: 3.2 =====
  {
    id: "5234939",
    name: "فرزند دوم",
    type: "task",
    progress: 0,
    project: "5225091",
    // 2025-09-29 -> -1
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), -1),
    // 2025-10-03 -> 3
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 3),
    displayOrder: 5,
  },

  // ===== WBS: 3.3 (پدرر نمونه 2) =====
  {
    id: "5234949",
    name: "پدرر نمونه 2",
    type: "task",
    progress: 0,
    project: "5225091",
    // 2025-09-29 -> -1
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), -1),
    // 2025-10-14 -> 14
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 14),
    displayOrder: 6,
  },

  // ===== WBS: 3.3.1 =====
  {
    id: "5234959",
    name: "فرزند اول پدرر نمونه 2",
    type: "task",
    progress: 34,
    project: "5225091",
    // 2025-09-29 -> -1
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), -1),
    // 2025-10-07 -> 7
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 7),
    displayOrder: 7,
    // از FS با 5234949
    dependencies: ["5234949"],
    linkType: "FS",
  },

  // ===== WBS: 3.3.2 =====
  {
    id: "5234971",
    name: "فرزند دوم پدرر نمونه 2",
    type: "task",
    progress: 33,
    project: "5225091",
    // 2025-09-29 -> -1
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), -1),
    // 2025-10-02 -> 2
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
    displayOrder: 8,
    // از FS با 5234949
    dependencies: ["5234949"],
    linkType: "FS",
  },

  // ===== WBS: 3.3.3 (milestone) =====
  {
    id: "5240926",
    name: "فرزند 3.3.3",
    type: "milestone",
    progress: 0,
    project: "5225091",
    // 2025-09-25 -> -5
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), -5),
    // برای milestone بهتره start=end
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), -5),
    displayOrder: 9,
    // از FS با 5234949
    dependencies: ["5234949"],
    linkType: "FS",
  },

  // ===== WBS: 3.4 =====
  {
    id: "5240879",
    name: "3.4 فرزند",
    type: "task",
    progress: 0,
    project: "5225091",
    // 2025-09-25 -> -5
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), -5),
    // 2025-10-02 -> 2
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
    displayOrder: 10,
  },

  // ===== START (milestone) =====
  // {
  //   id: "-1",
  //   name: "شروع",
  //   type: "milestone",
  //   progress: 0,
  //   // 2025-09-25 -> -5
  //   start: new Date(currentDate.getFullYear(), currentDate.getMonth(), -5),
  //   end: new Date(currentDate.getFullYear(), currentDate.getMonth(), -5),
  //   displayOrder: 11,
  // },

  // ===== END (milestone) =====
  {
    id: "-2",
    name: "پایان پروژه",
    type: "milestone",
    progress: 0,
    // 2025-10-17 -> 17
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 17),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 17),
    displayOrder: 12,
  },
];
  return tasks;
}

export function getStartEndDateForProject(tasks: Task[], projectId: string) {
  const projectTasks = tasks.filter(t => t.project === projectId);
  let start = projectTasks[0].start;
  let end = projectTasks[0].end;

  for (let i = 0; i < projectTasks.length; i++) {
    const task = projectTasks[i];
    if (start.getTime() > task.start.getTime()) {
      start = task.start;
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end;
    }
  }
  return [start, end];
}
