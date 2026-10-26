const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
(async () => {
  const root = path.resolve("dist/athena/browser");
  const server = http.createServer((req, res) => {
    const file = path.join(
      root,
      req.url === "/" ? "index.html" : req.url.split("?")[0],
    );
    if (!file.startsWith(root + path.sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    fs.readFile(file, (error, data) => {
      if (error) {
        res.writeHead(404);
        res.end();
        return;
      }
      res.setHeader(
        "Content-Type",
        file.endsWith(".js")
          ? "application/javascript"
          : file.endsWith(".css")
            ? "text/css"
            : "text/html",
      );
      res.end(data);
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  server.unref();
  fs.mkdirSync("test-results", { recursive: true });
  const b = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    headless: true,
    args: ["--no-sandbox"],
  });
  const p = await b.newPage({ viewport: { width: 1440, height: 1100 } });
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  const assert = (x, m) => {
    if (!x) throw Error(m);
  };
  const nav = async (t) =>
    p
      .locator(".sidebar")
      .getByRole("button", { name: t, exact: false })
      .first()
      .click();
  await p.goto("http://127.0.0.1:" + server.address().port);
  await p.getByRole("heading", { name: "Visão geral." }).waitFor();
  await p.waitForTimeout(300);
  await p.screenshot({ path: "test-results/desktop.png", fullPage: true });
  await p.getByRole("button", { name: "＋ Novo épico", exact: true }).click();
  await p
    .getByRole("dialog")
    .locator("input[name=title]")
    .fill("Épico de teste");
  await p.getByRole("button", { name: "Salvar épico", exact: true }).click();
  await p
    .getByRole("heading", { name: "Épico de teste", exact: true })
    .waitFor();
  await p
    .locator(".epic-card")
    .filter({
      has: p.getByRole("heading", {
        name: "Autenticação e acesso",
        exact: true,
      }),
    })
    .getByRole("button", { name: "Adicionar requisito" })
    .click();
  await p
    .getByRole("dialog")
    .locator("input[name=title]")
    .fill("Requisito de teste");
  await p.getByRole("button", { name: "Criar requisito", exact: true }).click();
  await p.getByLabel("Título do requisito", { exact: true }).waitFor();
  await p.getByRole("button", { name: "＋ Critério", exact: true }).click();
  await p.getByLabel("Dado do cenário 1").fill("um contexto válido");
  await p.getByLabel("Quando do cenário 1").fill("a ação é executada");
  await p.getByLabel("Então do cenário 1").fill("o resultado é salvo");
  await p
    .getByRole("button", { name: "Submeter para revisão", exact: true })
    .click();
  await p
    .getByRole("button", { name: "Aprovar candidata", exact: true })
    .click();
  await p.getByRole("button", { name: "Publicar versão", exact: true }).click();
  await p
    .getByRole("dialog")
    .getByRole("button", { name: "Confirmar", exact: true })
    .click();
  await p.getByRole("dialog").waitFor({ state: "hidden" });
  await nav("Livro de requisitos");
  await p.getByRole("row").filter({ hasText: "Requisito de teste" }).click();
  assert(
    await p.getByLabel("Título do requisito", { exact: true }).isDisabled(),
    "Published read only",
  );
  await nav("Requisitos");
  await p.getByRole("row").filter({ hasText: "Requisito de teste" }).click();
  await p
    .getByRole("button", { name: "Editar nova candidata", exact: true })
    .click();
  await p
    .getByLabel("Título do requisito", { exact: true })
    .fill("Nova candidata de teste");
  await nav("Livro de requisitos"); // verify published content stays immutable
  await p.getByRole("row").filter({ hasText: "Requisito de teste" }).click();
  assert(
    (await p
      .getByLabel("Título do requisito", { exact: true })
      .inputValue()) === "Requisito de teste",
    "Immutable published version",
  );
  for (const label of [
    "Relações",
    "Revisões",
    "Baselines",
    "Integrações",
    "Membros",
    "Agente MCP",
    "Telas de acesso",
  ]) {
    await nav(label);
    await p.locator("app-sections").waitFor();
  }
  await nav("Relações");
  await p.getByRole("button", { name: "Nova relação" }).click();
  await p.locator("textarea[name=reason]").fill("Regra de teste");
  await p
    .getByRole("dialog")
    .getByRole("button", { name: "Confirmar", exact: true })
    .click();
  await p.getByRole("dialog").waitFor({ state: "hidden" });
  assert(
    (await p.getByRole("cell", { name: "DEPENDE_DE", exact: true }).count()) ===
      1,
    "Create relation",
  );
  await nav("Mapa de requisitos");
  await p.locator(".graph-node").first().waitFor();
  assert((await p.locator(".graph-node").count()) > 0, "Map nodes");
  assert((await p.locator("svg line").count()) === 1, "Map relation");
  await p.locator(".graph-node").first().click();
  await p.locator(".map-preview").waitFor();
  assert(await p.locator(".map-preview").isVisible(), "Map quick detail");
  await nav("Baselines");
  await p.getByRole("button", { name: "Criar baseline" }).click();
  await p.locator("input[name=value]").fill("Release teste");
  await p
    .getByRole("dialog")
    .getByRole("button", { name: "Confirmar", exact: true })
    .click();
  await p.getByRole("dialog").waitFor({ state: "hidden" });
  assert(
    (await p
      .getByRole("heading", { name: "Release teste", exact: true })
      .count()) === 1,
    "Baseline",
  );
  await nav("Membros");
  await p.getByRole("button", { name: "Convidar membro" }).click();
  await p.locator("input[name=value]").fill("teste@exemplo.com");
  await p
    .getByRole("dialog")
    .getByRole("button", { name: "Confirmar", exact: true })
    .click();
  await p.getByRole("dialog").waitFor({ state: "hidden" });
  assert(
    (await p
      .getByRole("cell", { name: "Convite pendente", exact: true })
      .count()) === 1,
    "Pending invite",
  );
  await nav("Visão geral");
  await p.reload();
  assert(
    (await p
      .getByRole("heading", { name: "Épico de teste", exact: true })
      .count()) === 1,
    "Persistence",
  );
  await nav("Projetos");
  await p.getByRole("button", { name: "Novo projeto" }).click();
  await p.locator("input[name=value]").fill("Projeto isolado");
  await p
    .getByRole("dialog")
    .getByRole("button", { name: "Confirmar", exact: true })
    .click();
  await p.getByRole("dialog").waitFor({ state: "hidden" });
  await p
    .locator(".feature-card")
    .filter({
      has: p.getByRole("heading", { name: "Projeto isolado", exact: true }),
    })
    .getByRole("button", { name: "Abrir projeto" })
    .click();
  await p.getByRole("heading", { name: "Visão geral." }).waitFor();
  assert(
    (await p.locator(".epic-card").count()) === 0,
    "New project starts empty",
  );
  await p.getByRole("button", { name: "＋ Novo épico", exact: true }).click();
  await p.locator("input[name=title]").fill("Épico exclusivo");
  await p.getByRole("button", { name: "Salvar épico", exact: true }).click();
  await p
    .getByRole("heading", { name: "Épico exclusivo", exact: true })
    .waitFor();
  await nav("Projetos");
  await p
    .locator(".feature-card")
    .filter({
      has: p.getByRole("heading", { name: "Plataforma Athena", exact: true }),
    })
    .getByRole("button", { name: "Abrir projeto" })
    .click();
  await p
    .getByRole("heading", { name: "Épico de teste", exact: true })
    .waitFor();
  assert(
    (await p
      .getByRole("heading", { name: "Épico exclusivo", exact: true })
      .count()) === 0,
    "Project data isolated",
  );
  await nav("Telas de acesso");
  await p.getByRole("button", { name: "Esqueci minha senha" }).click();
  await p.locator("input[name=email]").fill("demo@exemplo.com");
  await p.getByRole("button", { name: "Continuar recuperação" }).click();
  await p.locator("input[name=code]").fill("123456");
  await p.locator("input[name=password]").fill("Exemplo123!");
  await p.locator("input[name=confirm]").fill("Exemplo123!");
  await p.getByRole("button", { name: "Redefinir na demonstração" }).click();
  await p.getByRole("button", { name: "Entrar na demonstração" }).waitFor();
  await nav("Visão geral");
  await p.setViewportSize({ width: 390, height: 844 });
  await p.screenshot({ path: "test-results/mobile.png", fullPage: true });
  assert(
    await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    "Mobile overflow",
  );
  assert(errors.length === 0, "Console errors " + JSON.stringify(errors));
  console.log(
    "PASS: create epic and requirement; BDD; submit/approve/publish; immutable book; all sections; relations; map detail; baselines; invites; project isolation; recovery screens; reload persistence; mobile layout; no browser errors.",
  );
  await b.close();
  server.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
