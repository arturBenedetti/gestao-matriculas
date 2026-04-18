function toNumber(v) {
    if (v === null || v === undefined)
        return 0;
    if (typeof v === "bigint")
        return Number(v);
    return v;
}
function mapRanking(rows) {
    return rows.map((r, i) => ({
        posicao: i + 1,
        rotulo: r.rotulo,
        subrotulo: r.subrotulo,
        total: toNumber(r.total),
    }));
}
export class PrismaMatriculaRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTotaisPorAno(filtro) {
        const rows = filtro === "todos"
            ? await this.prisma.$queryRaw `
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
            : await this.prisma.$queryRaw `
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
      WHERE "modalidade" = ${filtro}
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
    async getRankingCursos2022(modalidade) {
        const rows = await this.prisma.$queryRaw `
      SELECT "nome_curso" AS nome_curso, SUM(COALESCE("y2022", 0))::bigint AS total
      FROM "matricula_linha"
      WHERE "modalidade" = ${modalidade}
      GROUP BY "nome_curso"
      ORDER BY total DESC
      LIMIT 10
    `;
        return mapRanking(rows.map((row) => ({
            rotulo: row.nome_curso,
            subrotulo: modalidade,
            total: row.total,
        })));
    }
    async getRankingIes2022(modalidade, setor) {
        const publica = setor === "publicas";
        const rows = await this.prisma.$queryRaw `
      SELECT "ies", "sigla", SUM(COALESCE("y2022", 0))::bigint AS total
      FROM "matricula_linha"
      WHERE "modalidade" = ${modalidade} AND "publica" = ${publica}
      GROUP BY "ies", "sigla"
      ORDER BY total DESC
      LIMIT 10
    `;
        return mapRanking(rows.map((row) => ({
            rotulo: row.ies,
            subrotulo: row.sigla,
            total: row.total,
        })));
    }
}
//# sourceMappingURL=PrismaMatriculaRepository.js.map