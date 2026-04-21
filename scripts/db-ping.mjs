/**
 * Testa DATABASE_URL (ex.: Supabase) sem abrir o Electron.
 * Uso: npm run db:ping
 */
import { config } from "dotenv";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
config({ path: join(root, ".env") });

const prisma = new PrismaClient();

try {
  await prisma.$connect();
  console.log("1) $connect() — OK");

  const countRows = await prisma.$queryRaw`SELECT COUNT(*)::bigint AS n FROM "matricula_linha"`;
  const n = countRows[0]?.n;
  console.log(`2) SELECT COUNT(*) FROM matricula_linha — ${n?.toString?.() ?? n} linhas`);

  const mods = await prisma.$queryRaw`
    SELECT DISTINCT "Modalidade" AS m
    FROM "matricula_linha"
    WHERE "Modalidade" IS NOT NULL
    ORDER BY 1
    LIMIT 25
  `;
  const labels = mods.map((r) => r.m).filter(Boolean);
  console.log("3) Valores distintos de \"Modalidade\" (até 25):");
  console.log(labels.length ? labels.join(" | ") : "(nenhum — verifique colunas / dados)");

  const pub = await prisma.$queryRaw`
    SELECT DISTINCT "Pública" AS p
    FROM "matricula_linha"
    WHERE "Pública" IS NOT NULL
    ORDER BY 1
    LIMIT 15
  `;
  const pubLabels = pub.map((r) => r.p).filter(Boolean);
  console.log("4) Valores distintos de \"Pública\" (até 15):");
  console.log(pubLabels.length ? pubLabels.join(" | ") : "(vazio — rankings por setor usam Sim/Não)");

  console.log("\nConexão e leitura na tabela concluídas com sucesso.");
} catch (e) {
  console.error("\nFalha:", e);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
