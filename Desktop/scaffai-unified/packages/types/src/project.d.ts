export interface Project {
    id: string;
    name: string;
    details: string;
    status: '完了' | '進行中' | '設計中' | '下書き';
    createdAt: Date;
    updatedAt: Date;
    memo: string;
    size: number;
    assignedTo: string;
    schematic: 'residential' | 'commercial' | 'industrial' | 'apartment';
    imageSrc?: string;
}
export type SortOption = 'name' | 'updatedAt' | 'createdAt';
//# sourceMappingURL=project.d.ts.map