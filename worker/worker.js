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

function isIgnoredIp(ip) {
  return [
    "195.133.129.113",
    "195.252.220.27",
    "223.119.20.199",
    "132.147.101.179"
  ].includes(ip);
}

function isBannedBotIp(ip) {
  return [
    "194.5.82.64",
    "194.5.82.167",
    "194.5.82.95",
    "194.5.82.82",
    "194.5.82.77",
    "194.5.82.63",
    "194.5.82.65",
    "194.5.82.68",
    "194.5.82.93",
    "194.5.82.98",
    "194.5.82.92",
    "194.5.82.79",
    "194.5.82.130",
    "194.5.82.136",
    "194.5.82.102",
    "194.5.82.76",
    "194.5.82.60",
    "38.253.224.3",
    "38.253.224.40",
    "95.85.238.63",
    "5.83.214.21",
    "163.171.115.102",
    "204.3.170.37",
    "102.129.223.92",
    "193.181.13.96",
    "179.1.112.10",
    "104.192.7.114",
    "91.92.47.173",
    "38.166.53.64",
    "190.83.114.5",
    "181.119.109.115",
    "37.41.206.114",
    "95.212.48.85",
    "196.189.120.12",
    "2001:bc8:1210:d47e:dc00:ff:feca:16f9",
    "146.247.228.98",
    "193.235.141.125",
    "45.133.176.61",
    "147.90.209.226",
    "2.26.23.219",
    "45.169.27.182",
    "213.202.253.4",
    "177.67.144.146",
    "103.153.183.69",
    "93.158.90.71",
    "103.25.57.139",
    "14.187.114.113",
    "192.140.98.112",
    "185.93.89.132",
    "43.228.157.174",
    "45.146.55.49",
    "158.222.117.236",
    "217.165.85.87",
    "82.21.238.39",
    "92.99.251.131",
    "173.239.253.139",
    "91.192.10.83",
    "23.180.120.146",
    "187.172.2.221",
    "158.222.117.188",
    "158.173.77.139",
    "88.218.137.121",
    "190.82.222.98",
    "181.134.14.139",
    "45.239.215.248",
    "86.57.172.107",
    "64.89.161.85",
    "89.187.163.213",
    "93.152.221.91",
    "196.207.222.121",
    "62.232.118.162",
    "185.21.14.193",
    "47.103.148.210",
    "80.85.246.214",
    "209.87.169.111",
    "185.93.89.147",
    "90.77.95.67",
    "111.90.182.134",
    "173.239.218.13",
    "185.223.152.98",
    "209.222.98.158",
    "64.89.161.50",
    "193.19.109.156",
    "93.158.90.164",
    "116.97.109.222",
    "186.85.240.145",
    "136.243.220.212",
    "94.156.152.16",
    "185.177.72.54",
    "185.177.72.56",
    "185.177.72.17",
    "185.177.72.12",
    "85.208.96.202",
    "185.191.171.11",
    "103.253.27.23",
    "27.115.124.118",
    "211.249.40.30",
    "194.5.82.50",
    "72.13.46.9",
    "5.21.140.61",
    "194.5.82.62",
    "64.89.160.64",
    "80.85.247.231",
    "38.253.224.42",
    "62.60.130.235",
    "216.73.217.20",
    "85.208.96.208",
    "85.208.96.196",
    "185.191.171.3",
    "85.208.96.199",
    "179.48.230.17",
    "94.129.167.118",
    "45.92.229.46",
    "64.89.163.64",
    "65.111.3.255",
    "67.219.201.133",
    "114.119.131.180",
    "57.140.28.36",
    "123.23.22.225",
    "152.53.246.82",
    "217.113.194.110",
    "217.113.194.104",
    "217.113.194.224",
    "217.113.194.223",
    "217.113.194.247",
    "217.113.194.102",
    "130.12.182.119",
    "152.53.193.182",
    "121.237.36.31",
    "185.191.171.19",
    "85.208.96.200",
    "185.191.171.13",
    "85.208.96.209",
    "45.61.184.21",
    "103.168.66.237",
    "120.210.82.249",
    "212.118.43.65",
    "82.38.180.24",
    "89.163.146.197",
    "45.83.33.78",
    "93.158.90.70",
    "162.156.203.99",
    "114.119.154.13",
    "103.98.130.105",
    "114.111.32.135",
    "46.151.182.172",
    "141.138.211.251",
    "85.203.47.13",
    "61.74.161.247",
    "188.253.5.117",
    "45.157.112.238",
    "149.57.180.192",
    "43.164.3.182",
    "124.156.157.91",
    "43.157.168.43",
    "43.153.74.75",
    "43.165.198.144",
    "170.106.148.137",
    "43.163.86.65",
    "129.226.146.146",
    "170.106.160.90",
    "43.130.31.17",
    "43.153.71.132",
    "43.157.142.101",
    "170.106.35.153",
    "129.226.193.111",
    "43.153.96.233",
    "43.161.217.205",
    "43.130.228.73",
    "43.164.129.191",
    "43.163.206.70",
    "66.249.74.77",
    "66.249.74.70",
    "66.249.74.73",
    "136.113.9.105",
    "34.9.172.22",
    "34.122.16.212",
    "35.254.244.123",
    "66.249.74.78",
    "66.249.74.72",
    "66.249.70.38",
    "66.249.70.36",
    "34.169.223.237",
    "34.91.213.89",
    "35.192.232.168",
    "34.31.88.250",
    "2001:4860:7:f0e::c2",
    "51.89.164.226",
    "2001:41d0:367:cad::1",
    "2001:41d0:601:1100::5237",
    "2604:2dc0:303::4:0:163",
    "51.91.208.97",
    "51.91.151.213",
    "2001:41d0:303:1f21::1",
    "2604:2dc0:303::4:0:100",
    "51.79.152.198",
    "51.255.9.166",
    "2604:2dc0:301::4:0:15",
    "15.204.182.106",
    "101.100.179.4",
    "45.92.229.48",
    "177.21.195.172",
    "107.189.14.87",
    "121.237.36.28",
    "114.250.44.28",
    "106.38.188.185",
    "149.57.180.112",
    "27.159.75.49",
    "123.100.137.17",
    "146.75.203.32",
    "141.98.11.134",
    "168.196.142.129",
    "85.121.215.241",
    "93.158.90.15",
    "149.57.180.150",
    "192.104.34.34",
    "62.60.130.227",
    "93.158.91.237",
    "192.175.111.247",
    "64.89.160.19",
    "103.186.30.230",
    "52.80.185.134",
    "138.117.220.56",
    "51.254.49.101",
    "103.168.67.36",
    "45.153.165.7",
    "61.79.198.17",
    "45.41.130.244",
    "103.156.164.94",
    "82.27.89.65",
    "171.225.205.1",
    "212.34.141.109",
    "136.228.146.5",
    "103.215.75.19",
    "194.132.138.142",
    "177.185.220.50",
    "45.8.196.197",
    "83.140.240.80",
    "51.15.217.215",
    "2001:bc8:710:7c32:dc00:1ff:fe29:ff2f",
    "2001:bc8:711:5047:dc00:1ff:fe26:4f65",
    "27.115.124.53",
    "123.6.49.15",
    "158.173.21.102",
    "213.111.144.104",
    "85.208.96.210",
    "185.191.171.1",
    "185.191.171.15",
    "158.173.77.1",
    "72.13.46.8",
    "185.191.171.6",
    "185.191.171.16",
    "85.208.96.211",
    "166.1.89.9",
    "91.92.40.30",
    "192.71.15.14",
    "103.215.75.66",
    "93.158.108.201",
    "212.1.94.95",
    "185.177.72.13",
    "185.177.72.5",
    "178.73.224.24",
    "177.105.246.48",
    "141.98.252.206",
    "192.253.248.142",
    "36.213.110.165",
    "190.86.73.217"
  ].includes(ip);
}

function isBannedBotOrg(org) {
  const normalizedOrg =
    String(org || "").toLowerCase();

  return (
    normalizedOrg.includes("collyer quay") ||
    normalizedOrg.includes("tencent cloud computing") ||
    /^ovh\b/.test(normalizedOrg) ||
    normalizedOrg.includes("microsoft corporation") ||
    normalizedOrg.includes("microsoft limited") ||
    normalizedOrg.includes("aceville pte") ||
    normalizedOrg.includes("amazon data services") ||
    normalizedOrg.includes("amazon technologies") ||
    normalizedOrg.includes("amazon.com") ||
    normalizedOrg.includes("google llc") ||
    normalizedOrg.includes("alibaba cloud") ||
    normalizedOrg.includes("digivps.com") ||
    normalizedOrg.includes("datacamp limited") ||
    normalizedOrg.includes("internetbolaget hosting") ||
    normalizedOrg.includes("fbw networks sas") ||
    normalizedOrg.includes("internet vikings international") ||
    normalizedOrg.includes("internet vikings hosting in sweden") ||
    normalizedOrg.includes("contabo gmbh") ||
    normalizedOrg.includes("b.v., dataprovider") ||
    normalizedOrg.includes("oracle svenska ab")
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const requestIp =
      request.headers.get("cf-connecting-ip") || "";
    const requestOrg =
      request.cf?.asOrganization || "";

    if (isBannedBotIp(requestIp) || isBannedBotOrg(requestOrg)) {
      return new Response("Forbidden", { status: 403 });
    }

    const goLinks = {
      "sso": "https://doi.org/10.2308/TAR-2022-0544",
      "media-conglomeration": "https://doi.org/10.1287/mnsc.2023.02247",
      "contract-contingencies": "https://doi.org/10.1016/j.jacceco.2024.101743",
      "antitrust-ma": "https://doi.org/10.1016/j.jacceco.2026.101884",
      "algorithmic-trading": "https://doi.org/10.1007/s11142-026-09980-1",
      "whispering-progress": "https://doi.org/10.1016/j.jacceco.2026.101904",
      "reverse-engineering": "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5525158",
      "resume-washing": "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6428260"
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


      const isCloudflarePreview =
        request.cf?.asOrganization === "Cloudflare, Inc." ||
        referer.includes("preview.devprod.cloudflare.dev") ||
        referer.includes("dash.cloudflare.com");

      if (!isIgnoredIp(ip) && !isCloudflarePreview) {
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

      const isCloudflarePreview =
        request.cf?.asOrganization === "Cloudflare, Inc." ||
        referer.includes("preview.devprod.cloudflare.dev") ||
        referer.includes("dash.cloudflare.com");

      if (isIgnoredIp(ip) || isCloudflarePreview) {
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
        url.searchParams.get("parents") === "include"
          ? "include"
          : "exclude";

      const activeOrgSearch =
        (url.searchParams.get("orgSearch") || "").trim();

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
          WHEN ip IN (
            '194.5.82.64',
            '194.5.82.167',
            '194.5.82.95',
            '194.5.82.82',
            '194.5.82.77',
            '194.5.82.63',
            '194.5.82.65',
            '194.5.82.68',
            '194.5.82.93',
            '194.5.82.98',
            '194.5.82.92',
            '194.5.82.79',
            '194.5.82.130',
            '194.5.82.136',
            '194.5.82.102',
            '194.5.82.76',
            '194.5.82.60',
            '38.253.224.3',
            '38.253.224.40',
            '95.85.238.63',
            '5.83.214.21',
            '163.171.115.102',
            '204.3.170.37',
            '102.129.223.92',
            '193.181.13.96',
            '179.1.112.10',
            '104.192.7.114',
            '91.92.47.173',
            '38.166.53.64',
            '190.83.114.5',
            '181.119.109.115',
            '37.41.206.114',
            '95.212.48.85',
            '196.189.120.12',
            '2001:bc8:1210:d47e:dc00:ff:feca:16f9',
            '146.247.228.98',
            '193.235.141.125',
            '45.133.176.61',
            '147.90.209.226',
            '2.26.23.219',
            '45.169.27.182',
            '213.202.253.4',
            '177.67.144.146',
            '103.153.183.69',
            '93.158.90.71',
            '103.25.57.139',
            '14.187.114.113',
            '192.140.98.112',
            '185.93.89.132',
            '43.228.157.174',
            '45.146.55.49',
            '158.222.117.236',
            '217.165.85.87',
            '82.21.238.39',
            '92.99.251.131',
            '173.239.253.139',
            '91.192.10.83',
            '23.180.120.146',
            '187.172.2.221',
            '158.222.117.188',
            '158.173.77.139',
            '88.218.137.121',
            '190.82.222.98',
            '181.134.14.139',
            '45.239.215.248',
            '86.57.172.107',
            '64.89.161.85',
            '89.187.163.213',
            '93.152.221.91',
            '196.207.222.121',
            '62.232.118.162',
            '185.21.14.193',
            '47.103.148.210',
            '80.85.246.214',
            '209.87.169.111',
            '185.93.89.147',
            '90.77.95.67',
            '111.90.182.134',
            '173.239.218.13',
            '185.223.152.98',
            '209.222.98.158',
            '64.89.161.50',
            '193.19.109.156',
            '93.158.90.164',
            '116.97.109.222',
            '186.85.240.145',
            '136.243.220.212',
            '94.156.152.16',
            '185.177.72.54',
            '185.177.72.56',
            '185.177.72.17',
            '185.177.72.12',
            '85.208.96.202',
            '185.191.171.11',
            '103.253.27.23',
            '27.115.124.118',
            '211.249.40.30',
            '194.5.82.50',
            '72.13.46.9',
            '5.21.140.61',
            '194.5.82.62',
            '64.89.160.64',
            '80.85.247.231',
            '38.253.224.42',
            '62.60.130.235',
            '216.73.217.20',
            '85.208.96.208',
            '85.208.96.196',
            '185.191.171.3',
            '85.208.96.199',
            '179.48.230.17',
            '94.129.167.118',
            '45.92.229.46',
            '64.89.163.64',
            '65.111.3.255',
            '67.219.201.133',
            '114.119.131.180',
            '57.140.28.36',
            '123.23.22.225',
            '152.53.246.82',
            '217.113.194.110',
            '217.113.194.104',
            '217.113.194.224',
            '217.113.194.223',
            '217.113.194.247',
            '217.113.194.102',
            '130.12.182.119',
            '152.53.193.182',
            '121.237.36.31',
            '185.191.171.19',
            '85.208.96.200',
            '185.191.171.13',
            '85.208.96.209',
            '45.61.184.21',
            '103.168.66.237',
            '120.210.82.249',
            '212.118.43.65',
            '82.38.180.24',
            '89.163.146.197',
            '45.83.33.78',
            '93.158.90.70',
            '162.156.203.99',
            '114.119.154.13',
            '103.98.130.105',
            '114.111.32.135',
            '46.151.182.172',
            '141.138.211.251',
            '85.203.47.13',
            '61.74.161.247',
            '188.253.5.117',
            '45.157.112.238',
            '149.57.180.192',
            '43.164.3.182',
            '124.156.157.91',
            '43.157.168.43',
            '43.153.74.75',
            '43.165.198.144',
            '170.106.148.137',
            '43.163.86.65',
            '129.226.146.146',
            '170.106.160.90',
            '43.130.31.17',
            '43.153.71.132',
            '43.157.142.101',
            '170.106.35.153',
            '129.226.193.111',
            '43.153.96.233',
            '43.161.217.205',
            '43.130.228.73',
            '43.164.129.191',
            '43.163.206.70',
            '66.249.74.77',
            '66.249.74.70',
            '66.249.74.73',
            '136.113.9.105',
            '34.9.172.22',
            '34.122.16.212',
            '35.254.244.123',
            '66.249.74.78',
            '66.249.74.72',
            '66.249.70.38',
            '66.249.70.36',
            '34.169.223.237',
            '34.91.213.89',
            '35.192.232.168',
            '34.31.88.250',
            '2001:4860:7:f0e::c2',
            '51.89.164.226',
            '2001:41d0:367:cad::1',
            '2001:41d0:601:1100::5237',
            '2604:2dc0:303::4:0:163',
            '51.91.208.97',
            '51.91.151.213',
            '2001:41d0:303:1f21::1',
            '2604:2dc0:303::4:0:100',
            '51.79.152.198',
            '51.255.9.166',
            '2604:2dc0:301::4:0:15',
            '15.204.182.106',
            '101.100.179.4',
            '45.92.229.48',
            '177.21.195.172',
            '107.189.14.87',
            '121.237.36.28',
            '114.250.44.28',
            '106.38.188.185',
            '149.57.180.112',
            '27.159.75.49',
            '123.100.137.17',
            '146.75.203.32',
            '141.98.11.134',
            '168.196.142.129',
            '85.121.215.241',
            '93.158.90.15',
            '149.57.180.150',
            '192.104.34.34',
            '62.60.130.227',
            '93.158.91.237',
            '192.175.111.247',
            '64.89.160.19',
            '103.186.30.230',
            '52.80.185.134',
            '138.117.220.56',
            '51.254.49.101',
            '103.168.67.36',
            '45.153.165.7',
            '61.79.198.17',
            '45.41.130.244',
            '103.156.164.94',
            '82.27.89.65',
            '171.225.205.1',
            '212.34.141.109',
            '136.228.146.5',
            '103.215.75.19',
            '194.132.138.142',
            '177.185.220.50',
            '45.8.196.197',
            '83.140.240.80',
            '51.15.217.215',
            '2001:bc8:710:7c32:dc00:1ff:fe29:ff2f',
            '2001:bc8:711:5047:dc00:1ff:fe26:4f65',
            '27.115.124.53',
            '123.6.49.15',
            '158.173.21.102',
            '213.111.144.104',
            '85.208.96.210',
            '185.191.171.1',
            '185.191.171.15',
            '158.173.77.1',
            '72.13.46.8',
            '185.191.171.6',
            '185.191.171.16',
            '85.208.96.211',
            '166.1.89.9',
            '91.92.40.30',
            '192.71.15.14',
            '103.215.75.66',
            '93.158.108.201',
            '212.1.94.95',
            '185.177.72.13',
            '185.177.72.5',
            '178.73.224.24',
            '177.105.246.48',
            '141.98.252.206',
            '192.253.248.142',
            '36.213.110.165',
            '190.86.73.217'
          ) THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%cloudflare%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%amazon%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%aws%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%internetbolaget hosting in sweden%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%internetbolaget sweden ab%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%internetbolaget hosting customers%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%internetbolaget customer%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%blix group as%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%idigital internet inc%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%dteko vietnam technology company limited%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%advin services llc%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%b.v., dataprovider%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%fr onyphe%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%internet utilities europe and asia limited%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%bullet group ltd%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%bullet-group%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%felcloud%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%uab code200%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%code200 uab%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%hydra communications ltd%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%byteplus%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%ace data centers ii, l.l.c.%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%senko digital llc - de network%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%ionos se%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%hostroyale technologies pvt ltd%' THEN 1
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
          WHEN lower(coalesce(org,'')) LIKE '%digivps.com%' THEN 1
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
          WHEN lower(coalesce(org,'')) LIKE '%modmc%' THEN 1
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
          WHEN ip IN (
            '194.5.82.64',
            '194.5.82.167',
            '194.5.82.95',
            '194.5.82.82',
            '194.5.82.77',
            '194.5.82.63',
            '194.5.82.65',
            '194.5.82.68',
            '194.5.82.93',
            '194.5.82.98',
            '194.5.82.92',
            '194.5.82.79',
            '194.5.82.130',
            '194.5.82.136',
            '194.5.82.102',
            '194.5.82.76',
            '194.5.82.60',
            '38.253.224.3',
            '38.253.224.40',
            '95.85.238.63',
            '5.83.214.21',
            '163.171.115.102',
            '204.3.170.37',
            '102.129.223.92',
            '193.181.13.96',
            '179.1.112.10',
            '104.192.7.114',
            '91.92.47.173',
            '38.166.53.64',
            '190.83.114.5',
            '181.119.109.115',
            '37.41.206.114',
            '95.212.48.85',
            '196.189.120.12',
            '2001:bc8:1210:d47e:dc00:ff:feca:16f9',
            '146.247.228.98',
            '193.235.141.125',
            '45.133.176.61',
            '147.90.209.226',
            '2.26.23.219',
            '45.169.27.182',
            '213.202.253.4',
            '177.67.144.146',
            '103.153.183.69',
            '93.158.90.71',
            '103.25.57.139',
            '14.187.114.113',
            '192.140.98.112',
            '185.93.89.132',
            '43.228.157.174',
            '45.146.55.49',
            '158.222.117.236',
            '217.165.85.87',
            '82.21.238.39',
            '92.99.251.131',
            '173.239.253.139',
            '91.192.10.83',
            '23.180.120.146',
            '187.172.2.221',
            '158.222.117.188',
            '158.173.77.139',
            '88.218.137.121',
            '190.82.222.98',
            '181.134.14.139',
            '45.239.215.248',
            '86.57.172.107',
            '64.89.161.85',
            '89.187.163.213',
            '93.152.221.91',
            '196.207.222.121',
            '62.232.118.162',
            '185.21.14.193',
            '47.103.148.210',
            '80.85.246.214',
            '209.87.169.111',
            '185.93.89.147',
            '90.77.95.67',
            '111.90.182.134',
            '173.239.218.13',
            '185.223.152.98',
            '209.222.98.158',
            '64.89.161.50',
            '193.19.109.156',
            '93.158.90.164',
            '116.97.109.222',
            '186.85.240.145',
            '136.243.220.212',
            '94.156.152.16',
            '185.177.72.54',
            '185.177.72.56',
            '185.177.72.17',
            '185.177.72.12',
            '85.208.96.202',
            '185.191.171.11',
            '103.253.27.23',
            '27.115.124.118',
            '211.249.40.30',
            '194.5.82.50',
            '72.13.46.9',
            '5.21.140.61',
            '194.5.82.62',
            '64.89.160.64',
            '80.85.247.231',
            '38.253.224.42',
            '62.60.130.235',
            '216.73.217.20',
            '85.208.96.208',
            '85.208.96.196',
            '185.191.171.3',
            '85.208.96.199',
            '179.48.230.17',
            '94.129.167.118',
            '45.92.229.46',
            '64.89.163.64',
            '65.111.3.255',
            '67.219.201.133',
            '114.119.131.180',
            '57.140.28.36',
            '123.23.22.225',
            '152.53.246.82',
            '217.113.194.110',
            '217.113.194.104',
            '217.113.194.224',
            '217.113.194.223',
            '217.113.194.247',
            '217.113.194.102',
            '130.12.182.119',
            '152.53.193.182',
            '121.237.36.31',
            '185.191.171.19',
            '85.208.96.200',
            '185.191.171.13',
            '85.208.96.209',
            '45.61.184.21',
            '103.168.66.237',
            '120.210.82.249',
            '212.118.43.65',
            '82.38.180.24',
            '89.163.146.197',
            '45.83.33.78',
            '93.158.90.70',
            '162.156.203.99',
            '114.119.154.13',
            '103.98.130.105',
            '114.111.32.135',
            '46.151.182.172',
            '141.138.211.251',
            '85.203.47.13',
            '61.74.161.247',
            '188.253.5.117',
            '45.157.112.238',
            '149.57.180.192',
            '43.164.3.182',
            '124.156.157.91',
            '43.157.168.43',
            '43.153.74.75',
            '43.165.198.144',
            '170.106.148.137',
            '43.163.86.65',
            '129.226.146.146',
            '170.106.160.90',
            '43.130.31.17',
            '43.153.71.132',
            '43.157.142.101',
            '170.106.35.153',
            '129.226.193.111',
            '43.153.96.233',
            '43.161.217.205',
            '43.130.228.73',
            '43.164.129.191',
            '43.163.206.70',
            '66.249.74.77',
            '66.249.74.70',
            '66.249.74.73',
            '136.113.9.105',
            '34.9.172.22',
            '34.122.16.212',
            '35.254.244.123',
            '66.249.74.78',
            '66.249.74.72',
            '66.249.70.38',
            '66.249.70.36',
            '34.169.223.237',
            '34.91.213.89',
            '35.192.232.168',
            '34.31.88.250',
            '2001:4860:7:f0e::c2',
            '51.89.164.226',
            '2001:41d0:367:cad::1',
            '2001:41d0:601:1100::5237',
            '2604:2dc0:303::4:0:163',
            '51.91.208.97',
            '51.91.151.213',
            '2001:41d0:303:1f21::1',
            '2604:2dc0:303::4:0:100',
            '51.79.152.198',
            '51.255.9.166',
            '2604:2dc0:301::4:0:15',
            '15.204.182.106',
            '101.100.179.4',
            '45.92.229.48',
            '177.21.195.172',
            '107.189.14.87',
            '121.237.36.28',
            '114.250.44.28',
            '106.38.188.185',
            '149.57.180.112',
            '27.159.75.49',
            '123.100.137.17',
            '146.75.203.32',
            '141.98.11.134',
            '168.196.142.129',
            '85.121.215.241',
            '93.158.90.15',
            '149.57.180.150',
            '192.104.34.34',
            '62.60.130.227',
            '93.158.91.237',
            '192.175.111.247',
            '64.89.160.19',
            '103.186.30.230',
            '52.80.185.134',
            '138.117.220.56',
            '51.254.49.101',
            '103.168.67.36',
            '45.153.165.7',
            '61.79.198.17',
            '45.41.130.244',
            '103.156.164.94',
            '82.27.89.65',
            '171.225.205.1',
            '212.34.141.109',
            '136.228.146.5',
            '103.215.75.19',
            '194.132.138.142',
            '177.185.220.50',
            '45.8.196.197',
            '83.140.240.80',
            '51.15.217.215',
            '2001:bc8:710:7c32:dc00:1ff:fe29:ff2f',
            '2001:bc8:711:5047:dc00:1ff:fe26:4f65',
            '27.115.124.53',
            '123.6.49.15',
            '158.173.21.102',
            '213.111.144.104',
            '85.208.96.210',
            '185.191.171.1',
            '185.191.171.15',
            '158.173.77.1',
            '72.13.46.8',
            '185.191.171.6',
            '185.191.171.16',
            '85.208.96.211',
            '166.1.89.9',
            '91.92.40.30',
            '192.71.15.14',
            '103.215.75.66',
            '93.158.108.201',
            '212.1.94.95',
            '185.177.72.13',
            '185.177.72.5',
            '178.73.224.24',
            '177.105.246.48',
            '141.98.252.206',
            '192.253.248.142',
            '36.213.110.165',
            '190.86.73.217'
          ) THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%cloudflare%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%collyer quay%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%amazon%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%aws%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%internetbolaget hosting in sweden%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%internetbolaget sweden ab%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%internetbolaget hosting customers%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%internetbolaget customer%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%blix group as%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%idigital internet inc%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%dteko vietnam technology company limited%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%advin services llc%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%b.v., dataprovider%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%fr onyphe%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%internet utilities europe and asia limited%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%bullet group ltd%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%bullet-group%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%felcloud%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%uab code200%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%code200 uab%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%hydra communications ltd%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%byteplus%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%ace data centers ii, l.l.c.%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%senko digital llc - de network%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%ionos se%' THEN 1
          WHEN lower(coalesce(org,'')) LIKE '%hostroyale technologies pvt ltd%' THEN 1
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
          WHEN lower(coalesce(org,'')) LIKE '%digivps.com%' THEN 1
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
          WHEN lower(coalesce(org,'')) LIKE '%modmc%' THEN 1
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

      commonLogFilters.push("ip NOT IN ('223.119.20.199', '132.147.101.179')");

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

      eventFilters.push("ip NOT IN ('223.119.20.199', '132.147.101.179')");

      const eventWhere =
        `WHERE ${eventFilters.join(" AND ")}`;

      function adminUrl(overrides = {}) {
        const params = new URLSearchParams();

        params.set("range", overrides.range || activeRange);
        params.set("view", overrides.view || activeView);
        params.set("parents", overrides.parents || activeParents);

        const nextOrgSearch =
          overrides.orgSearch ?? activeOrgSearch;

        if (nextOrgSearch) {
          params.set("orgSearch", nextOrgSearch);
        }

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

      const recentLogFilters =
        [...commonLogFilters];

      const recentParams =
        [...rangeParams];

      if (activeOrgSearch) {
        recentLogFilters.push(`(
          lower(coalesce(org,'')) LIKE ?
          OR lower(coalesce(country,'')) LIKE ?
          OR lower(coalesce(city,'')) LIKE ?
        )`);
        recentParams.push(
          `%${activeOrgSearch.toLowerCase()}%`,
          `%${activeOrgSearch.toLowerCase()}%`,
          `%${activeOrgSearch.toLowerCase()}%`
        );
      }

      const recentLogWhere =
        recentLogFilters.length
          ? `WHERE ${recentLogFilters.join(" AND ")}`
          : "";

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
          ua,
          ${logBotCase} AS likely_bot
        FROM visitor_logs
        ${recentLogWhere}
        ORDER BY id DESC
        LIMIT ?
        OFFSET ?
      `)
        .bind(...recentParams, PAGE_SIZE + 1, offset)
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

      const dailyVisitorTotals = await env.DB.prepare(`
        SELECT
          COUNT(DISTINCT substr(ts, 1, 10) || ':' || visitor_id) AS visitor_days,
          MIN(substr(ts, 1, 10)) AS first_day,
          MAX(substr(ts, 1, 10)) AS last_day
        FROM visitor_logs
        ${logWhere}
      `)
        .bind(...rangeParams)
        .all();

      const dailyVisitorRow =
        dailyVisitorTotals.results[0] || {};

      const visitorDays =
        dailyVisitorRow.visitor_days || 0;

      let averageWindowDays = 0;

      if (activeRange === "today") {
        averageWindowDays = 1;
      } else if (activeRange === "7d") {
        averageWindowDays = 7;
      } else if (activeRange === "30d") {
        averageWindowDays = 30;
      } else if (dailyVisitorRow.first_day && dailyVisitorRow.last_day) {
        averageWindowDays =
          Math.max(
            1,
            Math.round(
              (
                new Date(`${dailyVisitorRow.last_day}T00:00:00Z`) -
                new Date(`${dailyVisitorRow.first_day}T00:00:00Z`)
              ) / (24 * 60 * 60 * 1000)
            ) + 1
          );
      }

      const averageDailyUniqueVisitors =
        averageWindowDays > 0
          ? (visitorDays / averageWindowDays).toFixed(1)
          : "0";

      const academicTotals = await env.DB.prepare(`
        SELECT COUNT(*) AS visits
        FROM visitor_logs
        ${academicWhere}
      `)
        .bind(...rangeParams)
        .all();

      const academicVisits =
        academicTotals.results[0]?.visits || 0;

      const academicVisitPercent =
        totalPageviews > 0
          ? `${((academicVisits / totalPageviews) * 100).toFixed(1)}%`
          : "0.0%";

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
          CASE
            WHEN path IN ('/research', '/research/') THEN '/research'
            ELSE path
          END AS path,
          COUNT(*) AS visits
        FROM visitor_logs
        ${logWhere}
        GROUP BY
          CASE
            WHEN path IN ('/research', '/research/') THEN '/research'
            ELSE path
          END
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
          COUNT(*) AS clicks
        FROM visitor_events
        ${eventWhere}
        GROUP BY text
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
        rawDate: r.date,
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

      const showRecentCategory =
        activeView === "total";

      const iosLogo = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI4MTQiIGhlaWdodD0iMTAwMCI+IDxwYXRoIGQ9Ik03ODguMSAzNDAuOWMtNS44IDQuNS0xMDguMiA2Mi4yLTEwOC4yIDE5MC41IDAgMTQ4LjQgMTMwLjMgMjAwLjkgMTM0LjIgMjAyLjItLjYgMy4yLTIwLjcgNzEuOS02OC43IDE0MS45LTQyLjggNjEuNi04Ny41IDEyMy4xLTE1NS41IDEyMy4xcy04NS41LTM5LjUtMTY0LTM5LjVjLTc2LjUgMC0xMDMuNyA0MC44LTE2NS45IDQwLjhzLTEwNS42LTU3LTE1NS41LTEyN0M0Ni43IDc5MC43IDAgNjYzIDAgNTQxLjhjMC0xOTQuNCAxMjYuNC0yOTcuNSAyNTAuOC0yOTcuNSA2Ni4xIDAgMTIxLjIgNDMuNCAxNjIuNyA0My40IDM5LjUgMCAxMDEuMS00NiAxNzYuMy00NiAyOC41IDAgMTMwLjkgMi42IDE5OC4zIDk5LjJ6bS0yMzQtMTgxLjVjMzEuMS0zNi45IDUzLjEtODguMSA1My4xLTEzOS4zIDAtNy4xLS42LTE0LjMtMS45LTIwLjEtNTAuNiAxLjktMTEwLjggMzMuNy0xNDcuMSA3NS44LTI4LjUgMzIuNC01NS4xIDgzLjYtNTUuMSAxMzUuNSAwIDcuOCAxLjMgMTUuNiAxLjkgMTguMSAzLjIuNiA4LjQgMS4zIDEzLjYgMS4zIDQ1LjQgMCAxMDIuNS0zMC40IDEzNS41LTcxLjN6Ii8+IDwvc3ZnPg==`;
        const linuxLogo = `data:image/png;base64,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`;
        const androidLogo = `data:image/png;base64,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`;
        const macosLogo = `data:image/png;base64,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`;
        const edgeLogo = `data:image/png;base64,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`;
        const windowsLogo = `data:image/png;base64,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`;
        const firefoxLogo = `data:image/png;base64,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`;
        const safariLogo = `data:image/png;base64,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`;
        const chromeLogo = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAATbElEQVR42sWbeZBd1X3nP79z7r1v60WtFZBkFkUsAiMwi0GCMbYpLyg4IZluJhUDLrLZw0xgMjMOuGaipxonVOyyCZ6JKyTGhjCDsXrAxmAIDIYmxtjE7Fhi30FqqVu9vf3ec85v/nivW2uLbuEkt+pX1cs795zv+e3LE1XlkJ9y2TA0ZBgactN/2vbE0GJ/19DpobrzXFJ3BvXGYknMB0OzEUkjAxG0EBPFOUdLn6OQjGZ5+wvp6f1J68J/8/hxp104OvP+gQHLmjVKuRwO9YhyiACFgQHD5s0egHsf69n+yP/9TSpTF2XVqXWmWVual4BzjhCURpoRJGBEAEE1YBzk4wQRwUaWJgEtdO20XaVHKfXeseK3f/dOPvzhqRmgmzcHQP/5AQ4OWPrbwN6544619ucPf84NbxsoEY4ILqXWbJEpaiQEQQQBxBiCogJ09lNANQTrwQevgphYRAo5QWxCGuW2yZFH3efXnnz9iosvf2YPoP6fC6AgIqiGnT8aOix7+LYrdXzqP5fqzXgqreMVD0JQNQJi2Fuq9t1n+ncTIITQfjUohCAEIlVbSgo0i8XM9fV8rfDJgeuXbtgwjIjpLNZfGcDBwUHb39/vAbZ/+b9dIu++9ZV8rXLYeK2OinEYsaLIXouCOyhAAA2K0d0A2ydqX4wKiuJJQ9RbzNHqXTCsK4/64opNX7llX0l6fwA7L3pj6OkF8Z1/d33X5Mil45UJvImcERPhZ9H/9wlw9zpD0OAS9VG+WMIvX3F77dIvfmH1qatHhsrl6Lxy2R06wHI5olx2b99665nm0YduzI1vP2m85XxkYwOhfaKgcwJ4QDENikEghN3yti/A3dto8C4sLkTWL1r5y9Y5H/u9lZdd9k/TZ5w/wM7CV7/6F+vj156/l107ultYZ5Fo5rb/BQG21wpGvSsZiVi8rNJcfeKnj/zSn/30YCAPDHBw0NLf71/72pfPCVueuYeJsW5P4o3FGkBEdovUvyhAsCiqeEtq497FFbf2Qxd84E/Lj0yfed89zQGdd3+/f/N731uvL2y5x4+NdDfVBMXbEAL/2k9AEVHbkChkE6Pd8dYt97z5vf+znv5+T7m8H55ob2xlw6ZNXLJu3dJ06J7bdOTdbqexN0atKghtg2CMAQXTNu1zemZVBVWCKnuJ/UF9Vds/JAGTEns7sr07+X/33za88qTTDtu0aRQwe0Y+eyE+8cStUlYNte/f9q14++srWipOJVjVQAjtgwRVQghoCAT91+OoChijtoG4ePj1Fe6W676FamDrVjmwiA4M2P7+zX7LF37/svzwmxfuSr0LSqSqneBDUd0DJHpA7oUQmIsoa0ckdI7cM9qmfZiPUaJx51338PYL37ryP1zG5s2egQG7F8ByuWxkcDB8qfKTJdeeHF23o9UMRsT6ENCgM4dug20D1A4nDwoCwAjYCDEGY0zHQBmMidqiLoII8yBtkwFrQAwYE9mpZjXY0XeuG77//qUMDoZyRx8NwKYTt4qq6tYfP/SXDx6d6/uHVYs0aqRirJ3RHW8UL3pAju2pX4aAEQVjsIDWavixcdKpCs1KhVajjq/VaFXGaVZrpJknCxGZU7IskKWQpZA2pU0tJW0prQxaGaStDjWVVhPSlpClQSZaQWVsom/bDX99Dapa7oiqbFQ1ZQhff+yOtbduf+TJkWaFBc1grrnjFX6tlUIUYTpuwYhgxWAQjDEYEYyYmf/PhIe+hdaaZF09mGOPwx6/BrvsCKLuLpAYn00Rpt7EjW4lG9sKrVGipIiaCKEtutYICIh4ZoIcgcjIXjGhsdPxvGIIwXZ1aXL8htNLp1z1NJRNNFQ+z1AeCj8eff6/TpqWyTvcSHdi/uGUpVz6yJvkjKUgihpDEMEoM1lBJyNAjbS5aC12skKrr4/41wfoOe98SsuPIs5FJCgBP8Nnr4YsSwmVt2m+fjfZGz9E0hHI9WIIWKMYIzM+VwEbBQSHEdMRT0MU0xF9TxAJUXcrShuP/gFcdQV/e7cVQP708c09P3xt6NVmSBdZJ6qigrH8l++/zHG76uTiiLyAGMHS1iPb4agRgxiDFfC1Kuasc+m5/PPkVx5J4lokmjJVV3ZVlKozINBlAwu7hd6ikAVDql2klddpPXM9bscQca67nbwARrSTMwo2CkQ2tM9hp8ErYqSjKmiUGBx2LFn2kWNYXZ6KVFXPu2vTb4VctEimUq8GaxTqkXDXmctYffdr1CxEAjmZzlIElfZPAcUCrWqF4sCl9F32B0TOkWuM8dLOiAdfgGffNuysxjgfUIUoMizuSjl1ufCREzOOWzaK6ToCu/7r1Ld8A/fyzSSFXiLriWPBWkMctYGJRB030c5/py2wMaYdBwX1Sa9ZlNZf/LcJfDsCZCqb+ndOspkPexFKLcczRy3gsdULWf/SKOPFAn0+kBhFJCBBCCJIFBMqUxQvvoQFl3+eqDpJpsJNP4u551kldQYbGWLLjJ56r7w9YXl5FO56LmbD2oRL16ckpk446SpcHNM9fBNRsRvBI8agvgNmWgHFdPRSZgKAduTYZoJklYuAb9uudScv/afKq9c6lxYIiMjeS95eVGDdS2PE6nEIkYCxIApqDKY6hV1/LkuvvJq4PkU1i/kfdyoPvmApxTG5xGCn37iPsSgmBiuWJ9+CX74jrF8lFGwTu3g9VF8mSl/G2CJoJ50SQUU7xkf28p8zhq4juYovjtcmb7Sti479+ITUPkfm2BMeArH3jPbmiLLAqW9MkCaWIAGr2ram6tGuLpZe8+ckxQI+C2y6U3j+3Yi+khAUwkEikWnv0pUX3tglvDAMH1ujCAbftQYZfYDEeJBp/9n2qyKyh0/tAOv4VIyIBqMSu+7g377P1EPj7PYVmzAdYUyTEyHXdDxw8hLeXJQnyTIyoOkhFUNWrVD41GcorjiSXKhzy8+FZ98RekqQhY613SNyUW3XZVRAVJDOB5yHvmLgqbeUv/+JUIgrSH4l2dLP4LWK2ggsYNuGToyAnaa2xw+xEGJBI4NGGkwxMomx5xhn+LBzftpo7XfLNgQmC4YfnLEScb4TgyppmpL19NL1sQ3EocbLOw33bjEsKBicn39s6Tz05oW7nlVeHrbk4jph0adwsgBjtR0RGbObpkMbIzNc3U1WCBZRc7apterLFMWr4tmbgipOoND0PLq6h6c/sJBS3RGMIWs0SFavobRiJVEIPPi8oZl6xOqcOTdTXeuQtUrdwwNbLIkJkFtBWjqOoE3UGNTs5phaQe1uTu4J0JhOluKah5veuHCCTzMQMbOnKIpqYPDMw0mNAQLONygefxI2F1NtBJ5+x5IYi6oceoYQhFgMT74tVBqBKM6hpZNAU8TYGfFsU9v/znJiCS5gjfmAqbq6WISDZXZBhHwr8OLhBe774BKKjQw1ltzhK7AoEzVlomax1s68ZV/O7f5hb87tmX0okBjLWNUwUQsYApr7ABoZJDKIld0rVXdbqQMh9BDbZImph6wTfsl75F9CLvX84Ixl7OrKk3MBukoYHJMNaLl25fr9dAKUtnqlWWCyIRiToaZEMJbZ7fEBCzGoCt5V1NgwLR5hLwu6LwWUyHtGS5bB0xaTa3VOg+3Ug9tiPJvOyR7ZuM6SN0rHcSvTPs4iqkgwbXw692xYjCKqmFyUkBmQOa0zlJrw4zVL2HJ4kdz4GBlCT15JIulEEe+Pg84H4gh6cuCCAi1U3bxbJ6qKsSUxeZvXEAIqMnPrs9mJdmLvaSSWW89YQu211wFhQZewpDuQamhHG8is1nK2jH+6Gp/6wNIez4JuULVE2dtE0+oz1wtUVUyEDzpiJpq1520Sozq3klkwQlcj4/FVi7g3DJNMNSgWLKeshMxLu654iI8RyILwoZXQk7M4nyKtFxGdX2MpoGqigA/N102fLe7waDu23OOG9uTmfpxVSGyem7pHGB7ZhmrCR9d4ipHD+U6tcx6cU1UEwQWlK844/ySl5SJovUucvgC2MK/GmekotCZLUhNieSyOItw87J8TpaDCS5Hj5u2PYnzM0Ys8n1krTDUEa+ffyrM2UGkIv3mqYdUSR80l5KceJnYjQDwPKyogQbFCSMfvMyVKP6PpVVCzbyw6G6GKx9Ody/F3b/2EVyrbIBS4+CzPaUc7dlbbxaFprh2ccxBZGK0ZzlwVuPhsTzMtYNKdRJP3gCnM87KUgBi8wcfFx8zJy0/9eSLJBNbKLJXAWZ9YDCONCv/9qVsxJiIRy5c+7Tj7aM9YTQkIxrarYPu7A8XY9mfGaspZRzuuucCTF0MaYrJtNxIxjJLMD6CiJrKStsL2HcVjnrG/uPF79W9tue+jjdivEhcCgpmPWc9HCU+Pv04amnxy+YfBOtaf4IkEXhlWKo0YHzrlvo6f8wqtzNBMLfk40H9G4IrzA8XYovTy4HM3cZz8gMTkQXfnkXN08oGSNWmz8NDSE799YwTo4mjB7dXYfTKtpwcLSQ/4ePUszHXzja33EQJsOuV3ifFcvr7JR9cIQ79MeeZdy/YJpdZq+6dSLrBqibD2iMBHTgqsWmjwFDGqXH3fN7mw64d09cb4VLGHEtoGgxP79zPScsPDtx/2tXfv3zoemr2JE1TmHzGrMUykNTYsP50vrx3g2N4VKCnYjGrqmawHqvWYINCVT+ktCF25CBtigkl4ZewtrrjnOxyePsEtHzX4Wjp/l6NBiZVmGk80+K2j+07/oyk57YbT4sf/8PHsQ7f+yf8aydev8NWmk32aMnO6NAErhsm0xuJ8L59ddS4DR67nmK7DKUVJp+7uOndqwSt153hl4h0Gn3+Qm555iEZtkucu6GJZMoYGO2/uhaDe9Ca2OiVf7frQ3V9k6LxINupGs0k26Zcf+s7aW3Y8+fhka1IMcsju2iBkwTGZNVlUKLF2wTGcuXAVR3UvoSdXAFXG0zpvTo3wxJsv8tSOl5hoTNJKY77+wRJ/fEIV13BERucb5ykxmgZXmYhOOH7pid/cARtFVBUZHLDav9mf/p0rrhvuTq+ilnoVsYcUT05PT2DweOquSRraliIx7cC86TJCw1FoBUo2Ic0Cx8TKwx/3JFrHqEUI8+wb4ky3jSbHk7/sPePOq2HAwmZvADZuWaOCyJW9Z11byuLxLFEhoHPxifv5yD2Mjyh0R0UWJyUWJEUKUULJJCyOiiyzRbqiPKij0kq5+viIQpRCYP7gFCVyJq3mx1v62b8CkXJ5je7Vwh4YHLCb+zf7T3/3msuesyM3pY1WFmHiQ+7E7hMYhZkhCkVDwNQyjAtMNlM+vjDhznNbuGaDWOaY2uzRQhMTMrqTeNfUys8tOvWGm6e5t1d/cHP/Zj8wOGDv/Z1rbz4y9N0VdRdiVXUqe+83V04GYS+aXhtUCZmD4Eg1I/GGjSdaJLQw8wTX8cWOBTYe31W8bdGpN9zM4G5w+3V412xZo1IW89UTLvr9nrp5NouIJOD9dKNlHnTA0CyEdvnMBYwq43Xls0fnOG3hJD71MwXieeidN8VWVNsVPTva93t/BGLo3xxmHUIol8uB8kbWrV2389d2Fi/o08J4logVxbvpSts+nJmN9os5FUxQFMW6QMMpy/OWq48LqJsOMHTOAXUI4kze21o9fue5l3o+sXr1p6cob2Tfl5j9WV4OA4OD9u4/+fq7n+ha85mFoVBJE6yo+n3FdX462ekS+3aDtJIpVx5jWV6axHvTFs858s2r96aQRmlWrNT8WRef9Tvf3cHggD3Q2OWsg0DTRufzt1+3/qfhjXu2uYke0wpOjER73tFcZt1CCBA84jw2DVQbGcfmYh45z1PQGnKgqvOBi5d4711UJGpk9o2dU6d/9shz/+KnexqV956T2cfo/M1v/6efXpA7dt1hvvCUdOcjr+oIovMbaezYct8uXrVc4M+OFUpRnenxlDlIQBD1PlocR1PN0lOP/mLRWe8Fbk7DeAODg3Zzf7//0Y9+1FeeuP+vdiTNS6utOiZTZ0Ts/ufT/Z2Ua4+dWB8Yr3s29Fh+cE4VnzraDXE9eISCevIhCsBko3DDO8NfuOaDGzaMvxe4OY9TTosrwIW3b7zk1ebIV8bi1mFpo4UJOBFjdxc09vF/LoD3qFfwDl91PLw+5pS+SYKzmFnABUWN4LEhopSjXvGvjtcLVy1f9/272wZRTLn83oM68xqIlbKIljX87zvuOPza6gP/vhKaf9wsao/PUkwmvtMTM50yKCEo+LbuRaqMTKVcsTzH/zy9im+6A7mF0B5WC0LkLfmYZs2N1DV3w4s7z7zu7E+WxzpcC7/SgdjZuHnl7devfrDy8qVNaV1ezfkjWiYQmh7rg6KEELzgAsYFyVIn3Qo/O1dZmasRnFUraGiPnSgilhjIR+CgXk22p2nhxlcn02+e9qk7ts9nCPZXMpQugwNGO5sNDj7Q+63mfb8xFvmLJtPquoq0lmbiybIMPNBsMVV1fOOEiP+4uoFrtIjycdvEmXa5rtVINYTcG2nmH6qF3h9ubVw8dP75/ZOda7UwGDiExoC8n68VlMtls4kho+XdXyt44omhxX/+2tDpw/XJc3B65rba9r6cJsceVUh6vru2ojlqYm0Rl42+EEtSaZneN9JgnmzV3T9ucb/xzCc+cUltZoOh8yLOe9jzPjoe/x+6kpNzH/64vAAAAABJRU5ErkJggg==`;

      function iconPill(kind, label, type, content) {
        const safeLabel =
          escapeHtml(label || "Other");
        const safeType =
          String(type || "other").replace(/[^a-z0-9_-]/gi, "");

        return `<span class="${kind}-icon ${safeType}" title="${safeLabel}" aria-label="${safeLabel}">${content}</span>`;
      }

      function logoImg(src) {
        return `<img src="${src}" alt="">`;
      }

      function fallbackSvg(label) {
        return `
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="8"></circle>
            <path d="M9.5 9a3 3 0 0 1 5 2c0 2-2.5 2-2.5 4"></path>
            <line x1="12" y1="18" x2="12" y2="18"></line>
          </svg>
        `;
      }

      function osIcon(ua) {
        const value =
          String(ua || "").toLowerCase();

        if (value.includes("iphone") || value.includes("cpu iphone os")) {
          return iconPill("os", "iOS", "ios", logoImg(iosLogo));
        }

        if (value.includes("ipad")) {
          return iconPill("os", "iPadOS", "ipados", logoImg(iosLogo));
        }

        if (value.includes("macintosh") || value.includes("mac os x")) {
          return iconPill("os", "macOS", "macos", logoImg(macosLogo));
        }

        if (value.includes("android")) {
          return iconPill("os", "Android", "android", logoImg(androidLogo));
        }

        if (value.includes("windows")) {
          return iconPill("os", "Windows", "windows", logoImg(windowsLogo));
        }

        if (value.includes("linux")) {
          return iconPill("os", "Linux", "linux", logoImg(linuxLogo));
        }

        return iconPill("os", "Other", "other", fallbackSvg("Other"));
      }

      function browserIcon(browser) {
        const value =
          String(browser || "").toLowerCase();

        if (value === "chrome") {
          return iconPill("browser", "Chrome", "chrome", logoImg(chromeLogo));
        }

        if (value === "safari") {
          return iconPill("browser", "Safari", "safari", logoImg(safariLogo));
        }

        if (value === "firefox") {
          return iconPill("browser", "Firefox", "firefox", logoImg(firefoxLogo));
        }

        if (value === "edge") {
          return iconPill("browser", "Edge", "edge", logoImg(edgeLogo));
        }

        return iconPill("browser", browser || "Other", "other", fallbackSvg(browser || "Other"));
      }

      function cleanDownloadLabel(path) {
        return String(path || "")
          .replace(/^DOWNLOAD:\s*/, "");
      }

      function cleanReferrerLabel(referer) {
        return String(referer || "-")
          .replace(/^https?:\/\//i, "")
          .replace(/\/+$/, "");
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

          if (host.endsWith("linkedin.com") || host.endsWith("lnkd.in")) {
            return "LinkedIn";
          }

          if (host === "com.linkedin.android") {
            return "LinkedIn";
          }

          if (host.endsWith("duckduckgo.com")) {
            return "DuckDuckGo";
          }

          if (host.endsWith("business.purdue.edu")) {
            return "Purdue Business";
          }

          if (host.endsWith("sheguoman.com")) {
            return "Guoman She's website";
          }

          if (host === "weixin110.qq.com") {
            return "QQ";
          }

          if (host === "search.yahoo.com") {
            return "Yahoo";
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
  background:
    linear-gradient(180deg, #f8fafc 0, #f6f7fb 280px),
    #f6f7fb;
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
  color:#334155;
  font-family:Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size:13px;
  font-weight:800;
  margin-top:28px;
  margin-bottom:10px;
  letter-spacing:0;
  text-transform:uppercase;
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
  border-bottom:1px solid #dde2eb;
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
  border-collapse:separate;
  border-spacing:0;
  margin-bottom:20px;
  background:#fff;
}

th{
  background:#f8fafc;
  color:#64748b;
  font-size:11px;
  font-weight:800;
  padding:8px 12px;
  text-transform:uppercase;
}

td{
  font-size:12px;
  line-height:1.25;
  padding:7px 12px;
}

th,td{
  border:0;
  border-bottom:1px solid #e5eaf2;
  text-align:left;
}

tr:last-child td{
  border-bottom:0;
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

.chart-actions{
  display:flex;
  align-items:center;
  gap:6px;
}

.chart-grain{
  padding:6px 9px;
  border:1px solid #d8dce5;
  border-radius:4px;
  background:#fff;
  color:#273244;
  cursor:pointer;
  font-size:12px;
  font-weight:700;
}

.chart-grain.active{
  background:#2f195f;
  border-color:#2f195f;
  color:#fff;
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
  margin-bottom:16px;
  box-shadow:0 8px 22px rgba(22,29,45,.05);
}

.table-scroll table{
  margin-bottom:0;
}

.table-tools{
  display:flex;
  align-items:center;
  gap:12px;
  margin:0 0 12px;
}

.table-search{
  width:min(420px, 100%);
  padding:9px 12px;
  border:1px solid #d8dce5;
  border-radius:6px;
  background:#fff;
  color:#111827;
  font:inherit;
  font-size:13px;
  box-shadow:0 4px 12px rgba(22,29,45,.04);
}

.table-search:focus{
  outline:2px solid rgba(63,31,143,.18);
  border-color:#8b7bc4;
}

.table-search-count{
  color:#64748b;
  font-size:12px;
  font-weight:700;
}

.table-search-button{
  padding:9px 12px;
  border:1px solid #d8dce5;
  border-radius:6px;
  background:#fff;
  color:#273244;
  font:inherit;
  font-size:13px;
  font-weight:700;
  cursor:pointer;
  box-shadow:0 4px 12px rgba(22,29,45,.04);
}

.table-search-clear{
  color:#64748b;
  font-size:12px;
  font-weight:700;
}

.wide-table{
  min-width:1060px;
}

.wide-table td{
  padding-top:6px;
  padding-bottom:6px;
}

.medium-table{
  min-width:720px;
}

.compact-table{
  min-width:0;
}

.compact-table th:last-child,
.compact-table td:last-child{
  width:1%;
  white-space:nowrap;
}

@media (min-width: 801px){
  .compact-table{
    table-layout:fixed;
  }

  .compact-table th:first-child,
  .compact-table td:first-child{
    width:78%;
  }

  .compact-table th:last-child,
  .compact-table td:last-child{
    width:22%;
  }
}

.stats-panel{
  display:grid;
  grid-template-columns:repeat(4, 1fr);
  margin:18px 0 28px;
  border:1px solid #dde2eb;
  border-radius:8px;
  background:#fff;
  overflow:hidden;
  box-shadow:0 8px 22px rgba(22,29,45,.05);
}

.stat-card{
  padding:18px 20px;
  border-right:1px solid #dde2eb;
  background:
    linear-gradient(180deg, rgba(63,31,143,.035), rgba(255,255,255,0) 70%),
    #fff;
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
  gap:20px;
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
  box-shadow:0 8px 22px rgba(22,29,45,.05);
}

.panel h2{
  color:#334155;
  font-size:13px;
  margin:0;
  padding:14px 16px;
  border-bottom:1px solid #dde2eb;
  background:#f8fafc;
  font-family:Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight:800;
  letter-spacing:0;
  text-transform:uppercase;
}

.panel h2.with-metric{
  align-items:center;
  display:flex;
  justify-content:space-between;
  gap:12px;
}

.heading-metric{
  background:#eef2ff;
  border-radius:999px;
  color:#302080;
  font-size:12px;
  font-weight:800;
  padding:4px 10px;
  text-transform:none;
  white-space:nowrap;
}

.clean-table{
  margin:0;
}

.clean-table th{
  background:#fff;
  color:#64748b;
  font-size:11px;
  text-transform:uppercase;
  letter-spacing:0;
}

.clean-table td{
  font-size:13px;
  line-height:1.25;
  padding:7px 12px;
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

.os-icon,
.browser-icon{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:22px;
  height:22px;
  border-radius:999px;
  background:transparent;
  overflow:hidden;
}

.os-icon img,
.browser-icon img{
  display:block;
  width:18px;
  height:18px;
  object-fit:contain;
}

.os-icon svg,
.browser-icon svg{
  width:16px;
  height:16px;
  fill:none;
  stroke:currentColor;
  stroke-linecap:round;
  stroke-linejoin:round;
  stroke-width:2;
}

.os-icon.ios img,
.os-icon.ipados img{
  width:14px;
  height:17px;
}

.os-icon.macos img{
  width:19px;
  height:19px;
}

.os-icon.linux img{
  width:20px;
  height:20px;
}

.browser-icon.chrome img,
.browser-icon.safari img,
.browser-icon.firefox img,
.browser-icon.edge img{
  width:20px;
  height:20px;
}

.os-icon.other,
.browser-icon.other{
  background:#f8fafc;
  color:#334155;
}

.pager{
  display:flex;
  gap:10px;
  margin:10px 0 22px;
  font-size:13px;
  font-weight:700;
}

.pager a{
  display:inline-block;
  padding:7px 11px;
  border:1px solid #d8dce5;
  border-radius:4px;
  background:#fff;
  color:#273244;
  text-decoration:none;
  box-shadow:0 4px 12px rgba(22,29,45,.04);
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

  .table-tools{
    display:block;
  }

  .table-search{
    width:100%;
  }

  .table-search-count{
    display:block;
    margin-top:8px;
  }

  .table-search-button,
  .table-search-clear{
    display:inline-block;
    margin-top:8px;
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

  .table-scroll th,
  .table-scroll td,
  .clean-table td{
    font-size:12px;
  }

  .clean-table th{
    font-size:10px;
  }

  .medium-table{
    min-width:620px;
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
    <div class="stat-label">Avg Daily Visitors</div>
    <div class="stat-value">${escapeHtml(averageDailyUniqueVisitors)}</div>
  </div>

</section>

<h2 id="recent-visitors">Recent Visitors</h2>

<form class="table-tools" action="/admin" method="get">
  <input type="hidden" name="range" value="${escapeHtml(activeRange)}">
  <input type="hidden" name="view" value="${escapeHtml(activeView)}">
  <input type="hidden" name="parents" value="${escapeHtml(activeParents)}">
  <input
    id="recentOrgSearch"
    name="orgSearch"
    class="table-search"
    type="search"
    placeholder="Search organization, country, or city"
    value="${escapeHtml(activeOrgSearch)}"
    autocomplete="off"
  >
  <button class="table-search-button" type="submit">Search</button>
  ${
    activeOrgSearch
      ? `<a class="table-search-clear" href="${adminUrl({
          orgSearch: "",
          page: 1
        })}">Clear</a>
         <span class="table-search-count">Searching all recent visitors</span>`
      : ""
  }
</form>

<div class="table-scroll">

<table class="wide-table">

<tr>
<th>Time</th>
<th>Organization</th>
<th>Country</th>
<th>City</th>
<th>IP</th>
<th>Browser</th>
<th>OS</th>
<th>Device</th>
<th>Page</th>
<th>Referrer</th>
${showRecentCategory ? "<th>Category</th>" : ""}
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
<td>${browserIcon(row.browser)}</td>
<td>${osIcon(row.ua)}</td>
<td>${escapeHtml(row.device_type)}</td>
<td>${escapeHtml(cleanDownloadLabel(row.path))}</td>
<td>${escapeHtml(cleanReferrerLabel(row.referer))}</td>
${showRecentCategory ? `<td>${categoryMetric(row)}</td>` : ""}
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
    <div class="chart-actions" aria-label="Traffic trend aggregation">
      <button class="chart-grain active" type="button" data-grain="daily">Daily</button>
      <button class="chart-grain" type="button" data-grain="weekly">Weekly</button>
      <button class="chart-grain" type="button" data-grain="monthly">Monthly</button>
    </div>
  </div>

  <div class="chart-canvas-wrap">
    <canvas id="trafficChart"></canvas>
  </div>
</section>


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
    <h2 class="with-metric">
      <span>Top Organizations</span>
      <span class="heading-metric">${escapeHtml(academicVisitPercent)} university visits</span>
    </h2>
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
        <td>${escapeHtml(cleanDownloadLabel(row.path))}</td>
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

<table class="compact-table">

<tr>
  <th>Paper</th>
  <th>Total Clicks</th>
</tr>
`;

      for (const row of linkTotals.results) {
        const paperTarget =
          goLinks[row.text] || row.target || "";

        html += `
<tr>
  <td>
    <a href="${escapeHtml(paperTarget)}" target="_blank">
      ${escapeHtml(row.text || paperTarget || "unknown")}
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

<table class="wide-table">

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

<h2>Dataset Downloads</h2>

<div class="table-scroll">

<table class="compact-table">

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

<table class="compact-table">

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

<table class="medium-table">

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


<script>

const data = ${JSON.stringify(chartData)};

function chartDate(rawDate) {
  return new Date(rawDate + "T00:00:00Z");
}

function shortDateLabel(date) {
  return date.toLocaleDateString(
    "en-SG",
    {
      month: "short",
      day: "numeric",
      timeZone: "UTC"
    }
  );
}

function monthLabel(date) {
  return date.toLocaleDateString(
    "en-SG",
    {
      month: "short",
      year: "numeric",
      timeZone: "UTC"
    }
  );
}

function weekStart(date) {
  const copy =
    new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day =
    copy.getUTCDay() || 7;

  copy.setUTCDate(copy.getUTCDate() - day + 1);
  return copy;
}

function aggregateTraffic(grain) {
  if (grain === "daily") {
    return data.map(row => ({
      date: row.date,
      visits: row.visits,
      unique: row.unique,
      pageviews: row.pageviews
    }));
  }

  const buckets =
    new Map();

  for (const row of data) {
    const date =
      chartDate(row.rawDate);

    const keyDate =
      grain === "monthly"
        ? new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))
        : weekStart(date);

    const key =
      keyDate.toISOString().slice(0, 10);

    if (!buckets.has(key)) {
      buckets.set(key, {
        key,
        date:
          grain === "monthly"
            ? monthLabel(keyDate)
            : shortDateLabel(keyDate),
        visits: 0,
        unique: 0,
        pageviews: 0
      });
    }

    const bucket =
      buckets.get(key);

    bucket.visits += Number(row.visits || 0);
    bucket.unique += Number(row.unique || 0);
    bucket.pageviews += Number(row.pageviews || 0);
  }

  return [...buckets.values()].sort((a, b) => a.key.localeCompare(b.key));
}

function chartConfig(rows) {
  return {
    type: "line",

    data: {
      labels: rows.map(x => x.date),

      datasets: [
        {
          label: "Visits",
          data: rows.map(x => x.visits),
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
          data: rows.map(x => x.unique),
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
          data: rows.map(x => x.pageviews),
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
  };
}

const trafficCanvas =
  document.getElementById("trafficChart");

let trafficChart =
  new Chart(trafficCanvas, chartConfig(aggregateTraffic("daily")));

for (const button of document.querySelectorAll(".chart-grain")) {
  button.addEventListener("click", () => {
    for (const other of document.querySelectorAll(".chart-grain")) {
      other.classList.toggle("active", other === button);
    }

    trafficChart.destroy();
    trafficChart =
      new Chart(trafficCanvas, chartConfig(aggregateTraffic(button.dataset.grain)));
  });
}


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

      if (!isIgnoredIp(ip) && !isCloudflarePreview) {
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
