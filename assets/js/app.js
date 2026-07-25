/* ============================================================================
   SHOIAB AKHTAR — AEROSPACE PORTFOLIO · interaction + visual engine
   Vanilla JS. No framework. Hand-rolled canvas 3D + particles.
   ========================================================================== */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------- PRELOADER */
  window.addEventListener("load", function () {
    var pre = $("#preloader");
    if (pre) { setTimeout(function () { pre.classList.add("done"); }, 450); }
  });
  // fail-safe: never trap the user behind the loader
  setTimeout(function () { var p = $("#preloader"); if (p) p.classList.add("done"); }, 2600);

  /* ---------------------------------------------------------- YEAR */
  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------- NAV / PROGRESS / TOTOP */
  var nav = $("#nav"), progress = $("#progress"), toTop = $("#toTop");
  function onScroll() {
    var sy = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle("scrolled", sy > 14);
    if (toTop) toTop.classList.toggle("show", sy > 640);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (h > 0 ? (sy / h) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* ---------------------------------------------------------- MOBILE MENU */
  var menuBtn = $("#menuBtn"), navLinks = $("#navLinks");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      menuBtn.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.closest("a")) { navLinks.classList.remove("open"); menuBtn.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ---------------------------------------------------------- GLOW FOLLOW */
  var glow = $("#glow");
  if (glow && !reduce && window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener("pointermove", function (e) {
      glow.style.left = e.clientX + "px"; glow.style.top = e.clientY + "px";
    }, { passive: true });
  }

  /* ---------------------------------------------------------- REVEAL */
  var revs = $$(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var ro = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revs.forEach(function (el) { ro.observe(el); });
  } else { revs.forEach(function (el) { el.classList.add("in"); }); }

  /* ---------------------------------------------------------- SCROLL SPY */
  var spy = {};
  $$(".nav-links a").forEach(function (a) { var href = a.getAttribute("href") || ""; if (href.charAt(0) === "#") spy[href.slice(1)] = a; });
  if ("IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) {
          for (var k in spy) if (spy.hasOwnProperty(k)) spy[k].classList.remove("active");
          if (spy[e.target.id]) spy[e.target.id].classList.add("active");
        }
      });
    }, { threshold: 0.4, rootMargin: "-18% 0px -50% 0px" });
    ["about", "skills", "projects", "thesis", "research", "experience"].forEach(function (id) { var el = document.getElementById(id); if (el) so.observe(el); });
  }

  /* ---------------------------------------------------------- MAGNETIC BUTTONS */
  if (!reduce && window.matchMedia("(pointer:fine)").matches) {
    $$(".magnetic").forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var mx = e.clientX - r.left - r.width / 2, my = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + mx * 0.18 + "px," + my * 0.28 + "px)";
      });
      btn.addEventListener("pointerleave", function () { btn.style.transform = ""; });
    });
  }

  /* ---------------------------------------------------------- TYPED HERO */
  var typed = $("#typed");
  var roles = ["Hypersonic aerodynamics.", "Aerothermodynamics & heat transfer.", "CFD & shock-tunnel research.", "Scientific computing & ML for aerospace.", "Building the future of hypersonic flight."];
  if (typed) {
    if (reduce) { typed.textContent = roles[roles.length - 1]; }
    else {
      var ri = 0, ci = 0, del = false;
      (function tw() {
        var w = roles[ri]; typed.textContent = w.slice(0, ci);
        if (!del) { if (ci < w.length) { ci++; setTimeout(tw, 48); } else { del = true; setTimeout(tw, 1600); } }
        else { if (ci > 0) { ci--; setTimeout(tw, 24); } else { del = false; ri = (ri + 1) % roles.length; setTimeout(tw, 320); } }
      })();
    }
  }

  /* ---------------------------------------------------------- SKILL PIPS */
  var skillsEl = $("#skills");
  function fillPips() {
    $$(".pips").forEach(function (p) {
      var lvl = parseInt(p.getAttribute("data-level"), 10) || 0;
      var pips = $$("i", p);
      pips.forEach(function (i, idx) { setTimeout(function () { if (idx < lvl) i.classList.add("on"); }, reduce ? 0 : idx * 90); });
    });
  }

  /* ---------------------------------------------------------- RADAR CHART */
  var DOMAINS = [
    { l: "CFD", v: 0.93 }, { l: "HYPERSONICS", v: 0.90 }, { l: "HEAT TRANSFER", v: 0.86 },
    { l: "PROGRAMMING", v: 0.85 }, { l: "SIMULATION", v: 0.80 }, { l: "EXPERIMENTAL", v: 0.72 }, { l: "AI / ML", v: 0.76 }
  ];
  function buildRadar() {
    var svg = $("#radar"); if (!svg) return;
    var cx = 210, cy = 210, R = 150, n = DOMAINS.length, rings = 4, NS = "http://www.w3.org/2000/svg";
    function pt(i, r) { var ang = -Math.PI / 2 + i * (2 * Math.PI / n); return [cx + Math.cos(ang) * r, cy + Math.sin(ang) * r]; }
    function poly(pts, cls) { var p = document.createElementNS(NS, "polygon"); p.setAttribute("points", pts.map(function (a) { return a.join(","); }).join(" ")); p.setAttribute("class", cls); return p; }
    // grid rings
    for (var g = 1; g <= rings; g++) {
      var pts = []; for (var i = 0; i < n; i++) pts.push(pt(i, R * g / rings));
      svg.appendChild(poly(pts, "radar-grid-l"));
    }
    // axes + labels
    for (var i2 = 0; i2 < n; i2++) {
      var e = pt(i2, R); var line = document.createElementNS(NS, "line");
      line.setAttribute("x1", cx); line.setAttribute("y1", cy); line.setAttribute("x2", e[0]); line.setAttribute("y2", e[1]); line.setAttribute("class", "radar-axis");
      svg.appendChild(line);
      var lp = pt(i2, R + 26); var t = document.createElementNS(NS, "text");
      t.setAttribute("x", lp[0]); t.setAttribute("y", lp[1]); t.setAttribute("class", "radar-label");
      t.setAttribute("text-anchor", Math.abs(lp[0] - cx) < 12 ? "middle" : (lp[0] > cx ? "start" : "end"));
      t.setAttribute("dominant-baseline", "middle"); t.textContent = DOMAINS[i2].l;
      svg.appendChild(t);
    }
    // data polygon
    var dpts = []; for (var k = 0; k < n; k++) dpts.push(pt(k, R * DOMAINS[k].v));
    var dp = poly(dpts, "radar-poly");
    dp.style.transformOrigin = cx + "px " + cy + "px";
    dp.style.transform = "scale(0.001)";
    svg.appendChild(dp);
    // vertex dots
    dpts.forEach(function (a) { var c = document.createElementNS(NS, "circle"); c.setAttribute("cx", a[0]); c.setAttribute("cy", a[1]); c.setAttribute("r", 3.2); c.setAttribute("class", "radar-dot"); svg.appendChild(c); });
    return dp;
  }
  var radarPoly = buildRadar();
  if (skillsEl && "IntersectionObserver" in window) {
    var sko = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { fillPips(); if (radarPoly) requestAnimationFrame(function () { radarPoly.style.transform = "scale(1)"; }); sko.disconnect(); } });
    }, { threshold: 0.3 });
    sko.observe(skillsEl);
  } else { fillPips(); if (radarPoly) radarPoly.style.transform = "scale(1)"; }

  /* ---------------------------------------------------------- SVG COVERS */
  function cover(kind) {
    var defs = '<defs><linearGradient id="g1" x1="0" x2="1"><stop offset="0" stop-color="#38BDF8"/><stop offset="1" stop-color="#3B82F6"/></linearGradient>' +
      '<linearGradient id="gt" x1="0" x2="1"><stop offset="0" stop-color="#38BDF8"/><stop offset="0.6" stop-color="#3B82F6"/><stop offset="1" stop-color="#FB923C"/></linearGradient>' +
      '<radialGradient id="rg" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FB923C" stop-opacity="0.85"/><stop offset="1" stop-color="#FB923C" stop-opacity="0"/></radialGradient></defs>';
    var grid = '<g stroke="rgba(148,163,184,.10)" stroke-width="1">';
    for (var x = 0; x <= 400; x += 40) grid += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="250"/>';
    for (var yv = 0; yv <= 250; yv += 40) grid += '<line x1="0" y1="' + yv + '" x2="400" y2="' + yv + '"/>';
    grid += '</g>';
    var body = "";
    switch (kind) {
      case "thesis":
        body = '<path d="M150 30 Q90 125 150 220" fill="none" stroke="url(#gt)" stroke-width="3"/>' +
          '<path d="M164 40 Q110 125 164 210" fill="none" stroke="#38BDF8" stroke-width="1.2" opacity=".5"/>' +
          '<ellipse cx="200" cy="125" rx="42" ry="56" fill="url(#rg)"/>' +
          '<path d="M200 75 A55 55 0 0 1 200 175 L320 162 Q336 125 320 88 Z" fill="#0b1226" stroke="#94A3B8" stroke-width="1.4"/>' +
          '<circle cx="200" cy="125" r="3" fill="#FB923C"/>' +
          '<g stroke="#5E6E89" stroke-width="1" fill="none"><path d="M40 80h40M40 125h40M40 170h40"/></g>'; break;
      case "tunnel":
        body = '<g stroke="#94A3B8" stroke-width="1.6" fill="none">' +
          '<rect x="36" y="104" width="90" height="42" rx="4" fill="#0b1226"/>' +
          '<path d="M126 104 L196 80 L196 170 L126 146 Z" fill="#0b1226"/>' +
          '<rect x="196" y="80" width="120" height="90" rx="4" fill="#0b1226"/>' +
          '<rect x="316" y="96" width="48" height="58" rx="4" fill="#0b1226"/></g>' +
          '<path d="M150 125h40" stroke="#FB923C" stroke-width="2"/>' +
          '<g stroke="url(#g1)" stroke-width="1.4" opacity=".8"><path d="M210 95 q40 30 0 60"/><path d="M236 90 q44 35 0 70"/></g>' +
          '<text x="44" y="98" fill="#38BDF8" font-family="monospace" font-size="9">DRIVER</text>' +
          '<text x="232" y="186" fill="#94A3B8" font-family="monospace" font-size="9">TEST SECTION</text>'; break;
      case "cfd":
        body = '<g stroke="url(#g1)" stroke-width="1" opacity=".55" fill="none">';
        for (var m = 0; m < 11; m++) body += '<path d="M' + (40 + m * 30) + ' 30 q-' + (m * 2) + ' 95 0 190"/>';
        for (var rr = 0; rr < 6; rr++) body += '<path d="M30 ' + (40 + rr * 36) + ' h340"/>';
        body += '</g>' +
          '<path d="M150 40 Q100 125 150 210" fill="none" stroke="#FB923C" stroke-width="2.4" opacity=".9"/>' +
          '<ellipse cx="190" cy="125" rx="36" ry="48" fill="url(#rg)"/>' +
          '<circle cx="186" cy="125" r="30" fill="#0b1226" stroke="#94A3B8" stroke-width="1.4"/>'; break;
      case "ai":
        body = '<g stroke="url(#g1)" stroke-width="1.2" opacity=".7">';
        var nodes = [[120, 70], [120, 125], [120, 180], [210, 95], [210, 155], [300, 125]];
        var edges = [[0, 3], [0, 4], [1, 3], [1, 4], [2, 3], [2, 4], [3, 5], [4, 5]];
        edges.forEach(function (e) { body += '<line x1="' + nodes[e[0]][0] + '" y1="' + nodes[e[0]][1] + '" x2="' + nodes[e[1]][0] + '" y2="' + nodes[e[1]][1] + '"/>'; });
        body += '</g><g fill="#38BDF8">';
        nodes.forEach(function (nn, i) { body += '<circle cx="' + nn[0] + '" cy="' + nn[1] + '" r="' + (i === 5 ? 7 : 5) + '" fill="' + (i === 5 ? '#FB923C' : '#38BDF8') + '"/>'; });
        body += '</g>'; break;
      case "automation":
        body = '<g fill="none" stroke="#94A3B8" stroke-width="1.4">' +
          '<rect x="40" y="100" width="70" height="50" rx="6" fill="#0b1226"/>' +
          '<rect x="165" y="100" width="70" height="50" rx="6" fill="#0b1226"/>' +
          '<rect x="290" y="100" width="70" height="50" rx="6" fill="#0b1226"/></g>' +
          '<g stroke="url(#g1)" stroke-width="2"><path d="M110 125h55"/><path d="M235 125h55"/></g>' +
          '<g fill="#38BDF8"><path d="M160 120l8 5-8 5z"/><path d="M285 120l8 5-8 5z"/></g>' +
          '<circle cx="75" cy="125" r="10" fill="none" stroke="#FB923C" stroke-width="2"/>'; break;
      case "future":
        body = '<path d="M40 210 Q170 40 360 60" fill="none" stroke="url(#gt)" stroke-width="2.4" stroke-dasharray="2 6"/>' +
          '<g transform="translate(300,70) rotate(38)"><path d="M0 -16 C8 -8 8 8 0 18 C-8 8 -8 -8 0 -16Z" fill="#0b1226" stroke="#38BDF8" stroke-width="1.6"/>' +
          '<path d="M0 18 l-6 10 6-3 6 3z" fill="#FB923C"/></g>' +
          '<g fill="#94A3B8"><circle cx="70" cy="190" r="2"/><circle cx="150" cy="120" r="2"/><circle cx="230" cy="86" r="2"/></g>'; break;
      case "cryo":
        body = '<g stroke="#5E6E89" stroke-width="1.4" fill="none"><path d="M56 30 v190 M56 220 h300"/></g>' +
          '<path d="M96 220 q64 -96 128 0" fill="none" stroke="#94A3B8" stroke-width="1.6"/>' +
          '<path d="M330 52 q-36 40 -60 58 t-56 44 q-16 14 -24 30" fill="none" stroke="url(#g1)" stroke-width="2.2"/>' +
          '<path d="M196 100 q-52 36 -36 96" fill="none" stroke="#38BDF8" stroke-width="1.4" stroke-dasharray="3 5" opacity=".8"/>' +
          '<path d="M160 196 l14 18" stroke="#FB923C" stroke-width="2.2"/>' +
          '<path d="M170 208 l6 8 -10 -1z" fill="#FB923C"/>' +
          '<g fill="#38BDF8"><circle cx="330" cy="52" r="3"/><circle cx="196" cy="100" r="3"/><circle cx="160" cy="196" r="3"/></g>' +
          '<text x="64" y="46" fill="#5E6E89" font-family="monospace" font-size="10">T</text>' +
          '<text x="340" y="216" fill="#5E6E89" font-family="monospace" font-size="10">s</text>' +
          '<text x="236" y="196" fill="#5E6E89" font-family="monospace" font-size="9">LHe 4.2 K</text>'; break;
      case "composite":
        body = '<g stroke="#94A3B8" stroke-width="1.4" fill="#0b1226">' +
          '<path d="M70 150 l130 -34 130 34 -130 34 Z"/>' +
          '<path d="M70 132 l130 -34 130 34 -130 34 Z" opacity=".85"/>' +
          '<path d="M70 114 l130 -34 130 34 -130 34 Z" opacity=".7"/></g>' +
          '<g stroke="url(#g1)" stroke-width="1" opacity=".65" fill="none">' +
          '<path d="M112 103 l88 -23 88 23"/><path d="M133 108 l67 -17 67 17"/><path d="M154 114 l46 -12 46 12"/></g>' +
          '<circle cx="200" cy="80" r="3" fill="#FB923C"/>' +
          '<g stroke="#FB923C" stroke-width="1.6" fill="none"><path d="M200 44 v24"/><path d="M195 62 l5 8 5 -8" fill="#FB923C"/></g>' +
          '<text x="252" y="52" fill="#5E6E89" font-family="monospace" font-size="9">LOAD</text>'; break;
      case "aircraft":
        body = '<path d="M40 128 Q120 118 300 122 L352 119 Q362 123 352 129 L300 132 Q120 140 40 132 Z" fill="#0b1226" stroke="#94A3B8" stroke-width="1.5"/>' +
          '<path d="M172 128 L214 168 L240 168 L212 128 Z" fill="#0b1226" stroke="#38BDF8" stroke-width="1.2"/>' +
          '<path d="M300 123 L332 94 L344 96 L320 125 Z" fill="#0b1226" stroke="#38BDF8" stroke-width="1.2"/>' +
          '<path d="M56 120 q8 -5 16 0" stroke="#FB923C" stroke-width="1.4" fill="none"/>' +
          '<g fill="#38BDF8"><circle cx="88" cy="126" r="1.6"/><circle cx="104" cy="126" r="1.6"/><circle cx="120" cy="126" r="1.6"/></g>'; break;
      case "injector":
        body = '<g fill="#0b1226" stroke="#94A3B8" stroke-width="1.5"><rect x="110" y="104" width="80" height="42" rx="4"/><path d="M190 108 L218 118 L218 132 L190 142 Z"/></g>' +
          '<g stroke="url(#gt)" stroke-width="1.4" fill="none" opacity=".9"><path d="M218 125 L330 92"/><path d="M218 125 L338 125"/><path d="M218 125 L330 158"/></g>' +
          '<g fill="#FB923C"><circle cx="300" cy="101" r="2"/><circle cx="322" cy="96" r="2"/><circle cx="312" cy="125" r="2"/><circle cx="334" cy="125" r="2"/><circle cx="300" cy="149" r="2"/><circle cx="322" cy="154" r="2"/></g>'; break;
      case "rocket":
        body = '<path d="M40 214 Q170 96 344 58" fill="none" stroke="url(#gt)" stroke-width="1.6" stroke-dasharray="2 6"/>' +
          '<g transform="translate(246,112) rotate(40)">' +
          '<path d="M0 -34 C11 -20 11 22 0 36 C-11 22 -11 -20 0 -34 Z" fill="#0b1226" stroke="#38BDF8" stroke-width="1.5"/>' +
          '<path d="M-9 20 L-22 42 L-4 30 Z" fill="#0b1226" stroke="#94A3B8" stroke-width="1"/>' +
          '<path d="M9 20 L22 42 L4 30 Z" fill="#0b1226" stroke="#94A3B8" stroke-width="1"/>' +
          '<circle cx="0" cy="-14" r="3.2" fill="#38BDF8"/>' +
          '<path d="M0 36 l-7 17 7 -4 7 4 z" fill="#FB923C"/></g>'; break;
      case "flightsim":
        body = '<line x1="30" y1="150" x2="370" y2="118" stroke="#38BDF8" stroke-width="1.4" opacity=".5"/>' +
          '<g transform="translate(196,120) rotate(-15)">' +
          '<path d="M-62 0 L40 0 L64 -5 L40 6 Z" fill="#0b1226" stroke="#94A3B8" stroke-width="1.5"/>' +
          '<path d="M-12 0 L-36 -34 L-2 -5 Z" fill="#0b1226" stroke="#38BDF8" stroke-width="1.2"/>' +
          '<path d="M-12 0 L-36 34 L-2 5 Z" fill="#0b1226" stroke="#38BDF8" stroke-width="1.2"/>' +
          '<path d="M-58 0 L-70 -15 L-50 -4 Z" fill="#0b1226" stroke="#94A3B8" stroke-width="1"/></g>' +
          '<path d="M250 96 L320 70" stroke="#FB923C" stroke-width="1" stroke-dasharray="2 4"/>' +
          '<circle cx="322" cy="69" r="3" fill="#FB923C"/>' +
          '<g stroke="#38BDF8" stroke-width="1" opacity=".55"><path d="M150 175 h40 M215 165 h40"/></g>'; break;
      case "rocketsim":
        body = '<path d="M62 220 Q120 118 208 96 T360 68" fill="none" stroke="url(#gt)" stroke-width="2.2"/>' +
          '<circle cx="360" cy="68" r="26" fill="none" stroke="#38BDF8" stroke-width="1" stroke-dasharray="3 4" opacity=".6"/>' +
          '<g transform="translate(120,150) rotate(30)"><path d="M0 -26 C8 -14 8 14 0 26 C-8 14 -8 -14 0 -26 Z" fill="#0b1226" stroke="#38BDF8" stroke-width="1.4"/>' +
          '<path d="M0 26 l-6 13 6 -3 6 3 z" fill="#FB923C"/></g>' +
          '<g fill="#94A3B8"><circle cx="62" cy="220" r="2.5"/></g>' +
          '<text x="300" y="60" fill="#5E6E89" font-family="monospace" font-size="9">ORBIT</text>'; break;
      case "finance":
        body = '<g stroke="#5E6E89" stroke-width="1.3" fill="none"><path d="M42 34 v176 h316"/></g>' +
          '<path d="M42 182 L104 150 L156 166 L214 112 L272 132 L346 70" fill="none" stroke="url(#g1)" stroke-width="2.4"/>' +
          '<g stroke="#38BDF8" stroke-width="1"><line x1="104" y1="138" x2="104" y2="188"/><line x1="214" y1="100" x2="214" y2="150"/></g>' +
          '<rect x="96" y="150" width="16" height="24" rx="2" fill="#38BDF8"/>' +
          '<rect x="206" y="112" width="16" height="20" rx="2" fill="#FB923C"/>' +
          '<circle cx="346" cy="70" r="3.4" fill="#FB923C"/>' +
          '<g fill="#38BDF8"><circle cx="104" cy="150" r="2.6"/><circle cx="214" cy="112" r="2.6"/></g>'; break;
      default:
        body = '<path d="M150 40 Q100 125 150 210" fill="none" stroke="url(#gt)" stroke-width="2.4"/>';
    }
    return '<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' + defs + grid + body + '</svg>';
  }

  /* ---------------------------------------------------------- PROJECT DATA */
  var PROJECTS = [
    {
      tag: "Thesis · Hypersonics", status: "Core", live: false, cover: "thesis",
      title: "Hypersonic Heat-Transfer Model",
      summary: "A fast analytical model for surface heat-transfer rates on hypersonic vehicles, validated against real-gas CFD.",
      chips: ["ANSYS Fluent", "Real-gas", "Fay–Riddell", "Python"],
      overview: "My Master's thesis: an analytical framework that predicts stagnation and distributed surface heating on hypersonic vehicles without running a full CFD campaign for every configuration, while capturing high-temperature real-gas chemistry.",
      objective: "Produce a low-cost, trustworthy heat-flux predictor and define exactly when real-gas (dissociation) effects must be included versus when ideal-gas relations suffice.",
      method: ["Derive analytical heat-transfer relations from boundary-layer & stagnation theory (Fay–Riddell, Sutton–Graves).", "Build a structured ANSYS Fluent benchmark: geometry → mesh → solver → post.", "Progress ideal-gas → real-gas with O₂ / N₂ dissociation and 5-species air.", "Compare analytical vs CFD across Mach / altitude conditions."],
      tools: ["ANSYS Fluent", "SpaceClaim", "DesignModeler", "Python", "MATLAB"],
      challenges: "Capturing chemical non-equilibrium and wall-catalysis effects analytically, and ensuring grid-converged, physically faithful CFD references at high enthalpy.",
      results: "A working analytical model that tracks CFD trends across regimes, plus a clear envelope marking where real-gas chemistry meaningfully changes predicted heating. (Quantitative validation ongoing.)",
      lessons: "Real-gas effects are not a small correction at high Mach — they reshape the heating picture. Verification discipline (grid, residuals, references) is everything.",
      future: "ML-accelerated surrogate of the model; coupling to transient thermal-protection-system response.",
      links: []
    },
    {
      tag: "Experimental", status: "Research", live: false, cover: "tunnel",
      title: "Shock-Tunnel Research",
      summary: "High-enthalpy shock-tunnel study of shock structure and surface heating in short-duration hypersonic flows.",
      chips: ["Shock tunnel", "High-enthalpy", "DAQ", "Post-processing"],
      overview: "Experimental investigation of hypersonic flow phenomena in a reflected-shock tunnel — generating high-enthalpy test gas for millisecond-scale studies of shock layers and aeroheating.",
      objective: "Acquire and reduce experimental heat-transfer and pressure data to anchor and validate analytical / CFD predictions.",
      method: ["Set up driver/driven conditions and test-gas state.", "Instrument the model (thin-film gauges / pressure taps).", "Capture short-duration signals via high-speed DAQ.", "Reduce raw signals to surface heat-flux and pressure."],
      tools: ["Shock tunnel facility", "High-speed DAQ", "Python / MATLAB", "Signal processing"],
      challenges: "Millisecond test times, noisy high-rate signals, and converting transient gauge data into reliable heat-flux histories.",
      results: "Reduced heat-transfer / pressure datasets usable as validation references for the analytical and CFD work.",
      lessons: "Experiment and simulation are strongest together — each exposes the other's blind spots.",
      future: "Expand the test matrix; cross-validate against the analytical model across enthalpies.",
      links: []
    },
    {
      tag: "Simulation", status: "Ongoing", live: false, cover: "cfd",
      title: "CFD Simulations",
      summary: "Compressible & high-speed CFD: meshing, shock-capturing, real-gas setups and post-processing in ANSYS Fluent.",
      chips: ["ANSYS Fluent", "Meshing", "Shock-capturing", "CFD-Post"],
      overview: "A body of CFD work simulating compressible and hypersonic flows — blunt bodies, shock interactions and surface heating — with emphasis on grid quality and physically faithful solver setup.",
      objective: "Generate verified high-speed-flow solutions for shock structure, surface pressure and heat flux to support analytical modelling.",
      method: ["Build/clean geometry in SpaceClaim & DesignModeler.", "Generate boundary-layer-resolved meshes; run grid-sensitivity studies.", "Configure compressible solver with real-gas options.", "Post-process contours, standoff, Cp and wall heat flux."],
      tools: ["ANSYS Fluent", "SpaceClaim", "DesignModeler", "CFD-Post", "Linux"],
      challenges: "Shock-capturing stability, near-wall resolution for heating, and convergence at high Mach with chemistry enabled.",
      results: "Converged solutions reproducing expected shock standoff and stagnation-region behaviour; reference fields for the thesis benchmark.",
      lessons: "Mesh independence and residual discipline decide whether a hypersonic solution is real or numerical fiction.",
      future: "Automate the meshing-to-post pipeline; integrate uncertainty quantification.",
      links: []
    },
    {
      tag: "M.Tech · Cryogenics", status: "Course project", live: false, cover: "cryo",
      title: "Modified Dual-Pressure Helium Liquefaction Cycle",
      summary: "Redesigned a helium liquefaction cycle with dual-pressure JT staging — 64.9% less compressor power, FoM up 171%.",
      chips: ["Cryogenics", "Helium", "Joule–Thomson", "Thermodynamics", "FoM"],
      overview: "A cryogenic-engineering course project: modifying a single-stage helium liquefaction cycle (the working fluid behind ITER, LHC and other superconducting systems) into a dual-pressure Joule–Thomson cycle with two-stage compression — based on the design principles of Su et al. (2020).",
      objective: "Improve liquid-helium yield economics and Figure of Merit without using turbine work — JT expansion only, no moving parts in the cold box.",
      method: ["Staged compression 1.5 → 6 → 14.7 bar with split ratio i = 0.75 (per literature optimisation).", "Two JT valves with a 6-HEX recuperative cascade; full state-point analysis (T–s diagram, states 1–10).", "Computed stage works (8.17 + 23.45 kW), yield and FoM from first principles (ideal work 6843 kJ/kg).", "Benchmarked against the baseline 90 kW single-stage cycle."],
      tools: ["Thermodynamic analysis", "Helium properties", "T–s cycle design", "Python / hand calcs"],
      challenges: "Cutting compressor work dramatically while holding liquid yield — with the no-turbine constraint ruling out the usual Claude-cycle expanders.",
      results: "Compressor power 90 → 31.62 kW (−64.9%); FoM 0.079 → 0.214 (+171%); liquid production 30 → 28.5 L/hr (only −5%).",
      lessons: "Where the work is done matters more than how much: smart pressure staging beats brute-force compression in cryogenic cycles.",
      future: "Add expander-assisted variants and exergy analysis per heat exchanger.",
      links: [{ t: "Report PDF", u: "assets/reports/dual-pressure-helium-cycle.pdf" }]
    },
    {
      tag: "Engineering Software · AI", status: "Live", live: true, cover: "ai",
      title: "AeroMind — AI Engineering Assistant",
      summary: "A local-first desktop command-center: monitors CFD runs, surfaces aerospace intelligence and automates research workflow.",
      chips: ["Python", "FastAPI", "React", "SQLCipher", "Privacy-first"],
      overview: "AeroMind is a personal aerospace command-center I built: a Python/FastAPI service with a React UI, encrypted local store and a model-agnostic AI layer, designed around strict consent-gated privacy.",
      objective: "Cut research friction — watch long CFD runs, aggregate aerospace/defence intel, and turn notes & tasks into action — without leaking data to the cloud.",
      method: ["FastAPI plugin architecture (16+ plugins).", "Encrypted SQLCipher local DB with backup/restore hardening.", "Model-agnostic AI layer (Anthropic / OpenAI-compatible / Ollama), budgeted & consent-gated.", "End-to-end encrypted phone push via ntfy."],
      tools: ["Python", "FastAPI", "React", "SQLCipher", "PyInstaller"],
      challenges: "Robust local data integrity (crash-safe SQLite), privacy-by-design, and keeping an offline-capable AI layer model-agnostic.",
      results: "A packaged, working desktop app — CFD sim-watching, opportunity radar, encrypted notifications and research tooling, with a hardened local database.",
      lessons: "Privacy and reliability are features, not afterthoughts. Plugin boundaries keep a big tool maintainable.",
      future: "Tighter coupling with the CFD/thesis workflow; smarter run-failure diagnosis.",
      links: [{ t: "GitHub", u: "https://github.com/ShoiabGoku" }]
    },
    {
      tag: "Engineering Software", status: "Live", live: true, cover: "automation",
      title: "Research Automation & Tools",
      summary: "Self-contained, verified engineering tools — incl. a compressible & hypersonic aerodynamics calculator.",
      chips: ["JavaScript", "Python", "Numerical methods", "Verification"],
      overview: "A suite of dependency-free research tools, headlined by a Compressible & Hypersonic Aerodynamics Calculator (isentropic, shocks, cone flow, real-gas equilibrium, shock-tube x–t, atmosphere) — every result verified 1:1 against a Python port of the physics.",
      objective: "Make research-grade compressible-flow analysis instant, reproducible and trustworthy — and automate repetitive reduction tasks.",
      method: ["Pure DOM-free physics engine (ports 1:1 to Python).", "Newton / secant solvers for shocks & equilibrium chemistry.", "Verification scripts against NACA 1135 / Anderson / textbook values.", "Single-file, offline-capable delivery."],
      tools: ["JavaScript", "Python", "NumPy", "HTML/CSS", "Git"],
      challenges: "Numerically robust equilibrium-air chemistry and oblique-shock root-finding across wide conditions.",
      results: "A live, verified calculator used for real coursework & research, plus reusable reduction scripts.",
      lessons: "If you can't verify it against a reference, you can't trust it. Dependency-free ages well.",
      future: "Add transient & viscous-interaction tools; package as a teaching resource.",
      links: [{ t: "Live demo", u: "https://shoiabgoku.github.io/Aerothermodynamic-calculator/" }, { t: "Source", u: "https://github.com/ShoiabGoku/Aerothermodynamic-calculator" }]
    },
    {
      tag: "Software · 3D / WebGL", status: "Live", live: true, cover: "flightsim",
      title: "AETHERWING — 3D Flight Simulator",
      summary: "A browser flight simulator: 7 aircraft, real cockpit systems & startup procedures, weather, day/night and a full glass cockpit — built in WebGL.",
      chips: ["Three.js", "WebGL", "Flight dynamics", "Web Audio"],
      overview: "A single-file, cinematic 3D flight simulator running entirely in the browser on Three.js / WebGL — seven aircraft from a Cessna 172 to Concorde and an F-16, each with its own flight model, exterior and cockpit.",
      objective: "Recreate believable flight — from cold-and-dark startup to a graded landing — with real systems logic, not just an arcade model.",
      method: ["Per-aircraft flight dynamics (Vr, V1, climb rate, ceiling, drag, afterburner).", "Per-type overhead systems + a guided startup director: battery → APU → bleed → fuel → engine start, order-enforced.", "Live glass cockpit — PFD, ND with course pointer and EICAS — drawn on canvas textures each frame.", "Weather (clear / rain / storm / fog) × time-of-day, 5 camera views, Web-Audio engine + spoken callouts."],
      tools: ["Three.js r128", "WebGL", "Web Audio API", "SpeechSynthesis", "Vanilla JS"],
      challenges: "Modelling interdependent aircraft systems (an engine won't start unless battery→APU→bleed→fuel happen in order) and rendering a live glass cockpit at frame rate.",
      results: "A playable multi-aircraft simulator with cold-start procedures, offset-runway navigation, animated control surfaces, a virtual joystick and a touchdown-quality debrief.",
      lessons: "Systems depth is what makes a sim feel real; a data-driven design (one config object per aircraft) keeps a ~1,500-line app maintainable.",
      future: "More aircraft & airports, failure scenarios, and shared multiplayer skies.",
      links: [{ t: "Live demo", u: "https://shoiabgoku.github.io/simulator-/" }, { t: "Source", u: "https://github.com/ShoiabGoku/simulator-" }]
    },
    {
      tag: "Software · Physics Sim", status: "Live", live: true, cover: "rocketsim",
      title: "Rocket Flight Lab — Ascent & Re-entry",
      summary: "A physics-accurate rocket simulator: powered ascent, staging, orbit insertion, re-entry heating and parachute recovery.",
      chips: ["Physics", "Orbital mechanics", "Sutton–Graves", "Canvas"],
      overview: "A single-file rocket flight simulator built on real physics — inverse-square gravity, a hydrostatically-integrated atmosphere, Mach-dependent drag, and aerodynamic heating with ablation. Directly connected to my aerothermodynamics work.",
      objective: "Let anyone design a vehicle and fly a full mission — launch, gravity-turn to orbit, deorbit and recovery — watching the real physics update live.",
      method: ["Inverse-square gravity + a US-Std-validated atmosphere table (RK integration).", "Mach-dependent drag by nose shape; Sutton–Graves heating with PICA ablation limits.", "Two-stage vehicles + gravity-turn guidance and an orbit-insertion phase machine.", "Parachute recovery (drogue / main deploy gates) and procedural Web-Audio flight sound."],
      tools: ["JavaScript", "Canvas 2D", "Web Audio API", "Numerical integration"],
      challenges: "Keeping the orbital-mechanics integration stable near-vertical, and modelling re-entry heating & ablation without a full CFD solver.",
      results: "Verified full missions — e.g. a 180 × 235 km orbit → deorbit → 7.3 km/s entry → parachute landing — all matching expected physics.",
      lessons: "It ties my aerothermodynamics thesis to interactive code: Sutton–Graves heating and re-entry are the same physics, made playable.",
      future: "3-DoF dynamics, more planets, and thermal-protection trade studies.",
      links: [{ t: "Live demo", u: "https://shoiabgoku.github.io/rocket-science/" }, { t: "Source", u: "https://github.com/ShoiabGoku/rocket-science" }]
    },
    {
      tag: "Software · Data / Web", status: "Live", live: true, cover: "finance",
      title: "FinDeck — Finance Learning & Markets Hub",
      summary: "A personal-finance dashboard: live markets, 10 learning modules, a 118-term glossary, calculators and a daily quiz.",
      chips: ["JavaScript", "Live APIs", "localStorage", "Data viz"],
      overview: "A self-contained finance learning platform and live-markets dashboard — built to teach myself finance, and usable by anyone starting out.",
      objective: "Turn scattered finance concepts into one clean, always-on hub with real market data and structured, progressive learning.",
      method: ["Live feeds — crypto (CoinGecko), forex and world indices — via resilient proxy fallbacks + localStorage caching.", "Ten progressive Learn modules with saved progress; a 118-term searchable glossary.", "Calculators (SIP, FD, lumpsum, EMI, inflation, goal) and a daily-rotating 30-question quiz.", "Everything cached & persisted locally — degrades to last-known values offline."],
      tools: ["Vanilla JS", "Fetch / REST APIs", "localStorage", "HTML / CSS"],
      challenges: "Making free market APIs reliable in the browser — CORS, rate limits and outages — solved with layered proxy fallbacks and cache-on-failure.",
      results: "A live, deployed dashboard with resilient data, daily-fresh content and full offline persistence.",
      lessons: "Robust engineering is mostly graceful failure — cache everything and degrade cleanly.",
      future: "News headlines, FII / DII data, and portfolio tracking.",
      links: [{ t: "Live demo", u: "https://shoiabgoku.github.io/investment/" }, { t: "Source", u: "https://github.com/ShoiabGoku/investment" }]
    },
    {
      tag: "B.Tech · Aero-Structural", status: "2024", live: false, cover: "aircraft",
      title: "Gulfstream G650 — Aerodynamic & Structural Optimisation",
      summary: "Aero-structural analysis and optimisation of the G650's wing, fuselage and landing gear in SolidWorks + ANSYS.",
      chips: ["ANSYS", "SolidWorks", "Aerodynamics", "Structures", "Optimisation"],
      overview: "A team design study of the Gulfstream G650 business jet: aerodynamic and structural analysis with iterative optimisation of the wing, fuselage and landing-gear configurations — SolidWorks for design refinement, ANSYS for simulation.",
      objective: "Enhance performance, stability and structural integrity across operating conditions through iterative aero-structural optimisation.",
      method: ["Wing: adjusted airfoil profile & sweep angle to cut drag while holding lift.", "Fuselage: improved aerodynamics and reduced weight against structural-strength constraints.", "Landing gear: improved durability and stress distribution under a range of impact loads.", "Iterated design (SolidWorks) ↔ simulation (ANSYS) to convergence."],
      tools: ["SolidWorks", "ANSYS", "AutoCAD", "Aircraft-design methods"],
      challenges: "Balancing drag reduction against lift and structural weight simultaneously across three coupled subsystems, and reconciling results with published G650 data.",
      results: "Measurable improvements in drag reduction, fuel efficiency and structural resilience across multiple simulated flight conditions (team: T. Kumaran, A. Todkar, S. Haran).",
      lessons: "Aircraft design couples everything — a wing tweak echoes through structures, stability and fuel burn. Optimisation is negotiation.",
      future: "Full CFD of the optimised wing and a winglet-geometry trade study.",
      links: []
    },
    {
      tag: "B.Tech · Materials", status: "Published", live: true, cover: "composite",
      title: "Banana-Fiber Composite — Fabrication & Testing",
      summary: "Fabricated and mechanically tested banana-fabric/epoxy composites — the experimental work behind my first-author Elsevier chapter.",
      chips: ["Composites", "LY556 epoxy", "Compression moulding", "Tribology", "Elsevier"],
      overview: "Hands-on materials research: fabricating natural banana-fabric reinforced polymer composites and characterising their mechanical & tribological behaviour — work that became Chapter 16 of Elsevier's \"Banana Fibres and Their Composites\" (first author).",
      objective: "Develop and test an eco-friendly, lightweight, cost-effective natural-fiber composite as a sustainable alternative to synthetic materials.",
      method: ["Laid up banana fabric with LY556 epoxy + HY951 hardener (compression moulding).", "Hot-press cure, then 24 h room-temperature cure under pressure.", "Precision-cut specimens (3 × 3 × 300 mm) for standard tests.", "Compression & pin-on-disc wear testing (ASTM G99) with worn-surface analysis."],
      tools: ["Compression moulding", "Hot press", "Tribometer", "ASTM standards"],
      challenges: "Achieving void-free curing and precision specimen cutting in a natural-fiber laminate — and translating lab results into a publishable, literature-grounded chapter.",
      results: "A published first-author Elsevier book chapter (with N. Prakash, M.M. Aswin et al., supervised by M. Chandrasekar) on industrial & tribological applications of banana-fiber composites.",
      lessons: "Materials research rewards patience — fabrication discipline upstream decides whether the data downstream means anything.",
      future: "Hybrid natural-fiber layups and aerospace-interior applications.",
      links: [{ t: "DOI", u: "https://doi.org/10.1016/B978-0-443-30237-4.00019-3" }, { t: "Chapter PDF", u: "assets/publications/banana-fibers-composites.pdf" }]
    },
    {
      tag: "B.Tech · Propulsion", status: "2023", live: false, cover: "injector",
      title: "High-Compression Fuel Injector",
      summary: "Designed a high-compression fuel injector for a propulsion design project in SolidWorks.",
      chips: ["Propulsion", "SolidWorks", "CAD", "Injector design"],
      overview: "A propulsion-course design project: modelling a high-compression fuel injector in SolidWorks, focusing on the geometry that governs atomisation and delivery.",
      objective: "Design an injector geometry suited to high-compression operation.",
      method: ["Define delivery / compression requirements.", "Parametric CAD modelling in SolidWorks.", "Iterate orifice & body geometry.", "Review for manufacturability."],
      tools: ["SolidWorks"],
      challenges: "Balancing atomisation geometry against high-compression constraints in a compact body.",
      results: "Successfully designed a high-compression fuel injector model in SolidWorks.",
      lessons: "Injector geometry drives spray quality and mixing far more than intuition suggests.",
      future: "CFD spray simulation to quantify atomisation and cone angle.",
      links: []
    },
    {
      tag: "B.Tech · Build", status: "2023", live: false, cover: "rocket",
      title: "Conventional Model Rocket",
      summary: "Designed and built a stable conventional model rocket end-to-end in a 14-day project.",
      chips: ["Rocketry", "Fabrication", "Stability", "Rapid build"],
      overview: "A hands-on rapid build: designing and fabricating a conventional model rocket from scratch within a two-week window.",
      objective: "Design, build and prepare to fly a stable model rocket under a tight deadline.",
      method: ["Aerodynamic & static-stability sizing (CG/CP).", "Airframe & fin fabrication.", "Assembly, finishing and checkout."],
      tools: ["Fabrication", "Hand tools", "Stability analysis"],
      challenges: "Holding an adequate stability margin while turning the whole build around in 14 days.",
      results: "Successfully designed and built the model rocket within the 14-day project window.",
      lessons: "Fast iteration plus the fundamentals of static stability get you a flyable vehicle quickly.",
      future: "Add an altimeter payload and recover flight data.",
      links: []
    },
    {
      tag: "Roadmap", status: "Planned", live: false, cover: "future",
      title: "Future Engineering Projects",
      summary: "Where I'm taking this next: ML-accelerated aerothermal prediction and re-entry / TPS design optimisation.",
      chips: ["ML surrogates", "Re-entry", "TPS", "Optimisation"],
      overview: "A forward roadmap connecting the thesis, experiments and software into a coherent research programme on predicting and managing hypersonic aeroheating.",
      objective: "Move from point predictions to fast, optimisation-ready aerothermal design tools.",
      method: ["Train ML surrogates on CFD + analytical data.", "Couple fluid–thermal–chemistry for transient heating.", "Optimise thermal-protection layouts under constraints.", "Release open, reproducible tooling."],
      tools: ["Python", "PyTorch / scikit-learn", "ANSYS Fluent", "C++"],
      challenges: "Generating enough trustworthy training data; trusting surrogates outside their training envelope.",
      results: "Planned — foundations laid by the current thesis, CFD and software work.",
      lessons: "Roadmaps should be honest about what's done vs intended.",
      future: "Collaborations with hypersonics / propulsion labs to pursue these directions.",
      links: []
    }
  ];

  /* ---------------------------------------------------------- RENDER PROJECT CARDS */
  var grid = $("#projGrid");
  if (grid) {
    PROJECTS.forEach(function (p, i) {
      var el = document.createElement("article");
      el.className = "proj reveal" + (i % 3 ? " d" + (i % 3) : "");
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.setAttribute("aria-label", p.title + " — open case study");
      el.dataset.idx = i;
      el.innerHTML =
        '<div class="proj-cover">' + cover(p.cover) +
        '<span class="ptag">' + p.tag + '</span>' +
        '<span class="pstatus' + (p.live ? " live" : "") + '">' + p.status + '</span></div>' +
        '<div class="proj-body"><h3>' + p.title + '</h3><p>' + p.summary + '</p>' +
        '<div class="chips">' + p.chips.map(function (c) { return '<span class="chip">' + c + '</span>'; }).join("") + '</div>' +
        '<span class="proj-more">Open case study <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg></span></div>';
      el.addEventListener("click", function () { openModal(i); });
      el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(i); } });
      grid.appendChild(el);
    });
    // re-observe newly added reveals
    if ("IntersectionObserver" in window && !reduce) {
      var pro = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); pro.unobserve(e.target); } }); }, { threshold: 0.1 });
      $$(".proj.reveal").forEach(function (el) { pro.observe(el); });
    } else { $$(".proj.reveal").forEach(function (el) { el.classList.add("in"); }); }
  }

  /* ---------------------------------------------------------- MODAL */
  var modal = $("#modal"), modalHero = $("#modalHero"), modalBody = $("#modalBody"), lastFocus = null;
  function block(title, html) { return '<div class="m-block"><h5>' + title + '</h5>' + html + '</div>'; }
  function list(arr) { return '<ul>' + arr.map(function (x) { return '<li>' + x + '</li>'; }).join("") + '</ul>'; }
  function openModal(i) {
    var p = PROJECTS[i]; if (!p || !modal) return;
    lastFocus = document.activeElement;
    modalHero.innerHTML = cover(p.cover) + '<span class="ptag" style="position:absolute;top:14px;left:14px;font-family:var(--font-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;padding:5px 10px;border-radius:100px;background:rgba(5,8,22,.7);border:1px solid var(--line-2);color:var(--cyan)">' + p.tag + '</span>';
    var links = p.links.length ? '<div class="m-links">' + p.links.map(function (l) {
      return '<a class="btn btn-ghost" href="' + l.u + '" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M9 7h8v8"/></svg>' + l.t + '</a>';
    }).join("") + '</div>' : "";
    modalBody.innerHTML =
      '<div class="m-tag">' + p.tag + ' · ' + p.status + '</div><h3>' + p.title + '</h3>' +
      '<div class="m-grid">' +
      '<div class="m-block m-full"><h5>Overview</h5><p>' + p.overview + '</p></div>' +
      block("Objective", '<p>' + p.objective + '</p>') +
      block("Tools used", '<div class="m-tools">' + p.tools.map(function (t) { return '<span class="chip">' + t + '</span>'; }).join("") + '</div>') +
      '<div class="m-block m-full"><h5>Methodology</h5>' + list(p.method) + '</div>' +
      block("Challenges", '<p>' + p.challenges + '</p>') +
      block("Results", '<p>' + p.results + '</p>') +
      block("Lessons learned", '<p>' + p.lessons + '</p>') +
      block("Future improvements", '<p>' + p.future + '</p>') +
      '</div>' + links;
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var c = $(".modal-close", modal); if (c) c.focus();
  }
  function closeModal() {
    if (!modal) return; modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; if (lastFocus) lastFocus.focus();
  }
  if (modal) {
    $$("[data-close]", modal).forEach(function (el) { el.addEventListener("click", closeModal); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("open")) closeModal(); });
  }

  /* ---------------------------------------------------------- CFD IMAGE LIGHTBOX */
  var ibox = $("#imgbox"), ibImg = $("#ibImg"), ibCap = $("#ibCap");
  if (ibox) {
    function ibOpen(fig) {
      var full = fig.getAttribute("data-full"); if (!full) return;
      var im = $("img", fig), cap = $(".cfd-cap", fig);
      ibImg.src = full; ibImg.alt = im ? im.alt : "";
      ibCap.textContent = cap ? cap.textContent : "";
      ibox.classList.add("open"); ibox.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden";
    }
    function ibClose() { ibox.classList.remove("open"); ibox.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; ibImg.src = ""; }
    $$(".cfd-fig").forEach(function (fig) {
      fig.addEventListener("click", function () { ibOpen(fig); });
      fig.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ibOpen(fig); } });
    });
    $$("[data-ibclose]", ibox).forEach(function (el) { el.addEventListener("click", ibClose); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && ibox.classList.contains("open")) ibClose(); });
  }

  /* ========================================================== HERO CAPSULE 3D */
  (function capsule() {
    var cv = $("#capsule"); if (!cv) return;
    var ctx = cv.getContext("2d"); if (!ctx) return;
    var DPR = Math.min(window.devicePixelRatio || 1, 2), W, H, cx, cy, scale, raf;

    // ---- build blunt re-entry body (revolved profile) ----
    var profile = [];
    (function buildProfile() {
      var Rn = 1.0, i;
      for (i = 0; i <= 8; i++) { var th = (i / 8) * (Math.PI / 3); profile.push([Rn * (1 - Math.cos(th)), Rn * Math.sin(th)]); } // blunt nose
      var nose = profile[profile.length - 1], baseX = 1.7, baseR = 0.42, seg = 7;
      for (i = 1; i <= seg; i++) { var t = i / seg; profile.push([nose[0] + (baseX - nose[0]) * t, nose[1] + (baseR - nose[1]) * t]); } // taper
    })();
    var NPHI = 22, verts = [], i, j;
    for (i = 0; i < profile.length; i++) {
      verts[i] = [];
      for (j = 0; j < NPHI; j++) {
        var phi = j / NPHI * Math.PI * 2;
        verts[i][j] = [profile[i][0] - 0.85, profile[i][1] * Math.cos(phi), profile[i][1] * Math.sin(phi)];
      }
    }
    function rotX(p, a) { var c = Math.cos(a), s = Math.sin(a); return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c]; }
    function rotY(p, a) { var c = Math.cos(a), s = Math.sin(a); return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c]; }
    function rotZ(p, a) { var c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]; }
    var viewYaw = -0.6, viewRoll = 0.32;

    // ---- freestream particles ----
    var parts = [];
    function seedParts() { parts = []; var n = reduce ? 0 : 46; for (var k = 0; k < n; k++) parts.push({ x: Math.random(), y: Math.random(), v: 0.0016 + Math.random() * 0.0026, o: 0.2 + Math.random() * 0.5 }); }

    function resize() {
      var r = cv.getBoundingClientRect(); W = cv.width = Math.max(1, Math.floor(r.width * DPR)); H = cv.height = Math.max(1, Math.floor(r.height * DPR));
      cx = W * 0.54; cy = H * 0.5; scale = Math.min(W, H) * 0.27; seedParts();
    }

    function project(p) { return [cx + p[0] * scale, cy - p[1] * scale, p[2]]; }
    var spin = 0;
    function transform(v) { return rotZ(rotY(rotX(v, spin), viewYaw), viewRoll); }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      // freestream streaks (left -> right)
      ctx.lineWidth = DPR;
      for (var k = 0; k < parts.length; k++) {
        var pt = parts[k]; pt.x += pt.v; if (pt.x > 1.1) { pt.x = -0.1; pt.y = Math.random(); }
        var px = pt.x * W, py = pt.y * H;
        ctx.strokeStyle = "rgba(148,163,184," + (pt.o * 0.5) + ")";
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 14 * DPR, py); ctx.stroke();
      }
      // bow shock (left of nose) + stagnation glow
      var noseScreen = project(transform(verts[0][0]));
      var gx = cx - scale * 1.15, gy = cy;
      var glowR = scale * 0.62;
      var grd = ctx.createRadialGradient(gx + scale * 0.2, gy, 0, gx + scale * 0.2, gy, glowR);
      grd.addColorStop(0, "rgba(251,146,60,0.32)"); grd.addColorStop(1, "rgba(251,146,60,0)");
      ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(gx + scale * 0.2, gy, glowR, 0, Math.PI * 2); ctx.fill();
      var pulse = reduce ? 0.6 : (0.45 + 0.2 * Math.sin(spin * 2.2));
      for (var s = 0; s < 3; s++) {
        var off = scale * (0.28 + s * 0.12);
        ctx.strokeStyle = s === 0 ? "rgba(251,146,60," + pulse + ")" : "rgba(56,189,248," + (0.28 - s * 0.08) + ")";
        ctx.lineWidth = (s === 0 ? 2.2 : 1.3) * DPR;
        ctx.beginPath();
        ctx.moveTo(cx - off, cy - scale * 0.95);
        ctx.quadraticCurveTo(cx - off - scale * 0.5, cy, cx - off, cy + scale * 0.95);
        ctx.stroke();
      }
      // wireframe body — meridians
      for (j = 0; j < NPHI; j++) {
        ctx.beginPath();
        for (i = 0; i < verts.length; i++) {
          var pr = project(transform(verts[i][j]));
          if (i === 0) ctx.moveTo(pr[0], pr[1]); else ctx.lineTo(pr[0], pr[1]);
        }
        var zmid = project(transform(verts[(verts.length / 2) | 0][j]))[2];
        ctx.strokeStyle = "rgba(56,189,248," + (0.18 + 0.32 * (zmid + 1) / 2) + ")";
        ctx.lineWidth = DPR; ctx.stroke();
      }
      // latitude rings
      for (i = 0; i < verts.length; i += 2) {
        ctx.beginPath();
        for (j = 0; j <= NPHI; j++) {
          var pr2 = project(transform(verts[i][j % NPHI]));
          if (j === 0) ctx.moveTo(pr2[0], pr2[1]); else ctx.lineTo(pr2[0], pr2[1]);
        }
        ctx.strokeStyle = "rgba(96,165,250,0.22)"; ctx.lineWidth = DPR; ctx.stroke();
      }
      // stagnation point
      ctx.fillStyle = "#FB923C"; ctx.beginPath(); ctx.arc(noseScreen[0], noseScreen[1], 3 * DPR, 0, Math.PI * 2); ctx.fill();

      if (!reduce) { spin += 0.006; raf = requestAnimationFrame(frame); }
    }
    resize();
    window.addEventListener("resize", function () { cancelAnimationFrame(raf); resize(); if (reduce) frame(); else { cancelAnimationFrame(raf); frame(); } });
    frame();
  })();

  /* ========================================================== BACKGROUND FIELD */
  (function bgField() {
    var cv = $("#bg-canvas"); if (!cv) return; var ctx = cv.getContext("2d"); if (!ctx || reduce) return;
    var DPR = Math.min(window.devicePixelRatio || 1, 2), W, H, stars, mouse = { x: -9999, y: -9999 };
    function resize() {
      W = cv.width = Math.floor(innerWidth * DPR); H = cv.height = Math.floor(innerHeight * DPR);
      cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px";
      var n = Math.min(90, Math.floor(innerWidth * innerHeight / 19000)); stars = [];
      for (var k = 0; k < n; k++) stars.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .08 * DPR, vy: (Math.random() - .5) * .08 * DPR, r: (Math.random() * 1.2 + .3) * DPR });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i]; s.x += s.vx; s.y += s.vy;
        if (s.x < 0) s.x = W; if (s.x > W) s.x = 0; if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;
        ctx.fillStyle = "rgba(148,163,184,.55)"; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
        for (var j = i + 1; j < stars.length; j++) {
          var o = stars[j], dx = s.x - o.x, dy = s.y - o.y, d = dx * dx + dy * dy, lim = (120 * DPR) * (120 * DPR);
          if (d < lim) { ctx.strokeStyle = "rgba(56,189,248," + (0.12 * (1 - d / lim)) + ")"; ctx.lineWidth = .6 * DPR; ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(o.x, o.y); ctx.stroke(); }
        }
        var mdx = s.x - mouse.x, mdy = s.y - mouse.y, md = mdx * mdx + mdy * mdy, ml = (150 * DPR) * (150 * DPR);
        if (md < ml) { ctx.strokeStyle = "rgba(251,146,60," + (0.4 * (1 - md / ml)) + ")"; ctx.lineWidth = .6 * DPR; ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
      }
      requestAnimationFrame(draw);
    }
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", function (e) { mouse.x = e.clientX * DPR; mouse.y = e.clientY * DPR; }, { passive: true });
    window.addEventListener("pointerout", function () { mouse.x = -9999; mouse.y = -9999; });
    resize(); draw();
  })();

})();
