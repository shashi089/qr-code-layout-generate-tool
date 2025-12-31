import type { EntityType } from "./types";

export interface EntitySchema {
    label: string;
    fields: { name: string; label: string }[];
    sampleData: Record<string, any>;
}

export const ENTITY_SCHEMAS: Record<EntityType, EntitySchema> = {
    employee: {
        label: "Employee",
        fields: [
            { name: "name", label: "Name" },
            { name: "employeeId", label: "Employee ID" },
            { name: "designation", label: "Designation" },
            { name: "place", label: "Place" },
        ],
        sampleData: {
            name: "Rajesh Sharma",
            employeeId: "EMP-001",
            designation: "Software Engineer",
            place: "Mumbai",
        },
    },
    vendor: {
        label: "Vendor",
        fields: [
            { name: "vendorName", label: "Vendor Name" },
            { name: "vendorCode", label: "Vendor Code" },
            { name: "contactPerson", label: "Contact Person" },
            { name: "category", label: "Category" },
        ],
        sampleData: {
            vendorName: "Bharat Enterprises",
            vendorCode: "VND-2002",
            contactPerson: "Amit Patel",
            category: "Manufacturing",
        },
    },
    machine: {
        label: "Machine",
        fields: [
            { name: "machineName", label: "Machine Name" },
            { name: "machineId", label: "Machine ID" },
            { name: "model", label: "Model" },
            { name: "installationDate", label: "Installation Date" },
        ],
        sampleData: {
            machineName: "CNC Router",
            machineId: "MAC-05",
            model: "Dyna-400",
            installationDate: "2024-01-15",
        },
    },
};
