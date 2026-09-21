import { shelters as seedShelters } from "@/lib/data/seed";
import { deriveShelterStatus } from "@/lib/shelter/status";
import type { Shelter, ShelterOperationalStatus, ShelterStatusLog } from "@/lib/types";

const globalShelter = globalThis as typeof globalThis & {
  __elmaShelters?: Shelter[];
  __elmaShelterLogs?: ShelterStatusLog[];
};

function initShelters(): Shelter[] {
  return seedShelters.map((s) => ({
    ...s,
    status: deriveShelterStatus(s.occupancy, s.capacity, s.open),
    resourceNeeds: [],
    mediaProofUrls: [],
  }));
}

function store(): { shelters: Shelter[]; logs: ShelterStatusLog[] } {
  if (!globalShelter.__elmaShelters) {
    globalShelter.__elmaShelters = initShelters();
    globalShelter.__elmaShelterLogs = [];
  }
  return {
    shelters: globalShelter.__elmaShelters,
    logs: globalShelter.__elmaShelterLogs!,
  };
}

export function listSheltersMutable(): Shelter[] {
  return [...store().shelters];
}

export function getShelterById(id: string): Shelter | undefined {
  return store().shelters.find((s) => s.id === id);
}

export function updateShelterStatus(input: {
  shelterId: string;
  occupancy: number;
  open: boolean;
  status?: ShelterOperationalStatus;
  resourceNeeds?: string[];
  mediaProofUrls?: string[];
  updatedBy: string;
}): Shelter | null {
  const { shelters, logs } = store();
  const idx = shelters.findIndex((s) => s.id === input.shelterId);
  if (idx < 0) return null;

  const current = shelters[idx];
  const occupancy = Math.max(0, Math.min(input.occupancy, current.capacity));
  const open = input.open;
  const status =
    input.status ??
    deriveShelterStatus(occupancy, current.capacity, open);

  const next: Shelter = {
    ...current,
    occupancy,
    open,
    status,
    resourceNeeds: input.resourceNeeds ?? current.resourceNeeds ?? [],
    mediaProofUrls: input.mediaProofUrls ?? current.mediaProofUrls ?? [],
    updatedAt: new Date().toISOString(),
    updatedBy: input.updatedBy,
  };
  shelters[idx] = next;

  const log: ShelterStatusLog = {
    id: `log-${crypto.randomUUID().slice(0, 8)}`,
    shelterId: next.id,
    currentOccupancy: next.occupancy,
    maxCapacity: next.capacity,
    status: next.status ?? "OPEN",
    resourceNeeds: next.resourceNeeds ?? [],
    updatedBy: input.updatedBy,
    updatedAt: next.updatedAt ?? new Date().toISOString(),
  };
  logs.unshift(log);

  return next;
}
