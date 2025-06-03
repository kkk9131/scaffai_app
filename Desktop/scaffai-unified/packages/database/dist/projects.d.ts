import type { Project, ProjectInsert, Drawing, DrawingInsert, Condition, ConditionInsert, Calculation, CalculationInsert } from './types';
export declare class ProjectService {
    private supabase;
    createProject(projectData: ProjectInsert): Promise<Project>;
    getProjects(ownerId: string): Promise<Project[]>;
    getProject(projectId: string): Promise<Project | null>;
    updateProject(projectId: string, updates: Partial<Project>): Promise<Project>;
    deleteProject(projectId: string): Promise<void>;
    createDrawing(drawingData: DrawingInsert): Promise<Drawing>;
    getDrawings(projectId: string): Promise<Drawing[]>;
    updateDrawing(drawingId: string, updates: Partial<Drawing>): Promise<Drawing>;
    deleteDrawing(drawingId: string): Promise<void>;
    createCondition(conditionData: ConditionInsert): Promise<Condition>;
    getCondition(projectId: string): Promise<Condition | null>;
    updateCondition(conditionId: string, updates: Partial<Condition>): Promise<Condition>;
    createCalculation(calculationData: CalculationInsert): Promise<Calculation>;
    getCalculations(projectId: string): Promise<Calculation[]>;
    getLatestCalculation(projectId: string): Promise<Calculation | null>;
    updateCalculation(calculationId: string, updates: Partial<Calculation>): Promise<Calculation>;
    deleteCalculation(calculationId: string): Promise<void>;
    getProjectWithDetails(projectId: string): Promise<{
        project: {
            id: string;
            name: string;
            description: string | null;
            owner_id: string;
            site_address: string | null;
            status: "draft" | "in_progress" | "completed";
            created_at: string;
            updated_at: string;
        } | null;
        drawings: {
            id: string;
            project_id: string;
            name: string;
            dxf_blob: string | null;
            svg_blob: string | null;
            scale: number;
            metadata: any | null;
            created_at: string;
            updated_at: string;
        }[];
        condition: {
            id: string;
            project_id: string;
            eave_depths: number[];
            boundaries: any;
            roof_type: string;
            special_materials: string[];
            created_at: string;
            updated_at: string;
        } | null;
        calculations: {
            id: string;
            project_id: string;
            algo_version: string;
            result_json: any;
            cost: number | null;
            material_list: any | null;
            created_at: string;
            updated_at: string;
        }[];
    }>;
}
export declare const projectService: ProjectService;
//# sourceMappingURL=projects.d.ts.map