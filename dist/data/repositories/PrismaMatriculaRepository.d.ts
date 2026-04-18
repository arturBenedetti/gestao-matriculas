import type { PrismaClient } from "@prisma/client";
import type IMatriculaRepository from "./IMatriculaRepository.js";
import type { ModalidadeFiltro, RankingItem, SetorIes } from "../../core/types/DashboardSnapshot.js";
export declare class PrismaMatriculaRepository implements IMatriculaRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    getTotaisPorAno(filtro: ModalidadeFiltro): Promise<{
        ano: number;
        total: number;
    }[]>;
    getRankingCursos2022(modalidade: "Presencial" | "EaD"): Promise<RankingItem[]>;
    getRankingIes2022(modalidade: "Presencial" | "EaD", setor: SetorIes): Promise<RankingItem[]>;
}
//# sourceMappingURL=PrismaMatriculaRepository.d.ts.map