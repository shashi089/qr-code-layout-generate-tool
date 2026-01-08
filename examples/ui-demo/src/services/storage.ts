import type { StickerLayout } from 'qrlayout-ui';

const STORAGE_KEY = 'qr_labels_data';
const EMPLOYEE_STORAGE_KEY = 'employee_data';

export interface Employee {
    id: string;
    fullName: string;
    employeeId: string;
    department: string;
    joinDate: string;
}

export const storage = {
    getLabels: (): StickerLayout[] => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    saveLabels: (labels: StickerLayout[]): void => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(labels));
    },

    addLabel: (label: StickerLayout): void => {
        const labels = storage.getLabels();
        const index = labels.findIndex(l => l.id === label.id);
        if (index >= 0) {
            labels[index] = label;
        } else {
            labels.push(label);
        }
        storage.saveLabels(labels);
    },

    deleteLabel: (id: string): void => {
        const labels = storage.getLabels().filter(l => l.id !== id);
        storage.saveLabels(labels);
    },

    // Employee functions
    getEmployees: (): Employee[] => {
        const data = localStorage.getItem(EMPLOYEE_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    saveEmployees: (employees: Employee[]): void => {
        localStorage.setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify(employees));
    },

    addEmployee: (employee: Employee): void => {
        const employees = storage.getEmployees();
        const index = employees.findIndex(e => e.id === employee.id);
        if (index >= 0) {
            employees[index] = employee;
        } else {
            employees.push(employee);
        }
        storage.saveEmployees(employees);
    },

    deleteEmployee: (id: string): void => {
        const employees = storage.getEmployees().filter(e => e.id !== id);
        storage.saveEmployees(employees);
    },

    clearAll: (): void => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(EMPLOYEE_STORAGE_KEY);
    }
};
