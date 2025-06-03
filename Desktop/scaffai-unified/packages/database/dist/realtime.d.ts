export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE';
export interface RealtimePayload<T = any> {
    eventType: RealtimeEvent;
    new: T;
    old: T;
    table: string;
    schema: string;
}
export declare class RealtimeService {
    private supabase;
    private channels;
    subscribeToProject(projectId: string, callback: (payload: RealtimePayload) => void): () => void;
    subscribeToUserProjects(userId: string, callback: (payload: RealtimePayload) => void): () => void;
    subscribeToTable<T = any>(tableName: string, callback: (payload: any) => void, filter?: string): () => void;
    subscribeToCalculationStatus(projectId: string, callback: (calculation: any) => void): () => void;
    sendPresence(channelName: string, state: any): Promise<void>;
    unsubscribe(channelName: string): void;
    unsubscribeAll(): void;
    getChannelStatus(channelName: string): string | null;
    getActiveChannels(): string[];
}
export declare const realtimeService: RealtimeService;
//# sourceMappingURL=realtime.d.ts.map