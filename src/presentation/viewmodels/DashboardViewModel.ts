import { Subject } from "../../core/interfaces/Observer.js";
import type IMatriculaRepository from "../../data/repositories/IMatriculaRepository.js";
import type {
  DashboardFiltros,
  DashboardSnapshot,
} from "../../core/types/DashboardSnapshot.js";

function filtrosPadrao(): DashboardFiltros {
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
export class DashboardViewModel extends Subject<DashboardSnapshot> {
  private filtros: DashboardFiltros = filtrosPadrao();
  private lastSnapshot: DashboardSnapshot | null = null;

  constructor(private readonly repository: IMatriculaRepository) {
    super();
  }

  getFiltros(): DashboardFiltros {
    return { ...this.filtros };
  }

  setFiltros(partial: Partial<DashboardFiltros>): void {
    this.filtros = { ...this.filtros, ...partial };
  }

  getLastSnapshot(): DashboardSnapshot | null {
    return this.lastSnapshot;
  }

  async refresh(): Promise<DashboardSnapshot> {
    const loading: DashboardSnapshot = {
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
      const [
        totaisPorAno,
        rankingCursosPresencial2022,
        rankingCursosEad2022,
        rankingIesPresencial2022,
        rankingIesEad2022,
      ] = await Promise.all([
        this.repository.getTotaisPorAno(this.filtros.modalidadeTotais),
        this.repository.getRankingCursos2022("Presencial"),
        this.repository.getRankingCursos2022("EaD"),
        this.repository.getRankingIes2022("Presencial", this.filtros.setorIesPresencial),
        this.repository.getRankingIes2022("EaD", this.filtros.setorIesEad),
      ]);

      const snapshot: DashboardSnapshot = {
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
    } catch (e) {
      const err: DashboardSnapshot = {
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
