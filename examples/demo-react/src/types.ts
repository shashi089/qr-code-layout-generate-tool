import type { StickerLayout } from 'qrlayout-core';

export type EntityType = 'employee' | 'vendor' | 'machine';

export interface Employee {
    id: string;
    name: string;
    age: number;
    employeeId: string;
    place: string;
    designation: string;
}

export interface SavedLayout extends StickerLayout {
    isDefault?: boolean;
    targetEntity?: EntityType;
}
