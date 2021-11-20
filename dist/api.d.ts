export default class API {
    private ip;
    private id;
    private log;
    catchRequestErrors: boolean;
    constructor(ip: string, id: number, log: any);
    up(): void;
    down(): void;
    stop(): void;
    _request(cmd: any): void;
}
//# sourceMappingURL=api.d.ts.map