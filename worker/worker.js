function countryName(code) {
  try {
    return new Intl.DisplayNames(
      ["en"],
      { type: "region" }
    ).of(code);
  } catch {
    return code;
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeOrg(org) {
  const map = {
    "UNI-Milano - Bocconi": "Bocconi University",
    "Universitaet Hamburg campus net": "University of Hamburg",
    "NUS Gigapop": "National University of Singapore",
    "imported inetnum object for NUS-1": "National University of Singapore",
    "universitaet Hamburg campus net": "Universitaet Hamburg",
    "Lamont-Doherty Earth Observatory of Columbia University": "Columbia University",
    "The Hong Kong University of Science and Technology": "Hong Kong University of Science and Technology"
  };

  return map[org] || org;
}

function getCookie(request, name) {
  const cookie = request.headers.get("cookie") || "";

  return cookie
    .split(";")
    .map(part => part.trim())
    .find(part => part.startsWith(name + "="))
    ?.slice(name.length + 1) || "";
}

function rangeStart(range) {
  const now = new Date();

  if (range === "today") {
    return new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
      )
    ).toISOString();
  }

  if (range === "7d") {
    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  }

  if (range === "30d") {
    return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  }

  return "";
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    const goLinks = {
      "sso": "https://doi.org/10.2308/TAR-2022-0544",
      "media-conglomeration": "https://doi.org/10.1287/mnsc.2023.02247",
      "contract-contingencies": "https://doi.org/10.1016/j.jacceco.2024.101743",
      "antitrust-ma": "https://doi.org/10.1016/j.jacceco.2026.101884",
      "algorithmic-trading": "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4202175",
      "whispering-progress": "https://doi.org/10.1016/j.jacceco.2026.101904",
      "reverse-engineering": "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5525158",
      "resume-washing": "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6480522"
    };

    if (path.startsWith("/go/")) {
      const slug =
        decodeURIComponent(path.replace("/go/", ""));

      const target =
        goLinks[slug];

      if (!target) {
        return new Response("Link not found", { status: 404 });
      }

      const ip =
        request.headers.get("cf-connecting-ip") || "";

      const ua =
        request.headers.get("user-agent") || "";

      const referer =
        request.headers.get("referer") || "";


      const isMyVisit =
        ip === "195.133.129.113" ||
        ip === "195.252.220.27";

      const isCloudflarePreview =
        request.cf?.asOrganization === "Cloudflare, Inc." ||
        referer.includes("preview.devprod.cloudflare.dev") ||
        referer.includes("dash.cloudflare.com");

      if (!isMyVisit && !isCloudflarePreview) {
        await env.DB.prepare(`
          INSERT INTO visitor_events
          (
            ts,
            event_type,
            page,
            target,
            text,
            visitor_id,
            session_id,
            ip,
            country,
            city,
            org
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
          .bind(
            new Date().toISOString(),
            "go_click",
            referer,
            target,
            slug,
            ip || ua,
            getCookie(request, "session_id"),
            ip,
            countryName(request.cf?.country || ""),
            request.cf?.city || "",
            normalizeOrg(request.cf?.asOrganization || "")
          )
          .run();
      }

      return Response.redirect(target, 302);
    }
    // =========================
    // DATA DOWNLOADS
    // =========================

    async function logDownload(label) {
      const ip =
        request.headers.get("cf-connecting-ip") || "";

      const ua =
        request.headers.get("user-agent") || "";

      const referer =
        request.headers.get("referer") || "";

      const isMyVisit =
        ip === "195.133.129.113" ||
        ip === "195.252.220.27";

      const isCloudflarePreview =
        request.cf?.asOrganization === "Cloudflare, Inc." ||
        referer.includes("preview.devprod.cloudflare.dev") ||
        referer.includes("dash.cloudflare.com");

      if (isMyVisit || isCloudflarePreview) {
        return;
      }

      const sessionId =
        getCookie(request, "session_id");

      await env.DB.prepare(`
        INSERT INTO visitor_logs
        (
          ts,
          country,
          city,
          asn,
          org,
          path,
          ua,
          browser,
          referer,
          device_type,
          visitor_id,
          ip,
          session_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
        .bind(
          new Date().toISOString(),
          countryName(request.cf?.country || ""),
          request.cf?.city || "",
          request.cf?.asn || 0,
          normalizeOrg(request.cf?.asOrganization || ""),
          `DOWNLOAD: ${label}`,
          ua,
          "Download",
          referer,
          /mobile/i.test(ua) ? "mobile" : "desktop",
          ip || ua,
          ip,
          sessionId
        )
        .run();
    }

    if (path === "/download/firm-level") {
      await logDownload("Firm-level AFI");

      return Response.redirect(
        "https://www.dropbox.com/scl/fi/gox02ksq838n6qemn1sig/auto_fear_firm_level.dta?rlkey=fj1bud6mz7u16rf7h44zfgv2u&st=6zkdpt28&dl=0",
        302
      );
    }

    if (path === "/download/dma-level") {
      await logDownload("DMA-level AFI");

      return Response.redirect(
        "https://www.dropbox.com/scl/fi/47edranxqbyrxw41sb5pm/auto_fear_dma_level.dta?rlkey=c8uhsfdm9w545zgz77sgcrxl1&st=zhgede1i&dl=0",
        302
      );
    }



    // =====================================================
    // ADMIN DASHBOARD
    // =====================================================

    if (path === "/admin") {
      const PAGE_SIZE = 20;

      const page =
        Math.max(1, parseInt(url.searchParams.get("page") || "1"));

      const orgPage =
        Math.max(1, parseInt(url.searchParams.get("orgPage") || "1"));

      const countryPage =
        Math.max(1, parseInt(url.searchParams.get("countryPage") || "1"));

      const dailyPage =
        Math.max(1, parseInt(url.searchParams.get("dailyPage") || "1"));

      const linkPage =
        Math.max(1, parseInt(url.searchParams.get("linkPage") || "1"));

      const downloadPage =
        Math.max(
          1,
          parseInt(url.searchParams.get("downloadPage") || "1")
        );

      const offset =
        (page - 1) * PAGE_SIZE;

      const orgOffset =
        (orgPage - 1) * PAGE_SIZE;

      const countryOffset =
        (countryPage - 1) * PAGE_SIZE;

      const dailyOffset =
        (dailyPage - 1) * PAGE_SIZE;

      const downloadOffset =
        (downloadPage - 1) * PAGE_SIZE;

      const linkOffset =
        (linkPage - 1) * PAGE_SIZE;

      const requestedRange =
        url.searchParams.get("range") || "all";

      const allowedRanges =
        ["today", "7d", "30d", "all"];

      const activeRange =
        allowedRanges.includes(requestedRange)
          ? requestedRange
          : "all";

      const requestedView =
        url.searchParams.get("view") || "human";

      const activeView =
        requestedView === "human" ? "human" : "total";

      const activeParents =
        url.searchParams.get("parents") === "exclude"
          ? "exclude"
          : "include";

      const startDate =
        rangeStart(activeRange);

      const rangeParams =
        startDate ? [startDate] : [];

      const normalizedOrgSql = `
        CASE
          WHEN org IN (
            'The Hong Kong University of Science and Technology',
            'Hong Kong University of Science and Technology'
          )
          THEN 'Hong Kong University of Science and Technology'
          ELSE org
        END
      `;

      const logBotCase = `
        CASE
          WHEN lower(coalesce(org,'')) LIKE '%cloudflare%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%amazon%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%aws%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%internetbolaget hosting in sweden%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%internetbolaget sweden ab%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%granslosa system gsys kb%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%rica web services%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%iyi bir net%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%google cloud%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%alibaba cloud%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%tencent cloud%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%microsoft%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%azure%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%digitalocean%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%hetzner%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%ovh%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%cisco opendns llc%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%clodo cloud service co%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%cloudtechlabs llc%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%linode%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%akamai%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%collyer quay%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%vultr%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%internet vikings%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%oracle%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%leaseweb%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%hostpapa%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%contabo%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%choopa%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%datacamp%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%m247%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%1337 services%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%internet vikings%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%aceville pte%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%techoff srv%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%infrastructure group%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%egihosting%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%liberally network, llc%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%g-core labs customer%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%subnet digital%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%bl networks%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%google llc%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%palo alto networks%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%digital ocean, inc%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%virtual systems llc%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%pt gunung sedayu sentosa%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%tralex dedicated servers%' THEN 1
          WHEN lower(coalesce(ua,'')) LIKE '%bot%' THEN 1
          WHEN lower(coalesce(ua,'')) LIKE '%crawler%' THEN 1
          WHEN lower(coalesce(ua,'')) LIKE '%spider%' THEN 1
          WHEN lower(coalesce(ua,'')) LIKE '%slurp%' THEN 1
          WHEN lower(coalesce(ua,'')) LIKE '%headless%' THEN 1
          WHEN lower(coalesce(ua,'')) LIKE '%python%' THEN 1
          WHEN lower(coalesce(ua,'')) LIKE '%curl%' THEN 1
          WHEN lower(coalesce(ua,'')) LIKE '%wget%' THEN 1
          WHEN lower(coalesce(ua,'')) LIKE '%httpclient%' THEN 1
          WHEN lower(coalesce(ua,'')) LIKE '%go-http-client%' THEN 1
          ELSE 0
        END
      `;

      const eventBotCase = `
        CASE
          WHEN lower(coalesce(org,'')) LIKE '%cloudflare%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%collyer quay%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%amazon%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%aws%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%internetbolaget hosting in sweden%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%internetbolaget sweden ab%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%granslosa system gsys kb%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%rica web services%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%iyi bir net%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%google cloud%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%alibaba cloud%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%tencent cloud%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%microsoft%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%azure%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%digitalocean%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%hetzner%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%ovh%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%cisco opendns llc%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%clodo cloud service co%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%cloudtechlabs llc%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%linode%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%akamai%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%vultr%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%oracle%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%hostpapa%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%leaseweb%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%contabo%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%choopa%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%datacamp%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%liberally network, llc%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%m247%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%g-core labs customer%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%1337 services%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%internet vikings%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%aceville pte%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%techoff srv%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%infrastructure group%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%egihosting%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%subnet digital%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%bl networks%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%google llc%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%pt gunung sedayu sentosa%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%palo alto networks%' THEN 1      
          WHEN lower(coalesce(org,'')) LIKE '%digital ocean, inc%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%virtual systems llc%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%tralex dedicated servers%' THEN 1
          ELSE 0
        END
      `;

      const commonLogFilters = [];

      if (startDate) {
        commonLogFilters.push("ts >= ?");
      }

      if (activeView === "human") {
        commonLogFilters.push(`${logBotCase} = 0`);
      }

      if (activeParents === "exclude") {
        commonLogFilters.push("ip != '59.15.80.113'");
      }

      const downloadFilters = [
        "path LIKE 'DOWNLOAD:%'",
        ...commonLogFilters
      ];

      const referrerFilters = [
        "referer IS NOT NULL",
        "referer != ''",
        ...commonLogFilters
      ];

      const logWhere =
        commonLogFilters.length
          ? `WHERE ${commonLogFilters.join(" AND ")}`
          : "";

      const downloadWhere =
        `WHERE ${downloadFilters.join(" AND ")}`;

      const referrerWhere =
        `WHERE ${referrerFilters.join(" AND ")}`;

      const academicWhere = `
        WHERE
          (
            lower(org) LIKE '%university%'
            OR lower(org) LIKE '%college%'
            OR lower(org) LIKE '%school%'
            OR lower(org) LIKE '%academy%'
            OR lower(org) LIKE '%universitat%'
            OR lower(org) LIKE '%universitaet%'
            OR lower(org) LIKE '%université%'
            OR lower(org) LIKE '%universita%'
            OR lower(org) LIKE '%universidad%'
            OR lower(org) LIKE '%universidade%'
            OR lower(org) LIKE '%institute%'
          )
          ${commonLogFilters.length
            ? `AND ${commonLogFilters.join(" AND ")}`
            : ""}
      `;

      const eventFilters = [
        "event_type = 'go_click'"
      ];

      if (startDate) {
        eventFilters.push("ts >= ?");
      }

      if (activeView === "human") {
        eventFilters.push(`${eventBotCase} = 0`);
      }

      if (activeParents === "exclude") {
        eventFilters.push("ip != '59.15.80.113'");
      }

      const eventWhere =
        `WHERE ${eventFilters.join(" AND ")}`;

      function adminUrl(overrides = {}) {
        const params = new URLSearchParams();

        params.set("range", overrides.range || activeRange);
        params.set("view", overrides.view || activeView);
        params.set("parents", overrides.parents || activeParents);

        const nextPage =
          overrides.page || page;

        const nextOrgPage =
          overrides.orgPage || orgPage;

        const nextCountryPage =
          overrides.countryPage || countryPage;

        const nextDailyPage =
          overrides.dailyPage || dailyPage;

        const nextLinkPage =
          overrides.linkPage || linkPage;

        const nextDownloadPage =
          overrides.downloadPage || downloadPage;

        if (nextPage > 1) {
          params.set("page", String(nextPage));
        }

        if (nextOrgPage > 1) {
          params.set("orgPage", String(nextOrgPage));
        }

        if (nextCountryPage > 1) {
          params.set("countryPage", String(nextCountryPage));
        }

        if (nextDailyPage > 1) {
          params.set("dailyPage", String(nextDailyPage));
        }

        if (nextLinkPage > 1) {
          params.set("linkPage", String(nextLinkPage));
        }

        if (nextDownloadPage > 1) {
          params.set("downloadPage", String(nextDownloadPage));
        }

        return `/admin?${params.toString()}`;
      }

      function rangeLink(label, value) {
        const active =
          activeRange === value ? " active" : "";

        return `<a class="range-link${active}" href="${adminUrl({
          range: value,
          page: 1,
          orgPage: 1,
          countryPage: 1,
          dailyPage: 1,
          linkPage: 1,
          downloadPage: 1
        })}">
          ${label}
        </a>`;
      }

      function viewLink(label, value) {
        const active =
          activeView === value ? " active" : "";

        return `<a class="range-link${active}" href="${adminUrl({
          view: value,
          page: 1,
          orgPage: 1,
          countryPage: 1,
          dailyPage: 1,
          linkPage: 1,
          downloadPage: 1
        })}">
          ${label}
        </a>`;
      }

      function parentLink(label, value) {
        const active =
          activeParents === value ? " active" : "";

        return `<a class="range-link${active}" href="${adminUrl({
          parents: value,
          page: 1,
          orgPage: 1,
          countryPage: 1,
          dailyPage: 1,
          linkPage: 1,
          downloadPage: 1
        })}">
          ${label}
        </a>`;
      }

      function pager(paramName, currentPage, hasNext, anchor = "") {
        const hash =
          anchor ? `#${anchor}` : "";

        let out = `
<div class="pager">
`;

        if (currentPage > 1) {
          const prev = {};
          prev[paramName] = currentPage - 1;

          out += `<a href="${adminUrl(prev)}${hash}">Previous</a>`;
        }

        if (hasNext) {
          const next = {};
          next[paramName] = currentPage + 1;

          out += `<a href="${adminUrl(next)}${hash}">Next</a>`;
        }

        out += `
</div>
`;

        return out;
      }

      const recentRaw = await env.DB.prepare(`
        SELECT
          ts,
          org,
          browser,
          device_type,
          path,
          country,
          city,
          referer,
          ip,
          ${logBotCase} AS likely_bot
        FROM visitor_logs
        ${logWhere}
        ORDER BY id DESC
        LIMIT ?
        OFFSET ?
      `)
        .bind(...rangeParams, PAGE_SIZE + 1, offset)
        .all();

      const recentHasNext =
        recentRaw.results.length > PAGE_SIZE;

      const recentRows =
        recentRaw.results.slice(0, PAGE_SIZE);

      const totals = await env.DB.prepare(`
        SELECT
          COUNT(*) AS total_pageviews,
          COUNT(DISTINCT visitor_id) AS unique_visitors,
          COUNT(DISTINCT
            CASE
              WHEN session_id IS NOT NULL AND session_id != ''
              THEN session_id
              ELSE visitor_id || ':' || substr(ts,1,13)
            END
          ) AS total_visits
        FROM visitor_logs
        ${logWhere}
      `)
        .bind(...rangeParams)
        .all();

      const totalPageviews =
        totals.results[0]?.total_pageviews || 0;

      const uniqueVisitors =
        totals.results[0]?.unique_visitors || 0;

      const totalVisits =
        totals.results[0]?.total_visits || 0;

      const viewsPerVisit =
        totalVisits > 0
          ? (totalPageviews / totalVisits).toFixed(1)
          : "0";

      const topOrgsRaw = await env.DB.prepare(`
        SELECT
          ${normalizedOrgSql} AS org,
          COUNT(*) AS visits
        FROM visitor_logs
        ${academicWhere}
        GROUP BY ${normalizedOrgSql}
        ORDER BY visits DESC
        LIMIT ?
        OFFSET ?
      `)
        .bind(...rangeParams, PAGE_SIZE + 1, orgOffset)
        .all();

      const topOrgsHasNext =
        topOrgsRaw.results.length > PAGE_SIZE;

      const topOrgs =
        topOrgsRaw.results.slice(0, PAGE_SIZE);

      const topPages = await env.DB.prepare(`
        SELECT
          path,
          COUNT(*) AS visits
        FROM visitor_logs
        ${logWhere}
        GROUP BY path
        ORDER BY visits DESC
        LIMIT 20
      `)
        .bind(...rangeParams)
        .all();

      const countriesRaw = await env.DB.prepare(`
        SELECT
          country,
          COUNT(*) AS visits
        FROM visitor_logs
        ${logWhere}
        GROUP BY country
        ORDER BY visits DESC
        LIMIT ?
        OFFSET ?
      `)
        .bind(...rangeParams, PAGE_SIZE + 1, countryOffset)
        .all();

      const countriesHasNext =
        countriesRaw.results.length > PAGE_SIZE;

      const countries =
        countriesRaw.results.slice(0, PAGE_SIZE);

      const topReferrersRaw = await env.DB.prepare(`
        SELECT
          referer,
          COUNT(*) AS visits
        FROM visitor_logs
        ${referrerWhere}
          AND lower(referer) NOT LIKE '%junoh.me%'
          AND lower(referer) NOT LIKE '%junoh.github.io%'
          AND lower(referer) NOT LIKE '%junoh1.github.io%'
          AND NOT EXISTS (
            SELECT 1
            FROM visitor_logs earlier
            WHERE
              coalesce(earlier.session_id, earlier.visitor_id, '') =
                coalesce(visitor_logs.session_id, visitor_logs.visitor_id, '')
              AND earlier.ts < visitor_logs.ts
          )
        GROUP BY referer
        ORDER BY visits DESC
      `)
        .bind(...rangeParams)
        .all();

      const referrerTotals = {};

      for (const row of topReferrersRaw.results) {
        const label =
          normalizeReferrer(row.referer);

        if (!label) {
          continue;
        }

        referrerTotals[label] =
          (referrerTotals[label] || 0) + row.visits;
      }

      const topReferrers =
        Object.entries(referrerTotals)
          .map(([referer, visits]) => ({ referer, visits }))
          .sort((a, b) => b.visits - a.visits)
          .slice(0, 20);

      const topLocations = await env.DB.prepare(`
        SELECT
          country,
          city,
          COUNT(*) AS visits
        FROM visitor_logs
        ${logWhere}
        GROUP BY country, city
        ORDER BY visits DESC
        LIMIT 20
      `)
        .bind(...rangeParams)
        .all();

      // ======================================
      // DATA DOWNLOAD ANALYTICS
      // ======================================

      const downloads = await env.DB.prepare(`
        SELECT
          path,
          COUNT(*) AS downloads
        FROM visitor_logs
        ${downloadWhere}
        GROUP BY path
        ORDER BY downloads DESC
      `)
        .bind(...rangeParams)
        .all();

      const topDownloaders = await env.DB.prepare(`
        SELECT
          ${normalizedOrgSql} AS org,
          COUNT(*) AS downloads
        FROM visitor_logs
        ${downloadWhere}
        GROUP BY ${normalizedOrgSql}
        ORDER BY downloads DESC
        LIMIT 20
      `)
        .bind(...rangeParams)
        .all();

      const downloadHistoryRaw =
        await env.DB.prepare(`
          SELECT
            ts,
            path,
            ${normalizedOrgSql} AS org,
            country,
            ip,
            ${logBotCase} AS likely_bot
          FROM visitor_logs
          ${downloadWhere}
          ORDER BY ts DESC
          LIMIT ?
          OFFSET ?
        `)
        .bind(...rangeParams, PAGE_SIZE + 1, downloadOffset)
        .all();

      const downloadHistoryHasNext =
        downloadHistoryRaw.results.length > PAGE_SIZE;

      const downloadHistory =
        downloadHistoryRaw.results.slice(0, PAGE_SIZE);

      const linkClickDetails = await env.DB.prepare(`
        SELECT
          ts,
          text,
          target,
          country,
          city,
          org,
          ip,
          ${eventBotCase} AS likely_bot
        FROM visitor_events
        ${eventWhere}
        ORDER BY ts DESC
        LIMIT ?
        OFFSET ?
      `)
        .bind(...rangeParams, PAGE_SIZE + 1, linkOffset)
        .all();

      const linkHasNext =
        linkClickDetails.results.length > PAGE_SIZE;

      const linkRows =
        linkClickDetails.results.slice(0, PAGE_SIZE);

      const linkTotals = await env.DB.prepare(`
        SELECT
          text,
          target,
          COUNT(*) AS clicks
        FROM visitor_events
        ${eventWhere}
        GROUP BY text, target
        ORDER BY clicks DESC
      `)
        .bind(...rangeParams)
        .all();

      const dailyRaw = await env.DB.prepare(`
        SELECT
          substr(ts,1,10) AS date,
          COUNT(*) AS pageviews,
          COUNT(DISTINCT visitor_id) AS unique_visitors,
          COUNT(DISTINCT
            CASE
              WHEN session_id IS NOT NULL AND session_id != ''
              THEN session_id
              ELSE visitor_id || ':' || substr(ts,1,13)
            END
          ) AS visits
        FROM visitor_logs
        ${logWhere}
        GROUP BY date
        ORDER BY date DESC
        LIMIT ?
        OFFSET ?
      `)
        .bind(...rangeParams, PAGE_SIZE + 1, dailyOffset)
        .all();

      const dailyHasNext =
        dailyRaw.results.length > PAGE_SIZE;

      const dailyRows =
        dailyRaw.results.slice(0, PAGE_SIZE);

      const dailyChart = await env.DB.prepare(`
        SELECT
          substr(ts,1,10) AS date,
          COUNT(*) AS pageviews,
          COUNT(DISTINCT visitor_id) AS unique_visitors,
          COUNT(DISTINCT
            CASE
              WHEN session_id IS NOT NULL AND session_id != ''
              THEN session_id
              ELSE visitor_id || ':' || substr(ts,1,13)
            END
          ) AS visits
        FROM visitor_logs
        ${logWhere}
        GROUP BY date
        ORDER BY date ASC
      `)
        .bind(...rangeParams)
        .all();

      const chartData = dailyChart.results.map(r => ({
        date: new Date(r.date)
          .toLocaleDateString(
            "en-SG",
            {
              month: "short",
              day: "numeric"
            }
          ),
        visits: r.visits,
        unique: r.unique_visitors,
        pageviews: r.pageviews
      }));

      function dashboardTime(ts) {
        return new Date(ts)
          .toLocaleString(
            "en-US",
            {
              timeZone: "America/New_York",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            }
          );
      }

      function categoryMetric(row) {
        if (row.ip === "59.15.80.113") {
          return `<span class="metric parents">Parents</span>`;
        }

        if (row.likely_bot) {
          return `<span class="metric bot">Bot</span>`;
        }

        return `<span class="metric human">Human</span>`;
      }

      function cleanDownloadLabel(path) {
        return String(path || "")
          .replace(/^DOWNLOAD:\s*/, "");
      }

      function normalizeReferrer(referer) {
        try {
          const parsed =
            new URL(referer.includes("://") ? referer : `https://${referer}`);

          const host =
            parsed.hostname.toLowerCase().replace(/^www\./, "");

          if (host.endsWith("google.com") || host.includes("google.co.")) {
            if (host.includes("scholar")) {
              return "Google Scholar";
            }

            return "Google";
          }

          if (host.includes("scholar.google.")) {
            return "Google Scholar";
          }

          if (host.endsWith("bing.com")) {
            return "Bing";
          }

          if (host.endsWith("linkedin.com")) {
            return "LinkedIn";
          }

          if (host.endsWith("duckduckgo.com")) {
            return "DuckDuckGo";
          }

          if (host.endsWith("business.purdue.edu")) {
            return "Purdue Business";
          }

          if (host.endsWith("sheguoman.com")) {
            return "She Guoman";
          }

          return host;
        } catch {
          return referer || "";
        }
      }

      let html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<title>Website Analytics</title>

<meta name="viewport" content="width=device-width, initial-scale=1">

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<style>

body{
  font-family:Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  max-width:1180px;
  margin:0 auto;
  padding:34px 24px 56px;
  background:#f6f7fb;
  color:#111827;
}

h1{
  font-family:Georgia, "Times New Roman", serif;
  font-size:38px;
  font-weight:500;
  margin:0;
  letter-spacing:0;
}

h2{
  font-family:Georgia, "Times New Roman", serif;
  font-size:22px;
  font-weight:500;
  margin-top:26px;
  margin-bottom:12px;
  letter-spacing:0;
}

a{
  color:#3f1f8f;
  font-weight:700;
  text-decoration-thickness:1px;
  text-underline-offset:3px;
}

.dashboard-header{
  display:flex;
  align-items:flex-end;
  justify-content:space-between;
  gap:24px;
  margin-bottom:22px;
  padding-bottom:18px;
  border-bottom:1px solid #d8dce5;
}

.dashboard-subtitle{
  color:#5f6878;
  font-size:14px;
  margin-top:8px;
}

.controls{
  display:flex;
  flex-direction:column;
  align-items:flex-end;
  gap:8px;
}

table{
  width:100%;
  border-collapse:collapse;
  margin-bottom:20px;
  background:#fff;
}

th{
  background:#f5f5f5;
  font-size:13px;
  padding:6px;
}

td{
  font-size:12px;
  padding:5px;
}

th,td{
  border:1px solid #ddd;
  text-align:left;
}

.chart-card{
  margin:18px 0 30px;
  padding:22px 24px 18px;
  border:1px solid #dde2eb;
  border-radius:8px;
  background:#fff;
  box-shadow:0 8px 22px rgba(22,29,45,.06);
}

.chart-header{
  display:flex;
  align-items:flex-end;
  justify-content:space-between;
  gap:18px;
  margin-bottom:12px;
}

.chart-title{
  color:#334155;
  font-size:13px;
  font-weight:700;
  letter-spacing:3px;
  text-transform:uppercase;
}

.chart-note{
  color:#64748b;
  font-size:13px;
  font-weight:600;
}

.chart-canvas-wrap{
  height:320px;
}

.chart-canvas-wrap canvas{
  width:100%;
  height:100%;
}

.range-tabs{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  margin:0;
}

.range-link{
  padding:7px 11px;
  border:1px solid #d8dce5;
  border-radius:4px;
  background:#fff;
  color:#273244;
  text-decoration:none;
  font-size:13px;
  font-weight:600;
}

.range-link.active{
  background:#2f195f;
  color:#fff;
  border-color:#2f195f;
}

.table-scroll{
  overflow-x:auto;
  -webkit-overflow-scrolling:touch;
  border:1px solid #dde2eb;
  border-radius:8px;
  background:#fff;
  margin-bottom:12px;
}

.table-scroll table{
  min-width:980px;
  margin-bottom:0;
}

.stats-panel{
  display:grid;
  grid-template-columns:repeat(4, 1fr);
  margin:18px 0 28px;
  border:1px solid #dde2eb;
  border-radius:8px;
  background:#fff;
  overflow:hidden;
}

.stat-card{
  padding:16px 18px;
  border-right:1px solid #dde2eb;
}

.stat-card:last-child{
  border-right:0;
}

.stat-label{
  color:#6b7280;
  font-size:11px;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:0;
  margin-bottom:8px;
}

.stat-value{
  font-size:28px;
  line-height:1;
  font-weight:700;
  color:#2f195f;
}

.summary-grid,
.link-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:18px;
  margin-top:20px;
  margin-bottom:30px;
}

.link-grid{
  align-items:start;
}

.panel{
  border:1px solid #dde2eb;
  border-radius:8px;
  background:#fff;
  overflow:hidden;
  scroll-margin-top:16px;
  box-shadow:0 1px 2px rgba(22, 29, 45, .04);
}

.panel h2{
  font-size:16px;
  margin:0;
  padding:14px 16px;
  border-bottom:1px solid #dde2eb;
  background:#fbfbfd;
  font-family:Georgia, "Times New Roman", serif;
  font-weight:500;
}

.clean-table{
  margin:0;
}

.clean-table th{
  background:#fff;
  color:#666;
  font-size:11px;
  text-transform:uppercase;
  letter-spacing:0;
}

.clean-table td{
  font-size:13px;
  padding:10px 12px;
}

.clean-table th,
.clean-table td{
  border-left:0;
  border-right:0;
}

.clean-table tr:last-child td{
  border-bottom:0;
}

.metric{
  display:inline-block;
  min-width:28px;
  padding:3px 8px;
  border-radius:999px;
  background:#eef1ff;
  color:#2f2995;
  font-weight:700;
  text-align:center;
}

.metric.muted{
  background:#f1f5f9;
  color:#475569;
}

.metric.bot{
  background:#fee2e2;
  color:#991b1b;
}

.metric.human{
  background:#dcfce7;
  color:#166534;
}

.metric.parents{
  background:#fff3cd;
  color:#8a5a00;
  min-width:auto;
}

.pager{
  display:flex;
  gap:10px;
  margin:10px 0 20px;
  font-size:13px;
  font-weight:700;
}

.pager a{
  display:inline-block;
  padding:6px 10px;
  border:1px solid #d8dce5;
  border-radius:4px;
  background:#fff;
  color:#273244;
  text-decoration:none;
}

@media (max-width: 800px){
  body{
    padding:22px 14px 40px;
  }

  h1{
    font-size:30px;
  }

  h2{
    font-size:18px;
  }

  .dashboard-header{
    display:block;
  }

  .controls{
    align-items:flex-start;
    margin-top:16px;
  }

  .stats-panel{
    grid-template-columns:1fr 1fr;
  }

  .stat-card{
    padding:14px 16px;
    border-right:1px solid #dde2eb;
    border-bottom:1px solid #dde2eb;
  }

  .stat-card:nth-child(even){
    border-right:0;
  }

  .stat-card:nth-last-child(-n+2){
    border-bottom:0;
  }

  .stat-value{
    font-size:24px;
  }

  .summary-grid{
    grid-template-columns:1fr;
  }

  .link-grid{
    grid-template-columns:1fr;
  }

  .chart-canvas-wrap{
    height:260px;
  }
}

</style>

</head>

<body>

<header class="dashboard-header">
  <div>
    <h1>Visitor Dashboard</h1>
    <div class="dashboard-subtitle">Site traffic, downloads, and paper-link activity</div>
  </div>

  <div class="controls">
    <div class="range-tabs">
      ${rangeLink("Today", "today")}
      ${rangeLink("7 days", "7d")}
      ${rangeLink("30 days", "30d")}
      ${rangeLink("All", "all")}
    </div>

    <div class="range-tabs">
      ${viewLink("Total", "total")}
      ${viewLink("Likely Human", "human")}
    </div>

    <div class="range-tabs">
      ${parentLink("Include Parents", "include")}
      ${parentLink("Exclude Parents", "exclude")}
    </div>
  </div>
</header>

<section class="stats-panel">

  <div class="stat-card">
    <div class="stat-label">Unique Visitors</div>
    <div class="stat-value">${escapeHtml(uniqueVisitors)}</div>
  </div>

  <div class="stat-card">
    <div class="stat-label">Total Visits</div>
    <div class="stat-value">${escapeHtml(totalVisits)}</div>
  </div>

  <div class="stat-card">
    <div class="stat-label">Total Pageviews</div>
    <div class="stat-value">${escapeHtml(totalPageviews)}</div>
  </div>

  <div class="stat-card">
    <div class="stat-label">Views Per Visit</div>
    <div class="stat-value">${escapeHtml(viewsPerVisit)}</div>
  </div>

</section>

<h2 id="recent-visitors">Recent Visitors</h2>

<div class="table-scroll">

<table>

<tr>
<th>Time</th>
<th>Organization</th>
<th>Country</th>
<th>City</th>
<th>IP</th>
<th>Browser</th>
<th>Device</th>
<th>Page</th>
<th>Referrer</th>
<th>Category</th>
</tr>
`;

      for (const row of recentRows) {
        const nyTime = dashboardTime(row.ts);

        html += `
<tr>
<td>${escapeHtml(nyTime)}</td>
<td>${escapeHtml(row.org)}</td>
<td>${escapeHtml(row.country)}</td>
<td>${escapeHtml(row.city)}</td>
<td>
  ${
    row.ip
      ? `<a href="https://whatismyipaddress.com/ip/${encodeURIComponent(row.ip)}"
           target="_blank">
           ${escapeHtml(row.ip)}
         </a>`
      : ""
  }
</td>
<td>${escapeHtml(row.browser)}</td>
<td>${escapeHtml(row.device_type)}</td>
<td>${escapeHtml(row.path)}</td>
<td>${escapeHtml(row.referer || "-")}</td>
<td>${categoryMetric(row)}</td>
</tr>
`;
      }

      html += `
</table>

</div>

${pager("page", page, recentHasNext, "recent-visitors")}

<section class="chart-card">
  <div class="chart-header">
    <div class="chart-title">Traffic Trend</div>
    <div class="chart-note">${escapeHtml(activeRange === "all" ? "all tracked days" : activeRange)}</div>
  </div>

  <div class="chart-canvas-wrap">
    <canvas id="trafficChart"></canvas>
  </div>
</section>

<h2>Dataset Downloads</h2>

<div class="table-scroll">

<table>

<tr>
  <th>Dataset</th>
  <th>Downloads</th>
</tr>
`;

for (const row of downloads.results) {

  html += `
  <tr>
    <td>${escapeHtml(cleanDownloadLabel(row.path))}</td>
    <td>${escapeHtml(row.downloads)}</td>
  </tr>
  `;
}

html += `
</table>

</div>

<h2>Top Downloading Institutions</h2>

<div class="table-scroll">

<table>

<tr>
  <th>Organization</th>
  <th>Downloads</th>
</tr>
`;

for (const row of topDownloaders.results) {

  html += `
  <tr>
    <td>${escapeHtml(row.org)}</td>
    <td>${escapeHtml(row.downloads)}</td>
  </tr>
  `;
}

html += `
</table>

</div>

<h2 id="download-history">Download History</h2>

<div class="table-scroll">

<table>

<tr>
  <th>Time</th>
  <th>Dataset</th>
  <th>Organization</th>
  <th>Country</th>
</tr>
`;

for (const row of downloadHistory) {

  html += `
  <tr>
    <td>${escapeHtml(dashboardTime(row.ts))}</td>
    <td>${escapeHtml(cleanDownloadLabel(row.path))}</td>
    <td>${escapeHtml(row.org)}</td>
    <td>${escapeHtml(row.country)}</td>
  </tr>
  `;
}

html += `
</table>

</div>

${pager("downloadPage", downloadPage, downloadHistoryHasNext, "download-history")}

<section class="summary-grid">
`;

      html += `
  <div class="panel" id="daily-traffic">
    <h2>Daily Traffic</h2>
    <table class="clean-table">
      <tr>
        <th>Date</th>
        <th>Visits</th>
        <th>Pageviews</th>
        <th>Unique</th>
      </tr>
`;

      for (const row of dailyRows) {
        html += `
      <tr>
        <td>${escapeHtml(row.date)}</td>
        <td><span class="metric">${escapeHtml(row.visits)}</span></td>
        <td><span class="metric muted">${escapeHtml(row.pageviews)}</span></td>
        <td><span class="metric muted">${escapeHtml(row.unique_visitors)}</span></td>
      </tr>
`;
      }

      html += `
    </table>
    ${pager("dailyPage", dailyPage, dailyHasNext, "daily-traffic")}
  </div>

  <div class="panel" id="top-organizations">
    <h2>Top Organizations</h2>
    <table class="clean-table">
      <tr>
        <th>Organization</th>
        <th>Visits</th>
      </tr>
`;

      for (const row of topOrgs) {
        html += `
      <tr>
        <td>${escapeHtml(row.org || "Unknown")}</td>
        <td><span class="metric">${escapeHtml(row.visits)}</span></td>
      </tr>
`;
      }

      html += `
    </table>
    ${pager("orgPage", orgPage, topOrgsHasNext, "top-organizations")}
  </div>

  <div class="panel">
    <h2>Top Pages</h2>
    <table class="clean-table">
      <tr>
        <th>Page</th>
        <th>Views</th>
      </tr>
`;

      for (const row of topPages.results) {
        html += `
      <tr>
        <td>${escapeHtml(row.path)}</td>
        <td><span class="metric">${escapeHtml(row.visits)}</span></td>
      </tr>
`;
      }

      html += `
    </table>
  </div>

  <div class="panel" id="countries">
    <h2>Countries</h2>
    <table class="clean-table">
      <tr>
        <th>Country</th>
        <th>Views</th>
      </tr>
`;

      for (const row of countries) {
        html += `
      <tr>
        <td>${escapeHtml(row.country)}</td>
        <td><span class="metric">${escapeHtml(row.visits)}</span></td>
      </tr>
`;
      }

      html += `
    </table>
    ${pager("countryPage", countryPage, countriesHasNext, "countries")}
  </div>

  <div class="panel">
    <h2>Top Referrers</h2>
    <table class="clean-table">
      <tr>
        <th>Referrer</th>
        <th>Visits</th>
      </tr>
`;

      for (const row of topReferrers) {
        html += `
      <tr>
        <td>${escapeHtml(row.referer)}</td>
        <td><span class="metric">${escapeHtml(row.visits)}</span></td>
      </tr>
`;
      }

      html += `
    </table>
  </div>

  <div class="panel">
    <h2>Top Country-City</h2>
    <table class="clean-table">
      <tr>
        <th>Country</th>
        <th>City</th>
        <th>Visits</th>
      </tr>
`;

      for (const row of topLocations.results) {
        html += `
      <tr>
        <td>${escapeHtml(row.country || "Unknown")}</td>
        <td>${escapeHtml(row.city || "Unknown")}</td>
        <td><span class="metric">${escapeHtml(row.visits)}</span></td>
      </tr>
`;
      }

      html += `
    </table>
  </div>
</section>
`;

      html += `
<h2 id="paper-links">Paper Link Clicks</h2>

<div class="table-scroll">

<table>

<tr>
  <th>Paper</th>
  <th>Total Clicks</th>
</tr>
`;

      for (const row of linkTotals.results) {
        html += `
<tr>
  <td>
    <a href="${escapeHtml(row.target)}" target="_blank">
      ${escapeHtml(row.text || row.target || "unknown")}
    </a>
  </td>
  <td><span class="metric">${escapeHtml(row.clicks)}</span></td>
</tr>
`;
      }

      html += `
</table>

</div>

<div class="table-scroll">

<table>

<tr>
  <th>Time</th>
  <th>Paper</th>
  <th>Organization</th>
  <th>City</th>
  <th>Country</th>
  <th>IP</th>
</tr>
`;

      for (const row of linkRows) {
        html += `
<tr>
  <td>${escapeHtml(dashboardTime(row.ts))}</td>
  <td>
    <a href="${escapeHtml(row.target)}" target="_blank">
      ${escapeHtml(row.text || row.target || "unknown")}
    </a>
  </td>
  <td>${escapeHtml(row.org || "Unknown")}</td>
  <td>${escapeHtml(row.city || "")}</td>
  <td>${escapeHtml(row.country || "")}</td>
  <td>
    ${
      row.ip
        ? `<a href="https://whatismyipaddress.com/ip/${encodeURIComponent(row.ip)}"
             target="_blank">
             ${escapeHtml(row.ip)}
           </a>`
        : ""
    }
  </td>
</tr>
`;
      }

      html += `
</table>

</div>

${pager("linkPage", linkPage, linkHasNext, "paper-links")}

<script>

const data = ${JSON.stringify(chartData)};

new Chart(
  document.getElementById("trafficChart"),
  {
    type: "line",

    data: {
      labels: data.map(x => x.date),

      datasets: [
        {
          label: "Visits",
          data: data.map(x => x.visits),
          borderColor: "#3f1f8f",
          backgroundColor: "rgba(63,31,143,.10)",
          pointBackgroundColor: "#3f1f8f",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#3f1f8f",
          pointHoverBorderColor: "#fff",
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 3,
          tension: .35,
          fill: true
        },
        {
          label: "Unique Visitors",
          data: data.map(x => x.unique),
          borderColor: "#64748b",
          backgroundColor: "rgba(100,116,139,.06)",
          pointBackgroundColor: "#64748b",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#64748b",
          pointHoverBorderColor: "#fff",
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2,
          tension: .35,
          fill: false
        },
        {
          label: "Pageviews",
          data: data.map(x => x.pageviews),
          borderColor: "#0f766e",
          backgroundColor: "rgba(15,118,110,.06)",
          pointBackgroundColor: "#0f766e",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#0f766e",
          pointHoverBorderColor: "#fff",
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2,
          tension: .35,
          fill: false
        }
      ]
    },

    options: {
      responsive:true,
      maintainAspectRatio:false,
      interaction: {
        mode: "index",
        intersect: false
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#475569",
            boxWidth: 10,
            boxHeight: 10,
            padding: 18,
            usePointStyle: true,
            pointStyle: "circle"
          }
        },
        tooltip: {
          backgroundColor: "rgba(15,23,42,.96)",
          borderColor: "rgba(148,163,184,.22)",
          borderWidth: 1,
          titleColor: "#f8fafc",
          bodyColor: "#e2e8f0",
          padding: 12,
          displayColors: true
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: "#64748b",
            maxRotation: 0
          },
          border: {
            color: "#e2e8f0"
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: "#e8edf5",
            borderDash: [5, 7]
          },
          ticks: {
            color: "#64748b",
            precision: 0
          },
          border: {
            display: false
          }
        }
      }
    }
  }
);

</script>

</body>
</html>
`;

      return new Response(html, {
        headers: {
          "content-type": "text/html; charset=utf-8"
        }
      });
    }

    // =====================================================
    // VISITOR LOGGING
    // =====================================================

    let sessionId = "";
    let setSessionCookie = false;

    const accept = request.headers.get("accept") || "";

    if (
      accept.includes("text/html") &&
      (
        path === "/" ||
        path.startsWith("/research")
      )
    ) {
      const ua =
        request.headers.get("user-agent") || "";

      let browser = "Other";

      if (ua.includes("Chrome") && !ua.includes("Edg"))
        browser = "Chrome";
      else if (ua.includes("Firefox"))
        browser = "Firefox";
      else if (ua.includes("Safari") && !ua.includes("Chrome"))
        browser = "Safari";
      else if (ua.includes("Edg"))
        browser = "Edge";

      let device = "desktop";

      if (/mobile/i.test(ua))
        device = "mobile";

      const ip =
        request.headers.get("cf-connecting-ip") || "";

      const visitorId =
        ip || ua;

      const referer =
        request.headers.get("referer") || "";


      const isMyVisit =
        ip === "195.133.129.113" ||
        ip === "195.252.220.27";

      const isCloudflarePreview =
        request.cf?.asOrganization === "Cloudflare, Inc." ||
        referer.includes("preview.devprod.cloudflare.dev") ||
        referer.includes("dash.cloudflare.com");

      sessionId =
        getCookie(request, "session_id");

      if (!sessionId) {
        sessionId = crypto.randomUUID();
        setSessionCookie = true;
      }

      if (!isMyVisit && !isCloudflarePreview) {
        await env.DB.prepare(`
          INSERT INTO visitor_logs
          (
            ts,
            country,
            city,
            asn,
            org,
            path,
            ua,
            browser,
            referer,
            device_type,
            visitor_id,
            ip,
            session_id
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
          .bind(
            new Date().toISOString(),
            countryName(request.cf?.country || ""),
            request.cf?.city || "",
            request.cf?.asn || 0,
            normalizeOrg(request.cf?.asOrganization || ""),
            path,
            ua,
            browser,
            referer,
            device,
            visitorId,
            ip,
            sessionId
          )
          .run();
      }
    }

    const originResponse =
      await fetch(request);

    const response =
      new Response(originResponse.body, originResponse);

    if (setSessionCookie) {
      response.headers.set(
        "Set-Cookie",
        `session_id=${sessionId}; Path=/; Max-Age=1800; SameSite=Lax; Secure`
      );
    }

    return response;
  }
};
