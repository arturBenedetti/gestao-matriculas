import { Subject } from "../../core/interfaces/Observer.js";
function filtrosPadrao() {
    return {
        modalidadeTotais: "todos",
        setorIesPresencial: "publicas",
        setorIesEad: "publicas",
    };
}
/**
 * ViewModel (MVVM): estado de apresentação + orquestração das consultas ao repositório.
 * Estende Subject para o padrão Observer (notifica interessados quando o snapshot muda).
 */
export class DashboardViewModel extends Subject {
    repository;
    filtros = filtrosPadrao();
    lastSnapshot = null;
    constructor(repository) {
        super();
        this.repository = repository;
    }
    getFiltros() {
        return { ...this.filtros };
    }
    setFiltros(partial) {
        this.filtros = { ...this.filtros, ...partial };
    }
    getLastSnapshot() {
        return this.lastSnapshot;
    }
    async refresh() {
        const loading = {
            carregando: true,
            totaisPorAno: [],
            rankingCursosPresencial2022: [],
            rankingCursosEad2022: [],
            rankingIesPresencial2022: [],
            rankingIesEad2022: [],
            filtros: { ...this.filtros },
        };
        this.notify(loading);
        try {
            const [totaisPorAno, rankingCursosPresencial2022, rankingCursosEad2022, rankingIesPresencial2022, rankingIesEad2022,] = await Promise.all([
                this.repository.getTotaisPorAno(this.filtros.modalidadeTotais),
                this.repository.getRankingCursos2022("Presencial"),
                this.repository.getRankingCursos2022("EaD"),
                this.repository.getRankingIes2022("Presencial", this.filtros.setorIesPresencial),
                this.repository.getRankingIes2022("EaD", this.filtros.setorIesEad),
            ]);
            const snapshot = {
                carregando: false,
                totaisPorAno,
                rankingCursosPresencial2022,
                rankingCursosEad2022,
                rankingIesPresencial2022,
                rankingIesEad2022,
                filtros: { ...this.filtros },
            };
            this.lastSnapshot = snapshot;
            this.notify(snapshot);
            return snapshot;
        }
        catch (e) {
            const err = {
                carregando: false,
                erro: e instanceof Error ? e.message : String(e),
                totaisPorAno: [],
                rankingCursosPresencial2022: [],
                rankingCursosEad2022: [],
                rankingIesPresencial2022: [],
                rankingIesEad2022: [],
                filtros: { ...this.filtros },
            };
            this.lastSnapshot = err;
            this.notify(err);
            return err;
        }
    }
}
//# sourceMappingURL=DashboardViewModel.js.map