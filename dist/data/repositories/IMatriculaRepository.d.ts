import type { ModalidadeFiltro, RankingItem, SetorIes } from "../../core/types/DashboardSnapshot.js";
/** Contrato Repository: isolamento da persistência (Prisma/PostgreSQL). */
export default interface IMatriculaRepository {
    getTotaisPorAno(filtro: ModalidadeFiltro): Promise<{
        ano: number;
        total: number;
    }[]>;
    getRankingCursos2022(modalidade: "Presencial" | "EaD"): Promise<RankingItem[]>;
    getRankingIes2022(modalidade: "Presencial" | "EaD", setor: SetorIes): Promise<RankingItem[]>;
}
//# sourceMappingURL=IMatriculaRepository.d.ts.map