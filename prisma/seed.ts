import "dotenv/config";
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function isPublica(categoriaAdministrativa: string): boolean {
  return /pública/i.test(categoriaAdministrativa.trim());
}

function parseYearCell(raw: string): number | null {
  const t = raw.trim();
  if (t === "" || t === "-") return null;
  const n = Number.parseInt(t, 10);
  return Number.isFinite(n) ? n : null;
}

type LinhaInsert = Prisma.MatriculaLinhaCreateManyInput;

function mapColumns(parts: string[]): LinhaInsert | null {
  if (parts.length < 19) return null;
  const [
    estado,
    cidade,
    ies,
    sigla,
    organizacao,
    categoriaAdministrativa,
    nomeCurso,
    nomeDetalhadoCurso,
    modalidade,
    grau,
    y14,
    y15,
    y16,
    y17,
    y18,
    y19,
    y20,
    y21,
    y22,
  ] = parts;

  return {
    estado: estado.trim(),
    cidade: cidade.trim(),
    ies: ies.trim(),
    sigla: sigla.trim(),
    organizacao: organizacao.trim(),
    categoriaAdministrativa: categoriaAdministrativa.trim(),
    publica: isPublica(categoriaAdministrativa),
    nomeCurso: nomeCurso.trim(),
    nomeDetalhadoCurso: nomeDetalhadoCurso.trim(),
    modalidade: modalidade.trim(),
    grau: grau.trim(),
    y2014: parseYearCell(y14),
    y2015: parseYearCell(y15),
    y2016: parseYearCell(y16),
    y2017: parseYearCell(y17),
    y2018: parseYearCell(y18),
    y2019: parseYearCell(y19),
    y2020: parseYearCell(y20),
    y2021: parseYearCell(y21),
    y2022: parseYearCell(y22),
  };
}

async function flushBatch(batch: LinhaInsert[]): Promise<void> {
  if (batch.length === 0) return;
  await prisma.matriculaLinha.createMany({ data: batch });
}

async function main(): Promise<void> {
  const csvPath = path.join(__dirname, "..", "Matriculados Região Sul.csv");
  console.log("Lendo CSV:", csvPath);

  await prisma.matriculaLinha.deleteMany({});

  const stream = createReadStream(csvPath, { encoding: "utf8" });
  const rl = createInterface({ input: stream, crlfDelay: Infinity });

  let lineNo = 0;
  let batch: LinhaInsert[] = [];
  const BATCH = 2500;

  for await (const line of rl) {
    lineNo += 1;
    const raw = lineNo === 1 && line.charCodeAt(0) === 0xfeff ? line.slice(1) : line;
    if (lineNo === 1) continue;

    const parts = raw.split(";");
    const row = mapColumns(parts);
    if (!row) continue;

    batch.push(row);
    if (batch.length >= BATCH) {
      await flushBatch(batch);
      batch = [];
      process.stdout.write(`\rInseridas ~ ${lineNo} linhas…`);
    }
  }

  await flushBatch(batch);
  console.log(`\nConcluído. Última linha processada: ${lineNo}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
