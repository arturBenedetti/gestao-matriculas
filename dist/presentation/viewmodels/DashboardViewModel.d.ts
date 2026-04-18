import { Subject } from "../../core/interfaces/Observer.js";
import type IMatriculaRepository from "../../data/repositories/IMatriculaRepository.js";
import type { DashboardFiltros, DashboardSnapshot } from "../../core/types/DashboardSnapshot.js";
/**
 * ViewModel (MVVM): estado de apresentação + orquestração das consultas ao repositório.
 * Estende Subject para o padrão Observer (notifica interessados quando o snapshot muda).
 */
export declare class DashboardViewModel extends Subject<DashboardSnapshot> {
    private readonly repository;
    private filtros;
    private lastSnapshot;
    constructor(repository: IMatriculaRepository);
    getFiltros(): DashboardFiltros;
    setFiltros(partial: Partial<DashboardFiltros>): void;
    getLastSnapshot(): DashboardSnapshot | null;
    refresh(): Promise<DashboardSnapshot>;
}
//# sourceMappingURL=DashboardViewModel.d.ts.map