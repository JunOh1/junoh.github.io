#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { execFileSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const workerPath = path.join(repoRoot, "worker", "worker.js");
const workerDir = path.join(repoRoot, "worker");
const wranglerPath = path.join(workerDir, "node_modules", ".bin", "wrangler");
const nodePath =
  "/Users/jun/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node";

function askMultiline(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const lines = [];

  return new Promise(resolve => {
    console.log(prompt);
    console.log("(Paste entries, then press Enter on a blank line.)");

    let resolved = false;

    function finish() {
      if (resolved) {
        return;
      }

      resolved = true;
      rl.close();
      resolve(lines.join("\n"));
    }

    rl.on("line", line => {
      if (!line.trim()) {
        finish();
        return;
      }

      lines.push(line);
    });

    rl.on("close", finish);
  });
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function extractIps(text) {
  const ipv4 =
    text.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) || [];

  const ipv6 =
    text.match(/\b(?:[a-f0-9]{1,4}:){2,}[a-f0-9:]{1,}\b/gi) || [];

  return unique([...ipv4, ...ipv6].map(ip => ip.toLowerCase()));
}

function extractOrgs(text) {
  return unique(
    text
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => line.replace(/^["']|["']$/g, ""))
      .map(line => line.toLowerCase())
  );
}

function readQuotedValues(block) {
  return [...block.matchAll(/["']([^"']+)["']/g)].map(match => match[1]);
}

function formatJsArray(values, indent) {
  return values
    .map((value, index) => {
      const comma = index === values.length - 1 ? "" : ",";
      return `${indent}"${value}"${comma}`;
    })
    .join("\n");
}

function formatSqlArray(values, indent) {
  return values
    .map((value, index) => {
      const comma = index === values.length - 1 ? "" : ",";
      return `${indent}'${value}'${comma}`;
    })
    .join("\n");
}

function updateBannedIpFunction(source, newIps) {
  const pattern =
    /function isBannedBotIp\(ip\) \{\n  return \[\n([\s\S]*?)\n  \]\.includes\(ip\);\n\}/;

  return source.replace(pattern, (match, body) => {
    const values =
      unique([...readQuotedValues(body), ...newIps]);

    return [
      "function isBannedBotIp(ip) {",
      "  return [",
      formatJsArray(values, "    "),
      "  ].includes(ip);",
      "}"
    ].join("\n");
  });
}

function updateSqlIpCases(source, newIps) {
  return source.replace(
    /WHEN ip IN \(\n([\s\S]*?)\n\s+\) THEN 1/g,
    (match, body) => {
      const values =
        unique([...readQuotedValues(body), ...newIps]);

      return [
        "WHEN ip IN (",
        formatSqlArray(values, "            "),
        "          ) THEN 1"
      ].join("\n");
    }
  );
}

function updateBannedOrgFunction(source, newOrgs) {
  if (!newOrgs.length) {
    return source;
  }

  const pattern =
    /function isBannedBotOrg\(org\) \{[\s\S]*?\n  return \(\n([\s\S]*?)\n  \);\n\}/;

  return source.replace(pattern, (match, body) => {
    const existing =
      [...body.matchAll(/normalizedOrg\.includes\("([^"]+)"\)|\/\^ovh\\b\/\.test\(normalizedOrg\)/g)]
        .map(matchValue => matchValue[1] || "__OVH_REGEX__");

    const values =
      unique([...existing, ...newOrgs]);

    const conditions =
      values.map(value => {
        if (value === "__OVH_REGEX__") {
          return "/^ovh\\b/.test(normalizedOrg)";
        }

        return `normalizedOrg.includes("${value.replaceAll('"', '\\"')}")`;
      });

    const formatted =
      conditions
        .map((condition, index) => {
          const suffix = index === conditions.length - 1 ? "" : " ||";
          return `    ${condition}${suffix}`;
        })
        .join("\n");

    return [
      "function isBannedBotOrg(org) {",
      "  const normalizedOrg =",
      "    String(org || \"\").toLowerCase();",
      "",
      "  return (",
      formatted,
      "  );",
      "}"
    ].join("\n");
  });
}

function run(command, args, cwd = repoRoot) {
  execFileSync(command, args, {
    cwd,
    stdio: "inherit"
  });
}

function queryRecentOriginInternetIds() {
  const sql = `
    SELECT 'log' AS source, id
    FROM visitor_logs
    WHERE lower(coalesce(org,'')) = 'origin internet'
      AND ts >= strftime('%Y-%m-%dT%H:%M:%fZ','now','-30 days')
    UNION ALL
    SELECT 'event' AS source, id
    FROM visitor_events
    WHERE lower(coalesce(org,'')) = 'origin internet'
      AND ts >= strftime('%Y-%m-%dT%H:%M:%fZ','now','-30 days')
  `;

  let output;
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      output = execFileSync(
        wranglerPath,
        [
          "d1", "execute", "visitor_logs", "--remote", "--json",
          "--command", sql
        ],
        {
          cwd: workerDir,
          encoding: "utf8",
          env: {
            ...process.env,
            // Keep Wrangler's logs out of the home config directory, which
            // may be unavailable in managed or locked-down environments.
            WRANGLER_LOG_PATH: path.join(workerDir, ".wrangler", "logs"),
            WRANGLER_WRITE_LOGS: "false"
          },
          stdio: ["ignore", "pipe", "pipe"]
        }
      );
      break;
    } catch (error) {
      const stdout = error.stdout?.toString().trim();
      const stderr = error.stderr?.toString().trim();
      let detail = stderr || stdout || error.message;
      try {
        const response = JSON.parse(stdout);
        detail = response?.error?.text || detail;
      } catch {
        // Keep Wrangler's original output when it is not JSON.
      }
      lastError = new Error(detail);

      if (!/fetch failed/i.test(detail) || attempt === 3) {
        throw lastError;
      }

      console.warn(`D1 lookup hit a network error; retrying (${attempt}/3)...`);
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, attempt * 1000);
    }
  }

  if (!output) {
    throw lastError || new Error("Wrangler did not return a D1 query result.");
  }

  let payload;
  try {
    payload = JSON.parse(output);
  } catch {
    throw new Error(
      "Could not parse Wrangler's JSON response while looking up recent Origin Internet records."
    );
  }

  if (payload?.error) {
    throw new Error(
      payload.error.text || "Wrangler could not query the remote analytics database."
    );
  }

  const batches = Array.isArray(payload) ? payload : [payload];
  const rows = batches.flatMap(batch => batch.results || []);
  const idsBySource = { log: [], event: [] };

  for (const row of rows) {
    const id = Number(row.id);
    if (
      Object.hasOwn(idsBySource, row.source) &&
      Number.isSafeInteger(id) &&
      id > 0
    ) {
      idsBySource[row.source].push(id);
    }
  }

  idsBySource.log = [...new Set(idsBySource.log)].sort((a, b) => a - b);
  idsBySource.event = [...new Set(idsBySource.event)].sort((a, b) => a - b);
  return idsBySource;
}

function refreshHistoricalOriginBotIdsBestEffort(source) {
  try {
    return refreshHistoricalOriginBotIds(source);
  } catch (error) {
    console.warn(
      `Could not refresh recent Origin Internet IDs; continuing with the existing ID lists.\n${error.message}`
    );
    return source;
  }
}

function updateHistoricalBotIds(source, caseName, newIds) {
  const start = source.indexOf(`const ${caseName} = \``);
  const end = start < 0 ? -1 : source.indexOf("`;", start);
  if (start < 0 || end < 0) {
    throw new Error(`Could not find ${caseName} in worker/worker.js.`);
  }

  const block = source.slice(start, end + 2);
  const idClausePattern = /^[ \t]*WHEN id IN \(([\s\S]*?)\) THEN 1\n?/m;
  const idClause = idClausePattern.exec(block);
  const existingIds = idClause
    ? (idClause[1].match(/\b\d+\b/g) || []).map(Number)
    : [];
  const mergedIds = [...new Set([...existingIds, ...newIds])]
    .sort((a, b) => a - b);
  if (!mergedIds.length) {
    // Record IDs begin at 1, so this keeps the CASE shape without matching rows.
    mergedIds.push(0);
  }
  const lines = [];

  for (let index = 0; index < mergedIds.length; index += 9) {
    const chunk = mergedIds.slice(index, index + 9);
    const comma = index + chunk.length < mergedIds.length ? "," : "";
    lines.push(
      `            ${chunk.join(", ")}${comma}`
    );
  }

  const clause = [
    "          WHEN id IN (",
    ...lines,
    "          ) THEN 1"
  ].join("\n");

  const withoutIdClause = idClause
    ? block.slice(0, idClause.index) + block.slice(idClause.index + idClause[0].length)
    : block;
  const universityOverride =
    /WHEN \(\$\{academicOrganizationCase\}\) THEN 0\n|WHEN lower\(coalesce\(org,''\)\) LIKE '%university%' THEN 0\n/.exec(withoutIdClause);
  let insertAt;

  if (universityOverride) {
    insertAt = universityOverride.index + universityOverride[0].length;
  } else {
    const caseMarker = "CASE\n";
    const caseIndex = withoutIdClause.indexOf(caseMarker);
    if (caseIndex < 0) {
      throw new Error(`Could not find the CASE expression in ${caseName}.`);
    }
    insertAt = caseIndex + caseMarker.length;
  }

  const updatedBlock =
    withoutIdClause.slice(0, insertAt) + clause + "\n" + withoutIdClause.slice(insertAt);

  return source.slice(0, start) + updatedBlock + source.slice(end + 2);
}

function refreshHistoricalOriginBotIds(source) {
  const originIds = queryRecentOriginInternetIds();
  let updated = updateHistoricalBotIds(source, "logBotCase", originIds.log);
  updated = updateHistoricalBotIds(updated, "eventBotCase", originIds.event);

  console.log(
    `Included ${originIds.log.length} existing Origin Internet page-view ID(s) and ` +
    `${originIds.event.length} click-event ID(s) from the last 30 days.`
  );

  return updated;
}

function refreshAdminBotView() {
  const before = fs.readFileSync(workerPath, "utf8");
  const source = refreshHistoricalOriginBotIds(before);

  if (source !== before) {
    fs.writeFileSync(workerPath, source);
  }

  const checks = [
    [
      "University organizations override the page-view bot classifier",
      /const logBotCase = `\s*CASE\s*WHEN \(\$\{academicOrganizationCase\}\) THEN 0/
    ],
    [
      "University organizations override the link-click bot classifier",
      /const eventBotCase = `\s*CASE\s*WHEN \(\$\{academicOrganizationCase\}\) THEN 0/
    ],
    [
      "page-view bot classification supports historical record IDs",
      /const logBotCase = `[\s\S]*?WHEN id IN \([\s\S]*?\) THEN 1/
    ],
    [
      "link-click bot classification supports historical record IDs",
      /const eventBotCase = `[\s\S]*?WHEN id IN \([\s\S]*?\) THEN 1/
    ],
    [
      "the page-view Total filter keeps non-bots and recent bots",
      /commonLogFilters\.push\(\s*`\(\$\{logBotCase\} = 0 OR ts >= '\$\{botRetentionStart\}'\)`/
    ],
    [
      "the link-click Total filter keeps non-bots and recent bots",
      /eventFilters\.push\(\s*`\(\$\{eventBotCase\} = 0 OR ts >= '\$\{botRetentionStart\}'\)`/
    ],
    [
      "the cutoff rolls forward by 30 days",
      /new Date\(Date\.now\(\) - 30 \* 24 \* 60 \* 60 \* 1000\)\.toISOString\(\)/
    ]
  ];

  const missing = checks
    .filter(([, pattern]) => !pattern.test(source))
    .map(([description]) => description);

  if (missing.length) {
    throw new Error(
      `The worker is missing required admin bot-filter rules:\n- ${missing.join("\n- ")}`
    );
  }

  console.log("Admin bot filters are present:");
  for (const [description] of checks) {
    console.log(`- ${description}`);
  }
  console.log("\nDeploying the admin bot filters to Cloudflare...");

  const npmPath = [
    "/opt/homebrew/bin/npm",
    "/usr/local/bin/npm"
  ].find(candidate => fs.existsSync(candidate)) || "npm";

  run(npmPath, ["run", "deploy"], path.join(repoRoot, "worker"));
}

async function main() {
  if (process.argv.includes("--refresh-admin")) {
    refreshAdminBotView();
    return;
  }

  const ipText =
    await askMultiline("Paste bot IPs or whatismyipaddress links:");

  const orgText =
    await askMultiline("Paste organization names to hard-block, if any:");

  const newIps =
    extractIps(ipText);

  const newOrgs =
    extractOrgs(orgText);

  if (!newIps.length && !newOrgs.length) {
    console.log("No new IPs or organizations entered; refreshing admin bot filters.");
    refreshAdminBotView();
    return;
  }

  const before =
    fs.readFileSync(workerPath, "utf8");

  let after = before;
  after = updateBannedIpFunction(after, newIps);
  after = updateSqlIpCases(after, newIps);
  after = updateBannedOrgFunction(after, newOrgs);
  after = refreshHistoricalOriginBotIdsBestEffort(after);

  if (after === before) {
    console.log("No filter changes needed; everything was already present.");
    return;
  }

  fs.writeFileSync(workerPath, after);

  console.log("\nUpdated worker/worker.js");
  if (newIps.length) {
    console.log(`IPs found: ${newIps.join(", ")}`);
  }
  if (newOrgs.length) {
    console.log(`Organizations found: ${newOrgs.join(", ")}`);
  }

  console.log("\nChecking Worker syntax...");
  run(nodePath, ["--check", "worker/worker.js"]);

  console.log("\nCreating git commit...");
  run("git", ["add", "worker/worker.js"]);

  const message =
    newOrgs.length && newIps.length
      ? "Add bot IP and organization filters"
      : newOrgs.length
        ? "Add bot organization filters"
        : "Add bot IP filters";

  run("git", ["commit", "-m", message]);

  console.log("\nPushing to GitHub...");
  run("git", ["push", "origin", "master"]);

  console.log("\nDone. Cloudflare should auto-deploy from GitHub.");
}

main().catch(error => {
  console.error("\nBot filter update failed:");
  console.error(error.message);
  process.exit(1);
});
