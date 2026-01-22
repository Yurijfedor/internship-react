import type { HiveData } from "../types/hive";

export function isHiveData(data: unknown): data is HiveData {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const d = data as Record<string, unknown>;

  return (
    typeof d.hiveNumber === "number" &&
    typeof d.strength === "number" &&
    typeof d.queenStatus === "string" &&
    typeof d.honey === "number"
  );
}

export function isHiveDataValid(data: HiveData): boolean {
  return (
    data.hiveNumber > 0 &&
    data.hiveNumber < 1000 &&
    data.strength >= 1 &&
    data.strength <= 10 &&
    data.honey >= 0 &&
    data.honey <= 100 &&
    (data.queenStatus === "good" ||
      data.queenStatus === "medium" ||
      data.queenStatus === "bad")
  );
}
