import { Task } from "../../dist";

export const tsaks = {
	"activities": [
		{
			"id": 5251931,
			"needCount": true,
			"level": null,
			"parentWorkBreakdownStructureId": null,
			"workBreakdownStructureTitle": "فعالیت 29 مهر",
			"automaticScheduling": null,
			"duration": 2,
			"startDateActivity": "2025-10-21",
			"endDateActivity": "2025-10-23",
			"wbsCode": "2.1",
			"confirmedActivityProgress": {
				"source": "0.0",
				"parsedValue": 0
			},
			"kind": null,
			"group": null,
			"isIndependentStart": null,
			"lateStartDate": null,
			"lateFinishDate": null,
			"totalFloat": 0,
			"isCritical": true,
			"relationships": [
				{
					"id": null,
					"needCount": true,
					"targetActivityId": -2,
					"targetWbsCode": null,
					"relation": "FINISH_START",
					"lag": 0,
					"isCritical": true
				}
			],
			"firstLevelParent": false
		},
		{
			"id": 5251949,
			"needCount": true,
			"level": null,
			"parentWorkBreakdownStructureId": null,
			"workBreakdownStructureTitle": "یک آبان",
			"automaticScheduling": null,
			"duration": 2,
			"startDateActivity": "2025-10-23",
			"endDateActivity": "2025-10-25",
			"wbsCode": "2.2",
			"confirmedActivityProgress": {
				"source": "0.0",
				"parsedValue": 0
			},
			"kind": null,
			"group": null,
			"isIndependentStart": null,
			"lateStartDate": null,
			"lateFinishDate": null,
			"totalFloat": 0,
			"isCritical": true,
			"relationships": [
				{
					"id": null,
					"needCount": true,
					"targetActivityId": -2,
					"targetWbsCode": null,
					"relation": "FINISH_START",
					"lag": 0,
					"isCritical": true
				}
			],
			"firstLevelParent": false
		},
		{
			"id": 5251506,
			"needCount": true,
			"level": null,
			"parentWorkBreakdownStructureId": null,
			"workBreakdownStructureTitle": "فعالیت 28 مهر",
			"automaticScheduling": null,
			"duration": 1,
			"startDateActivity": "2025-10-20",
			"endDateActivity": null,
			"wbsCode": "2",
			"confirmedActivityProgress": {
				"source": "0.0",
				"parsedValue": 0
			},
			"kind": null,
			"group": null,
			"isIndependentStart": null,
			"lateStartDate": null,
			"lateFinishDate": null,
			"totalFloat": 0,
			"isCritical": true,
			"relationships": [
				{
					"id": null,
					"needCount": true,
					"targetActivityId": 5251931,
					"targetWbsCode": null,
					"relation": "FINISH_START",
					"lag": 0,
					"isCritical": true
				},
				{
					"id": null,
					"needCount": true,
					"targetActivityId": 5251949,
					"targetWbsCode": null,
					"relation": "FINISH_START",
					"lag": 0,
					"isCritical": true
				}
			],
			"firstLevelParent": true
		},
		{
			"id": 5251473,
			"needCount": true,
			"level": null,
			"parentWorkBreakdownStructureId": null,
			"workBreakdownStructureTitle": "فعالیت اول 14 مهر",
			"automaticScheduling": null,
			"duration": 10,
			"startDateActivity": "2025-10-07",
			"endDateActivity": "2025-10-21",
			"wbsCode": "1",
			"confirmedActivityProgress": {
				"source": "0.0",
				"parsedValue": 0
			},
			"kind": null,
			"group": null,
			"isIndependentStart": null,
			"lateStartDate": null,
			"lateFinishDate": null,
			"totalFloat": 0,
			"isCritical": true,
			"relationships": [
				{
					"id": null,
					"needCount": true,
					"targetActivityId": 5251506,
					"targetWbsCode": null,
					"relation": "START_START",
					"lag": 1,
					"isCritical": true
				}
			],
			"firstLevelParent": false
		},
		{
			"id": -1,
			"needCount": true,
			"level": null,
			"parentWorkBreakdownStructureId": null,
			"workBreakdownStructureTitle": "شروع",
			"automaticScheduling": null,
			"duration": 0,
			"startDateActivity": "2025-10-07",
			"endDateActivity": null,
			"wbsCode": "START",
			"confirmedActivityProgress": {
				"source": "0.0",
				"parsedValue": 0
			},
			"kind": "start",
			"group": null,
			"isIndependentStart": null,
			"lateStartDate": null,
			"lateFinishDate": null,
			"totalFloat": 0,
			"isCritical": true,
			"relationships": [
				{
					"id": null,
					"needCount": true,
					"targetActivityId": 5251473,
					"targetWbsCode": null,
					"relation": "FINISH_START",
					"lag": 0,
					"isCritical": true
				}
			],
			"firstLevelParent": false
		},
		{
			"id": -2,
			"needCount": true,
			"level": null,
			"parentWorkBreakdownStructureId": null,
			"workBreakdownStructureTitle": "پایان",
			"automaticScheduling": null,
			"duration": 0,
			"startDateActivity": null,
			"endDateActivity": "2025-10-25",
			"wbsCode": "END",
			"confirmedActivityProgress": {
				"source": "0.0",
				"parsedValue": 0
			},
			"kind": "end",
			"group": null,
			"isIndependentStart": null,
			"lateStartDate": null,
			"lateFinishDate": null,
			"totalFloat": 0,
			"isCritical": true,
			"relationships": [],
			"firstLevelParent": false
		}
	]
}



export type LinkKind = "FS" | "SS" | "FF" | "SF";
export type RelationKind = "FINISH_START" | "START_START" | "FINISH_FINISH" | "START_FINISH";

export type GanttTask = Task & {
  linkTypes?: Record<string, LinkKind>; // successor.linkTypes[predId]
  linkType?: LinkKind | "mixed";        // optional summary
};

const REL_MAP: Record<RelationKind, LinkKind> = {
  FINISH_START: "FS",
  START_START: "SS",
  FINISH_FINISH: "FF",
  START_FINISH: "SF",
};

const isSentinel = (id: unknown) => String(id) === "-1" || String(id) === "-2";

const currentDate = new Date();
const makeDate = (day: number) =>
  new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

const toStyledDate = (iso?: string | null): Date | undefined => {
  if (!iso) return undefined;
  const d = new Date(iso);
  const day = d.getDate();
  return Number.isNaN(day) ? undefined : makeDate(day);
};

export function transformActivitiesToTasks(): GanttTask[] {
const activities = tsaks.activities
  const tasks: GanttTask[] = activities.map((a: any, i: number) => {
    let type: GanttTask["type"] = "task";
    if (a.kind === "start" || a.kind === "end" || a.duration === 0) type = "milestone";

    const start = toStyledDate(a.startDateActivity) ?? makeDate(1);
    const end = toStyledDate(a.endDateActivity) ?? start;

    const t: GanttTask = {
      id: String(a.id),
      name: a.workBreakdownStructureTitle,
      type,
      progress: a.confirmedActivityProgress?.parsedValue ?? 0,
      start,
      end,
      displayOrder: i + 1,
    };

    // group under top-level WBS like 2.1 -> 2
    if (!a.firstLevelParent && typeof a.wbsCode === "string" && a.wbsCode.includes(".")) {
      const top = a.wbsCode.split(".")[0];
      const parent = activities.find((p: any) => p.wbsCode === top);
      if (parent) t.project = String(parent.id);
    }

    return t;
  });

  const byId = new Map<string, GanttTask>(tasks.map(t => [t.id, t]));
  const get = (id: unknown) => byId.get(String(id));

  for (const a of activities) {
    const predId = String(a.id);

    for (const rel of a.relationships ?? []) {
      const succId = String(rel.targetActivityId);
      if (succId === predId) continue;
      if (isSentinel(succId)) continue;  // نخواهی START/END وارد گراف شوند

      const succTask = get(succId);
      if (!succTask) continue;

      // ✅ وابستگی روی successor
      succTask.dependencies = succTask.dependencies ?? [];
      if (!succTask.dependencies.includes(predId)) {
        succTask.dependencies.push(predId);
      }

      // ✅ نوع لینک per-edge روی successor
      const lt = REL_MAP[rel.relation as RelationKind] ?? "FS";
      succTask.linkTypes = succTask.linkTypes ?? {};
      succTask.linkTypes[predId] = lt;

      // خلاصه کلی (اختیاری)
      if (!succTask.linkType) succTask.linkType = lt;
      else if (succTask.linkType !== lt) succTask.linkType = "FS";
    }
  }

  return tasks;
}
