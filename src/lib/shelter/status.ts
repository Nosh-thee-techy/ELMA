import type { Shelter, ShelterOperationalStatus } from "@/lib/types";

export function occupancyPercent(occupancy: number, capacity: number): number {
  if (capacity <= 0) return 0;
  return Math.min(100, Math.round((occupancy / capacity) * 100));
}

export function deriveShelterStatus(
  occupancy: number,
  capacity: number,
  open: boolean,
): ShelterOperationalStatus {
  if (!open) return "CLOSED";
  const pct = occupancyPercent(occupancy, capacity);
  if (pct >= 100) return "FULL";
  if (pct >= 75) return "NEAR_CAPACITY";
  return "OPEN";
}

export function withShelterStatus(shelter: Shelter): Shelter {
  const status =
    shelter.status ?? deriveShelterStatus(shelter.occupancy, shelter.capacity, shelter.open);
  return { ...shelter, status };
}
