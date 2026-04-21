import type { PrismaClient } from "@prisma/client";
import type IMatriculaRepository from "./IMatriculaRepository.js";
import type {
  ModalidadeFiltro,
  RankingItem,
  SetorIes,
} from "../../core/types/DashboardSnapshot.js";

function toNumber(v: bigint | number | null | undefined): number {
  if (v === null || v === undefined) return 0;
  if (typeof v === "bigint") return Number(v);
  return v;
}

function mapRanking(
  rows: { rotulo: string; subrotulo: string; total: bigint | number }[],
): RankingItem[] {
  return rows.map((r, i) => ({
    posicao: i + 1,
    rotulo: r.rotulo,
    subrotulo: r.subrotulo,
    total: toNumber(r.total),
  }));
}

export class PrismaMatriculaRepository implements IMatriculaRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getTotaisPorAno(filtro: ModalidadeFiltro): Promise<{ ano: number; total: number }[]> {
    const rows =
      filtro === "todos"
        ? await this.prisma.$queryRaw<
            {
              y2014: bigint | null;
              y2015: bigint | null;
              y2016: bigint | null;
              y2017: bigint | null;
              y2018: bigint | null;
              y2019: bigint | null;
              y2020: bigint | null;
              y2021: bigint | null;
              y2022: bigint | null;
            }[]
          >`
      SELECT
        SUM(COALESCE("y2014", 0))::bigint AS "y2014",
        SUM(COALESCE("y2015", 0))::bigint AS "y2015",
        SUM(COALESCE("y2016", 0))::bigint AS "y2016",
        SUM(COALESCE("y2017", 0))::bigint AS "y2017",
        SUM(COALESCE("y2018", 0))::bigint AS "y2018",
        SUM(COALESCE("y2019", 0))::bigint AS "y2019",
        SUM(COALESCE("y2020", 0))::bigint AS "y2020",
        SUM(COALESCE("y2021", 0))::bigint AS "y2021",
        SUM(COALESCE("y2022", 0))::bigint AS "y2022"
      FROM "matricula_linha"
    `
        : await this.prisma.$queryRaw<
            {
              y2014: bigint | null;
              y2015: bigint | null;
              y2016: bigint | null;
              y2017: bigint | null;
              y2018: bigint | null;
              y2019: bigint | null;
              y2020: bigint | null;
              y2021: bigint | null;
              y2022: bigint | null;
            }[]
          >`
      SELECT
        SUM(COALESCE("y2014", 0))::bigint AS "y2014",
        SUM(COALESCE("y2015", 0))::bigint AS "y2015",
        SUM(COALESCE("y2016", 0))::bigint AS "y2016",
        SUM(COALESCE("y2017", 0))::bigint AS "y2017",
        SUM(COALESCE("y2018", 0))::bigint AS "y2018",
        SUM(COALESCE("y2019", 0))::bigint AS "y2019",
        SUM(COALESCE("y2020", 0))::bigint AS "y2020",
        SUM(COALESCE("y2021", 0))::bigint AS "y2021",
        SUM(COALESCE("y2022", 0))::bigint AS "y2022"
      FROM "matricula_linha"
      WHERE "Modalidade" = ${filtro}
    `;
    const r = rows[0];
    if (!r) {
      return [];
    }
    return [
      { ano: 2014, total: toNumber(r.y2014) },
      { ano: 2015, total: toNumber(r.y2015) },
      { ano: 2016, total: toNumber(r.y2016) },
      { ano: 2017, total: toNumber(r.y2017) },
      { ano: 2018, total: toNumber(r.y2018) },
      { ano: 2019, total: toNumber(r.y2019) },
      { ano: 2020, total: toNumber(r.y2020) },
      { ano: 2021, total: toNumber(r.y2021) },
      { ano: 2022, total: toNumber(r.y2022) },
    ];
  }

  async getRankingCursos2022(modalidade: "Presencial" | "EaD"): Promise<RankingItem[]> {
    const rows = await this.prisma.$queryRaw<
      { nome_curso: string; total: bigint }[]
    >`
      SELECT "Nome do Curso" AS nome_curso, SUM(COALESCE("y2022", 0))::bigint AS total
      FROM "matricula_linha"
      WHERE "Modalidade" = ${modalidade}
      GROUP BY "Nome do Curso"
      ORDER BY total DESC
      LIMIT 10
    `;
    return mapRanking(
      rows.map((row) => ({
        rotulo: row.nome_curso,
        subrotulo: modalidade,
        total: row.total,
      })),
    );
  }

  async getRankingIes2022(
    modalidade: "Presencial" | "EaD",
    setor: SetorIes,
  ): Promise<RankingItem[]> {
    const publicaLabel = setor === "publicas" ? "Sim" : "Não";
    const rows = await this.prisma.$queryRaw<
      { ies: string; sigla: string; total: bigint }[]
    >`
      SELECT "IES" AS ies, "Sigla" AS sigla, SUM(COALESCE("y2022", 0))::bigint AS total
      FROM "matricula_linha"
      WHERE "Modalidade" = ${modalidade}
        AND (
          (NULLIF(TRIM("Pública"), '') IS NOT NULL AND "Pública" = ${publicaLabel})
          OR (
            NULLIF(TRIM("Pública"), '') IS NULL
            AND (
              (${publicaLabel} = 'Sim' AND COALESCE("Categoria Administrativa", '') ~* 'pública')
              OR (${publicaLabel} = 'Não' AND COALESCE("Categoria Administrativa", '') !~* 'pública')
            )
          )
        )
      GROUP BY "IES", "Sigla"
      ORDER BY total DESC
      LIMIT 10
    `;
    return mapRanking(
      rows.map((row) => ({
        rotulo: row.ies,
        subrotulo: row.sigla,
        total: row.total,
      })),
    );
  }
}
