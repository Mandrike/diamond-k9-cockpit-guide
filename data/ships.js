(function () {
  "use strict";

  function bind(action, key, context) {
    return { action: action, key: key, context: context };
  }

  function step(title, detail) {
    return { title: title, detail: detail };
  }

  function note(title, body) {
    return { title: title, body: body };
  }

  function stat(label, value) {
    return { label: label, value: value };
  }

  function quick(label, key, detail) {
    return { label: label, key: key, detail: detail };
  }

  function saleInfo(title, summary, locations) {
    return { title: title, summary: summary, locations: locations };
  }

  var LINKS = {
    uexRoutes: "https://uexcorp.space/trade/routes",
    uexRmc: "https://uexcorp.space/commodities/info/name/recycled-material-composite/",
    uexCmat: "https://uexcorp.space/commodities/info/name/construction-materials/tab/locations_buying/",
    uexMiningPricing: "https://uexcorp.space/mining/pricing",
    uexMiningRefineries: "https://uexcorp.space/mining/refineries",
    uexMiningLocations: "https://uexcorp.space/mining/locations",
    uexCommodities: "https://uexcorp.space/commodities",
    uexVehiclesBuy: "https://uexcorp.space/vehicles/home/list/in_game_sell/",
    uexItems: "https://uexcorp.space/items",
    uexRuinStation: "https://uexcorp.space/commodities/locations/name/admin-ruin-station/",
    uexCheckmate: "https://uexcorp.space/commodities/locations/name/admin-checkmate/",
    uexOrbituary: "https://uexcorp.space/commodities/locations/name/admin-orbituary/",
    uexNyxGatewayPyro: "https://uexcorp.space/commodities/locations/name/admin-nyx-gateway-pyro/",
    uexStantonGatewayNyx: "https://uexcorp.space/commodities/locations/name/admin-stanton-gateway-nyx/",
    uexPyroGatewayNyx: "https://uexcorp.space/commodities/locations/name/admin-pyro-gateway-nyx/",
    uexLevski: "https://uexcorp.space/terminals/info/name/commodity-shop---levski/tab/home/",
    scTradeShops: "https://sc-trade.tools/shops",
    wikiLevski: "https://starcitizen.tools/Levski",
    wikiNyx: "https://starcitizen.tools/Nyx_system",
    erkul: "https://www.erkul.games/live/calculator",
    uexAtlas: "https://uexcorp.space/items/info?name=atlas",
    uexBurst: "https://uexcorp.space/items/info?name=burst",
    uexHemera: "https://uexcorp.space/items/info/name/hemera/",
    uexAgni: "https://uexcorp.space/items/info?name=agni",
    uexXl1: "https://uexcorp.space/items/info?name=xl-1",
    uexTs2: "https://uexcorp.space/items/info?name=ts-2",
    uexPalisade: "https://uexcorp.space/items/info?name=palisade",
    uexRampart: "https://uexcorp.space/items/info?name=rampart",
    uexParapet: "https://uexcorp.space/items/info?name=parapet",
    uexFr76: "https://uexcorp.space/items/info/name/fr-76/",
    uexBreton: "https://uexcorp.space/items/info?name=breton",
    uexLotus: "https://uexcorp.space/items/info?name=lotus",
    uexDurango: "https://uexcorp.space/items/info?name=durango",
    uexJs300: "https://uexcorp.space/items/info?name=js-300",
    uexJs400: "https://uexcorp.space/items/info?name=js-400",
    uexUltraFlow: "https://uexcorp.space/items/info?name=ultra-flow",
    uexIceBox: "https://uexcorp.space/items/info/name/icebox/",
    uexChillMax: "https://uexcorp.space/items/info?name=chill-max",
    uexM7a: "https://uexcorp.space/items",
    uexPanther: "https://uexcorp.space/items",
    uexMiningHeads: "https://uexcorp.space/items",
    scTradeTools: "https://sc-trade.tools/"
  };

  function inferSaleUrl(name, detail) {
    var text = (name + " " + detail).toLowerCase();

    if (text.indexOf("rmc") !== -1 || text.indexOf("recycled material") !== -1) {
      return LINKS.uexRmc;
    }

    if (text.indexOf("cmat") !== -1 || text.indexOf("construction material") !== -1) {
      return LINKS.uexCmat;
    }

    if (text.indexOf("sc trade tools") !== -1) {
      return LINKS.scTradeTools;
    }

    if (text.indexOf("refinery") !== -1 || text.indexOf("refineries") !== -1) {
      return LINKS.uexMiningRefineries;
    }

    if (text.indexOf("mineral") !== -1 || text.indexOf("gem price") !== -1 || text.indexOf("harvestables") !== -1) {
      return LINKS.uexMiningPricing;
    }

    if (text.indexOf("mining outposts") !== -1 || text.indexOf("mine rå ore") !== -1) {
      return LINKS.uexMiningLocations;
    }

    if (
      text.indexOf("uex") !== -1 ||
      text.indexOf("route") !== -1 ||
      text.indexOf("tdd") !== -1 ||
      text.indexOf("cbd") !== -1 ||
      text.indexOf("commodity") !== -1 ||
      text.indexOf("cargo") !== -1 ||
      text.indexOf("demand") !== -1 ||
      text.indexOf("admin") !== -1 ||
      text.indexOf("trade") !== -1 ||
      text.indexOf("terminal") !== -1
    ) {
      return LINKS.uexRoutes;
    }

    return "";
  }

  function saleLocation(name, detail, warning, url) {
    return { name: name, detail: detail, warning: warning || "", url: url || inferSaleUrl(name, detail) };
  }

  function systemLocation(name, system, type, tags, services, detail, url, warning) {
    return {
      name: name,
      system: system,
      type: type,
      tags: tags || [],
      services: services || [],
      detail: detail,
      url: url || "",
      warning: warning || ""
    };
  }

  function purchaseSeller(name, price, system, updated) {
    return {
      name: name,
      price: price,
      system: system || "",
      updated: updated || ""
    };
  }

  function purchaseItem(name, manufacturer, role, category, tags, scu, sellers, note, url) {
    return {
      name: name,
      manufacturer: manufacturer,
      role: role,
      category: category,
      tags: tags || [],
      scu: scu || "",
      sellers: sellers || [],
      note: note || "",
      url: url || LINKS.uexVehiclesBuy
    };
  }

  function loadoutPart(slot, fit, buy, reason, url, warning) {
    return {
      slot: slot,
      fit: fit,
      buy: buy,
      reason: reason,
      url: url || LINKS.uexItems,
      warning: warning || ""
    };
  }

  function loadoutShip(id, name, role, category, tags, summary, parts, notes) {
    return {
      id: id,
      name: name,
      role: role,
      category: category,
      tags: tags || [],
      summary: summary,
      parts: parts || [],
      notes: notes || []
    };
  }

  function mode(id, title, keyGroups, procedure, notes, keybinds) {
    return {
      id: id,
      title: title,
      keyGroups: keyGroups,
      procedure: procedure,
      notes: notes || [],
      keybinds: keybinds || []
    };
  }

  window.SC_KEYBIND_GROUPS = {
    general: {
      title: "Generelt",
      items: [
        bind("Interact / inner thought", "Hold F", "Brug til døre, knapper, elevatorer, seats og kontekstvalg."),
        bind("Personal inventory", "I", "Åbn inventory."),
        bind("MobiGlas", "F1", "Åbn MobiGlas."),
        bind("Map / starmap", "F2", "Åbn map og ruteværktøjer."),
        bind("Contacts / comms", "F11", "Åbn contacts og comms."),
        bind("Camera cycle", "F4", "Skift mellem cockpit/third-person kamera."),
        bind("Free look", "Z", "Kig rundt uden at ændre flyveretning."),
        bind("Wipe helmet visor", "Left Alt + X", "Brugbar ved regn, sne og støv.")
      ]
    },
    flight: {
      title: "Flight",
      items: [
        bind("Systems ready", "Right Alt + R", "Starter standard ship/vehicle systems på nyere standardprofil."),
        bind("Throttle forward", "W", "Fremdrift."),
        bind("Throttle back", "S", "Bak eller reducer fremdrift."),
        bind("Strafe left", "A", "Lateral movement mod venstre."),
        bind("Strafe right", "D", "Lateral movement mod højre."),
        bind("Strafe up", "Space", "Løft skibet i coupled flight."),
        bind("Strafe down", "Left Ctrl", "Sænk skibet i coupled flight."),
        bind("Roll left", "Q", "Rul mod venstre."),
        bind("Roll right", "E", "Rul mod højre."),
        bind("Boost", "Left Shift", "Kort boost; hold øje med heat og fuel."),
        bind("Spacebrake", "X", "Bremser hårdt mod nuværende velocity."),
        bind("Coupled mode toggle", "C", "Skift mellem coupled og decoupled flight."),
        bind("Speed limiter", "Mouse Wheel", "Juster hastighedslimiter."),
        bind("NAV / quantum mode", "B", "Skift eller hold for quantum/NAV flow afhængigt af mode."),
        bind("Exit seat", "Hold Y", "Forlad pilot- eller turret-seat.")
      ]
    },
    landing: {
      title: "Landing / docking",
      items: [
        bind("Landing gear", "N", "Toggle landing gear."),
        bind("Autoland", "Hold N", "Brug kun når landing pad/hangar understøtter det."),
        bind("Request landing", "Left Alt + N", "Kalder ATC på stationer og landing zones."),
        bind("VTOL", "K", "Skift VTOL på skibe der understøtter det."),
        bind("Dock / undock request", "N", "Efter target lock mod docking target."),
        bind("Docking camera", "0", "Vis docking-kamera når relevant.")
      ]
    },
    cargo: {
      title: "Cargo / doors",
      items: [
        bind("Request cargo loading", "Right Alt + N", "Brug ved freight elevator/cargo flow, hvor understøttet."),
        bind("Port lock toggle all", "Right Alt + K", "Lås item ports op/ned før ship weapon/part handling."),
        bind("Open / close doors", "No default", "Bind selv hvis du ofte bruger ramp, doors eller cargo bay."),
        bind("Lock / unlock doors", "No default", "Bind selv hvis du vil have hurtig security-control."),
        bind("Move inventory item instantly", "Shift + Left Mouse", "Flytter items hurtigere i inventory UI.")
      ]
    },
    tractor: {
      title: "Tractor beam",
      items: [
        bind("Tractor mode", "Left Mouse", "Træk objektet mod dig med multitool/tractor."),
        bind("Detach / alternate", "Right Mouse", "Detach eller secondary tractor action."),
        bind("Increase distance", "Mouse Wheel Up", "Flyt objektet længere væk."),
        bind("Decrease distance", "Mouse Wheel Down", "Flyt objektet tættere på."),
        bind("Rotate object", "Hold R + Mouse", "Rotér cargo, boxes eller komponenter.")
      ]
    },
    combat: {
      title: "Combat",
      items: [
        bind("Fire weapon group 1", "Left Mouse", "Primær våbengruppe."),
        bind("Fire weapon group 2", "Right Mouse", "Sekundær våbengruppe eller precision action."),
        bind("Gimbal state", "G", "Cycle gimbal/locked state."),
        bind("Precision targeting", "Right Mouse", "Toggle/hold precision targeting i combat modes."),
        bind("Missile operator mode", "Middle Mouse", "Skift til missiles."),
        bind("Launch missile", "Left Mouse", "Affyr armed missile i missile mode."),
        bind("Cycle missile type", "Mouse Wheel", "Skift missile type."),
        bind("Increase armed missiles", "G", "Øg antal armed missiles."),
        bind("Reset armed missiles", "Left Alt + G", "Nulstil missile salvo."),
        bind("Decoy launch", "Tap H", "Affyr decoy burst."),
        bind("Decoy set burst", "Hold H", "Hold for configured decoy burst."),
        bind("Noise deploy", "J", "Deploy noise countermeasure.")
      ]
    },
    targeting: {
      title: "Targeting",
      items: [
        bind("Target ahead / nearest", "T", "Lås eller vælg target afhængigt af HUD-state."),
        bind("Unlock target", "Left Alt + T", "Frigør target lock."),
        bind("Lock pin 1", "1", "Lås pinned target 1."),
        bind("Lock pin 2", "2", "Lås pinned target 2."),
        bind("Lock pin 3", "3", "Lås pinned target 3."),
        bind("Pin target 1", "Left Alt + 1", "Gem nuværende target i pin 1."),
        bind("Pin target 2", "Left Alt + 2", "Gem nuværende target i pin 2."),
        bind("Pin target 3", "Left Alt + 3", "Gem nuværende target i pin 3."),
        bind("Cycle attackers", "4", "Skift mellem attackers."),
        bind("Cycle hostiles", "5", "Skift mellem hostile targets."),
        bind("Cycle friendlies", "6", "Skift mellem friendly targets.")
      ]
    },
    power: {
      title: "Power",
      items: [
        bind("Power all", "U", "Toggle power samlet."),
        bind("Thrusters power", "I", "Toggle thruster power."),
        bind("Shields power", "O", "Toggle shield power."),
        bind("Weapons power", "P", "Toggle weapon power."),
        bind("Power to weapons", "F5", "Øg power til weapons."),
        bind("Power to engines", "F6", "Øg power til engines."),
        bind("Power to shields", "F7", "Øg power til shields."),
        bind("Reset power distribution", "F8", "Reset power triangle/assignments.")
      ]
    },
    scanning: {
      title: "Scanning",
      items: [
        bind("Scanning mode", "V", "Åbn scanning operator mode."),
        bind("Ping", "Tab", "Aktiver ping mode."),
        bind("Activate scan", "Left Mouse", "Scan fokuseret target."),
        bind("Increase scan angle", "Mouse Wheel Up", "Bredere scanvinkel."),
        bind("Decrease scan angle", "Mouse Wheel Down", "Smallere scanvinkel.")
      ]
    },
    mining: {
      title: "Mining ship",
      items: [
        bind("Mining mode", "M", "Skift til mining operator mode."),
        bind("Mining actions PIT", "Left Alt + M", "Åbn mining action wheel hvis tilgængelig."),
        bind("Fire mining laser", "Left Mouse", "Aktiver fracture/mining beam."),
        bind("Switch mining laser / extraction", "Left Alt + Left Mouse", "Skift mellem fracture/extraction hvor relevant."),
        bind("Increase mining power", "Mouse Wheel Up", "Øg laser power."),
        bind("Decrease mining power", "No default", "Bind selv hvis din profil ikke har standard for power ned."),
        bind("Cycle mining gimbal", "G", "Cycle gimbal/aim behavior."),
        bind("Mining module slot 1", "Left Alt + 1", "Aktiver consumable/module slot 1."),
        bind("Mining module slot 2", "Left Alt + 2", "Aktiver consumable/module slot 2."),
        bind("Mining module slot 3", "Left Alt + 3", "Aktiver consumable/module slot 3."),
        bind("Jettison cargo", "Left Alt + J", "Dump mined cargo ved fejl eller høj risiko.")
      ]
    },
    salvage: {
      title: "Salvage ship",
      items: [
        bind("Salvage mode", "M", "Deploy salvage arm / salvage operator mode."),
        bind("Activate salvage beam", "Left Mouse", "Scrape hull med fokuseret beam."),
        bind("Cycle salvage modifiers", "Right Mouse", "Skift salvage head/modifier."),
        bind("Salvage gimbal", "G", "Toggle salvage gimbal."),
        bind("Focus fracture tool", "Left Alt + W", "Skift fokus til fracture/structural salvage efter hull scrape."),
        bind("Focus all salvage heads", "Left Alt + S", "Tilbage til almindelig scraping/all heads."),
        bind("Toggle fracture fire", "Right Alt + W", "Fracture vraget i større dele når hull er scraped nok."),
        bind("Toggle disintegrate fire", "Right Alt + S", "Disintegrate/fræs delene til Construction Materials."),
        bind("Toggle fire left", "Right Alt + A", "Tænd/sluk venstre salvage head."),
        bind("Toggle fire right", "Right Alt + D", "Tænd/sluk højre salvage head."),
        bind("Relative beam spacing", "Mouse Wheel", "Juster afstand mellem salvage beams."),
        bind("Beam axis toggle", "Left Alt + Right Mouse", "Skift beam axis."),
        bind("Reset salvage gimbal", "Left Alt + G", "Nulstil gimbal state."),
        bind("Cycle salvage targets", "Right Alt + T", "Skift fokuseret salvage target.")
      ]
    },
    medical: {
      title: "Medical",
      items: [
        bind("Draw medgun", "3", "Træk medgun hvis udstyret."),
        bind("Draw medpen", "4", "Træk medpen/oxypen."),
        bind("Draw multitool", "5", "Træk multitool med attachment."),
        bind("Use medgun / medpen", "Left Mouse", "Heal target eller brug item."),
        bind("Self heal / diagnose", "B", "Medgun self mode."),
        bind("Heal other with medpen", "Right Mouse", "Når medpen er aktiv."),
        bind("Medical beacon", "Hold M", "Request rescue når incapacitated.")
      ]
    },
    fps: {
      title: "On foot",
      items: [
        bind("Move", "W / A / S / D", "Standard movement."),
        bind("Sprint", "Hold Left Shift", "Sprint."),
        bind("Crouch", "C", "Toggle crouch."),
        bind("Prone", "Left Ctrl", "Toggle prone."),
        bind("Jump", "Space", "Jump eller ledge-climb."),
        bind("Reload", "R", "Reload weapon/tool."),
        bind("Holster", "Hold R", "Holster weapon/tool."),
        bind("Flashlight", "T", "Suit/weapon light afhængigt af item.")
      ]
    },
    ground: {
      title: "Ground vehicle",
      items: [
        bind("Systems ready", "Right Alt + R", "Start vehicle systems."),
        bind("Drive forward", "W", "Kør frem."),
        bind("Drive backward", "S", "Bak."),
        bind("Turn left", "A", "Drej venstre."),
        bind("Turn right", "D", "Drej højre."),
        bind("Brake", "X", "Vehicle brake."),
        bind("Boost", "Left Shift", "Vehicle boost."),
        bind("Horn", "Space", "Horn."),
        bind("Vehicle light", "L", "Toggle vehicle light."),
        bind("Retract turret", "P", "Retract/deploy vehicle turret hvor relevant."),
        bind("Vehicle fire", "Left Mouse", "Fyr aktiv weapon/mining preset."),
        bind("Next weapon preset", "Mouse Wheel Down", "Næste weapon preset."),
        bind("Previous weapon preset", "Mouse Wheel Up", "Forrige weapon preset.")
      ]
    },
    groundMining: {
      title: "ROC / ground mining",
      items: [
        bind("Mining / weapon fire", "Left Mouse", "Aktiver mining beam."),
        bind("Collect / alternate beam", "Right Mouse", "Brug extraction/alternate action hvor relevant."),
        bind("Adjust beam power", "Mouse Wheel", "Juster mining power eller preset."),
        bind("Scanning operator mode", "V", "Scan efter gems eller targets."),
        bind("Jettison cargo", "Left Alt + J", "Dump cargo hvis nødvendigt.")
      ]
    },
    turret: {
      title: "Turret",
      items: [
        bind("Turret gyro stabilization", "E", "Toggle gyro stabilization."),
        bind("Toggle turret mouse movement", "Q", "Skift VJoy/FPS style."),
        bind("Recenter turret", "Hold C", "Recenter turret."),
        bind("Change turret position", "S", "Skift remote turret position hvor relevant."),
        bind("Exit remote turret", "Hold Y", "Forlad turret seat."),
        bind("Precision targeting", "Right Mouse", "Precision targeting fra turret.")
      ]
    }
  };

  window.SC_SYSTEM_REFERENCE = {
    id: "solsystemer",
    type: "system-reference",
    name: "Solsystemer",
    manufacturer: "Stanton / Pyro / Nyx",
    callsign: "SYSTEMS · PLACES",
    image: "assets/icons/module-systems.svg",
    navIcon: "assets/icons/module-systems.svg",
    status: "system",
    statusLabel: "Kort",
    category: "system",
    primaryRole: "Mining, salvage, refineries, shops og salgssteder",
    tags: ["system", "locations", "mining", "salvage", "refinery", "sale", "shop"],
    summary: "Hovedfolder for de aktive systemer. Vælg Stanton, Pyro eller Nyx, og brug derefter filtre til mining, salvage, refineries, shops, stationer og salgssteder.",
    stats: [stat("Systemer", "3"), stat("Live links", "UEX / SC Trade"), stat("Fokus", "Cockpit lookup")],
    systemGroups: [
      {
        id: "stanton",
        name: "Stanton",
        label: "UEE core / stabil start",
        status: "Core",
        summary: "Bedst til faste TDD/CBD-ruter, L-point refineries, ROC-start og sikre test-runs.",
        tags: ["TDD", "Refineries", "ROC", "Cargo"]
      },
      {
        id: "pyro",
        name: "Pyro",
        label: "High risk / frontier",
        status: "Risk",
        summary: "Brug Ruin Station, Checkmate, Orbituary og gateway-stationer som praktiske hubs. Check risiko før cargo eller salvage.",
        tags: ["Ruin", "Checkmate", "Orbituary", "Gateway"]
      },
      {
        id: "nyx",
        name: "Nyx",
        label: "Levski / Delamar",
        status: "New",
        summary: "Nyx er systemet du tænkte på. Levski er hovedhub med commodity, refinery, shops og ship services.",
        tags: ["Levski", "Delamar", "Gateways", "Refinery"]
      }
    ],
    quickActions: [
      quick("Vælg system", "Stanton/Pyro/Nyx", "Klik et systemkort øverst i Solsystemer."),
      quick("Find refinery", "Refinery", "Vælg system og brug Refinery-filteret."),
      quick("Find mining", "Mining", "Brug Mining-filteret og åbn UEX Mining Locations for aktuelle ressourcer."),
      quick("Find salvage", "Salvage", "Brug Salvage-filteret til RMC/CMAT, panel loops og station demand."),
      quick("Find salg", "Salg", "Brug Salg-filteret før du fylder C2, Taurus, Prospector eller Vulture."),
      quick("Find shops", "Shop", "Find mining support, ship parts, items og købssteder."),
      quick("Live check", "UEX", "Klik live-linket før store runs; økonomi og terminaler flytter sig.")
    ],
    saleInfo: saleInfo("System live links", "Direkte links til siderne du typisk skal bruge før et mining-, salvage- eller cargo-run i Stanton, Pyro eller Nyx.", [
      saleLocation("UEX Trade Routes", "Cargo, commodity demand, buy/sell og route planning.", "", LINKS.uexRoutes),
      saleLocation("UEX Mining Refineries", "Refinery yields, workloads og stationer med processing.", "", LINKS.uexMiningRefineries),
      saleLocation("UEX Mining Locations", "Find rapporterede minebare ressourcer efter system, moon, planet og L-point.", "", LINKS.uexMiningLocations),
      saleLocation("UEX RMC", "RMC demand og salgssteder til Vulture/Reclaimer salvage.", "", LINKS.uexRmc),
      saleLocation("UEX CMAT", "Construction Materials demand og salgssteder.", "", LINKS.uexCmat)
    ]),
    modes: [
      mode("stanton", "Stanton", [], [
        step("Vælg Stanton", "Brug Stanton når du vil have den mest stabile base for TDD/CBD, refineries, mining og test-runs."),
        step("Filter efter job", "Mining viser Aaron Halo, L-points og ROC-områder. Refinery viser ARC/HUR/MIC/CRU L-points. Salg viser TDD/CBD/admin."),
        step("Verificér live", "Klik UEX-linket før store cargo, refined ore, RMC eller CMAT runs.")
      ], [
        note("Brug i spillet", "Søg efter stationkoder som ARC-L1, HUR-L1, MIC-L1, CRU-L1 eller TDD/CBD."),
        note("Operational rule", "Pris alene er ikke nok. Check distance, demand, freight elevator og hangar size.")
      ]),
      mode("pyro", "Pyro", [], [
        step("Vælg Pyro", "Brug Pyro når du vil have frontier-ruter, højere risiko og hubs som Ruin Station, Checkmate og Orbituary."),
        step("Start ved hub", "Find nærmeste station/gateway med refinery, cargo center, repair/refuel og clinic før du starter mining eller salvage."),
        step("Flyv konservativt", "Check demand og risiko før du fylder stort cargo. Hav altid backup destination og ekstra fuel margin.")
      ], [
        note("Risk", "Pyro er mere risikabelt end Stanton. Gem gode stationer, party-rules og exit-ruter når I spiller sammen."),
        note("Refineries", "UEX viser flere Pyro/gateway refineries, men yield/workload og terminalstatus skal live-checkes.")
      ]),
      mode("nyx", "Nyx", [], [
        step("Vælg Nyx", "Nyx er systemet med Levski på Delamar og gateway-stationer mod Stanton/Pyro."),
        step("Brug Levski", "Levski er hovedhub: commodity terminal, refinery, cargo center, shops, repair/refuel, Teach's Ship Shop og medical."),
        step("Planlæg retur", "Nyx er godt som hub og frontier-loop, men check route, demand og station services før store loads.")
      ], [
        note("Navn", "Det tredje system hedder Nyx."),
        note("Levski", "Levski har mange shops/services samlet, men patchstatus og terminaler bør live-checkes før dyre runs.")
      ])
    ],
    systemLocations: [
      systemLocation("UEX Trade Routes", "Live", "tool", ["sale", "cargo", "route", "demand"], ["cargo", "sale", "demand", "routes"], "Første stop for Taurus, C2 og Caterpillar cargo-ruter. Sortér efter demand og ikke kun margin.", LINKS.uexRoutes),
      systemLocation("UEX Mining Refineries", "Live", "tool", ["mining", "refinery", "processing"], ["refinery", "processing", "yield", "workload"], "Live oversigt over refineries, yields og workloads før Prospector/MOLE processing.", LINKS.uexMiningRefineries),
      systemLocation("UEX Mining Locations", "Live", "tool", ["mining", "roc", "prospector", "mole"], ["mining", "resources", "locations"], "Find rapporterede mining resources i Stanton, Pyro og Nyx. Brug før du vælger route.", LINKS.uexMiningLocations),
      systemLocation("UEX Mining Pricing", "Live", "tool", ["mining", "sale", "gems", "ore"], ["pricing", "gems", "ore", "refined"], "Priser for raw/refined ore og harvestables som Hadanite, Aphorite og Dolivine.", LINKS.uexMiningPricing),
      systemLocation("UEX RMC Demand", "Live", "sale", ["salvage", "rmc", "vulture", "sale"], ["RMC", "salvage", "demand"], "Check Recycled Material Composite demand før Vulture/Reclaimer salg.", LINKS.uexRmc),
      systemLocation("UEX CMAT Demand", "Live", "sale", ["salvage", "cmat", "construction", "sale"], ["CMAT", "construction materials", "demand"], "Check Construction Materials demand separat fra RMC.", LINKS.uexCmat),
      systemLocation("SC Trade Tools", "Live", "tool", ["cargo", "sale", "route"], ["cargo", "routes", "backup check"], "Brug som sekundær sanity-check mod UEX før dyre cargo-runs.", LINKS.scTradeTools),
      systemLocation("SC Trade Tools Shops", "Live", "shop", ["shop", "items", "components"], ["shops", "items", "components"], "Shop browser for stationer og butikker, især hvis du leder efter tools, ship parts eller armor.", LINKS.scTradeShops),
      systemLocation("UEX Items", "Live", "shop", ["shop", "components", "ship parts", "tools"], ["items", "components", "weapons", "tools"], "Søg efter mining modules, ship components, tools og våben hvis du skal opgradere eller købe udstyr.", LINKS.uexItems),

      systemLocation("Aaron Halo", "Stanton", "mining", ["stanton", "mining", "prospector", "mole", "asteroid"], ["ship mining", "asteroids", "scan loop"], "Klassisk ship-mining område. Brug UEX Mining Locations til aktuelle ressourcer og scan-density.", LINKS.uexMiningLocations, "Asteroid density og materialer kan ændre sig; scan før du committer et run."),
      systemLocation("Lagrange asteroid fields", "Stanton", "mining", ["stanton", "mining", "salvage", "asteroid", "l-point"], ["ship mining", "salvage scan", "near stations"], "ARC/HUR/CRU/MIC L-points er gode startområder, fordi stationer og refineries ofte er tættere på.", LINKS.uexMiningLocations),
      systemLocation("Daymar / Cellin / Yela", "Stanton", "mining", ["stanton", "roc", "ground mining", "gems", "mining"], ["ROC", "gems", "ground vehicle"], "Brug som ROC/gem startpunkter og check UEX for hvilke gems/materialer der er værd at jagte.", LINKS.uexMiningLocations),
      systemLocation("Aberdeen", "Stanton", "mining", ["stanton", "roc", "ground mining", "hadanite", "gems"], ["ROC", "Hadanite", "ground mining"], "Community-brugt ROC/gem område. Planlæg transport, heat/survival og salgssted før du kører langt.", LINKS.uexMiningLocations),
      systemLocation("ARC-L1 / ARC-L2 / ARC-L4", "Stanton", "refinery", ["stanton", "refinery", "mining", "shop", "processing"], ["refinery", "mining support", "processing"], "ArcCorp L-point refineries. Gode hvis du miner i ArcCorp-området eller Aaron Halo.", LINKS.uexMiningRefineries),
      systemLocation("HUR-L1 / HUR-L2", "Stanton", "refinery", ["stanton", "refinery", "mining", "shop", "processing"], ["refinery", "mining support", "processing"], "Hurston L-point refineries. Praktiske efter Hurston/Aberdeen-adjacent loops afhængigt af route.", LINKS.uexMiningRefineries),
      systemLocation("MIC-L1 / MIC-L2 / MIC-L5", "Stanton", "refinery", ["stanton", "refinery", "mining", "shop", "processing"], ["refinery", "mining support", "processing"], "MicroTech L-point refineries. Brug til MicroTech-side mining og check yield/workload live.", LINKS.uexMiningRefineries),
      systemLocation("CRU-L1", "Stanton", "refinery", ["stanton", "refinery", "mining", "processing"], ["refinery", "processing", "Crusader"], "Crusader-side refinery option. Check UEX for current yield og workload før processing.", LINKS.uexMiningRefineries),
      systemLocation("Nyx / Pyro / Terra Gateway stations", "Stanton", "refinery", ["stanton", "refinery", "cargo", "sale", "gateway"], ["refinery", "cargo center", "large ship support"], "Gateway locations i Stanton kan være gode, når cargo center og refinery workflows betyder mere end max pris.", LINKS.uexMiningRefineries),
      systemLocation("Area18 TDD / IO Tower", "Stanton", "sale", ["stanton", "sale", "cargo", "tdd", "arcCorp"], ["TDD", "cargo", "commodity sale"], "Første check for refined ore og legal commodities i ArcCorp-området.", LINKS.uexRoutes),
      systemLocation("Lorville CBD", "Stanton", "sale", ["stanton", "sale", "cargo", "cbd", "hurston"], ["CBD", "cargo", "commodity sale"], "Første check for industrial/bulk commodity sale omkring Hurston.", LINKS.uexRoutes),
      systemLocation("New Babbage TDD", "Stanton", "sale", ["stanton", "sale", "cargo", "tdd", "microTech"], ["TDD", "cargo", "commodity sale"], "Første check for MicroTech commodity sale og refined cargo.", LINKS.uexRoutes),
      systemLocation("Orison TDD", "Stanton", "sale", ["stanton", "sale", "cargo", "tdd", "crusader"], ["TDD", "cargo", "commodity sale"], "Crusader-side city sale option. Check demand før du flyver tung last dertil.", LINKS.uexRoutes),
      systemLocation("GrimHEX / station admin terminals", "Stanton", "sale", ["stanton", "sale", "salvage", "admin", "backup"], ["admin", "backup sale", "salvage"], "Backup-check for RMC/CMAT eller små cargo-partier, men verificér demand live.", LINKS.uexRoutes),
      systemLocation("Salvage panel scan loops", "Stanton", "salvage", ["stanton", "salvage", "vulture", "rmc", "panels"], ["RMC", "scan", "Vulture"], "Start ved asteroid belts/L-points og scan efter relevante signatures. Gå kun efter tætte targets.", LINKS.uexRmc, "Panel density er ikke garanteret; server og patch kan ændre oplevelsen."),
      systemLocation("Large salvage contracts", "Stanton", "salvage", ["stanton", "salvage", "contract", "vulture", "reclaimer"], ["contracts", "RMC", "CMAT"], "For Vulture: vælg targets efter størrelse, distance og cargo handling. Check RMC/CMAT demand før salg.", LINKS.uexRmc),
      systemLocation("Refinery shops / mining support", "Stanton", "shop", ["stanton", "shop", "mining", "modules", "refinery"], ["mining modules", "mining heads", "consumables"], "Søg efter mining heads, modules og consumables før Prospector/MOLE turen.", LINKS.uexItems),
      systemLocation("Dumper's Depot / Platinum Bay", "Stanton", "shop", ["stanton", "shop", "components", "tools", "ship parts"], ["ship parts", "tools", "weapons", "components"], "Brug UEX Items til at finde præcis butik for komponenter, multitool, salvage/mining gear og weapons.", LINKS.uexItems),

      systemLocation("Ruin Station", "Pyro", "station", ["pyro", "station", "refinery", "sale", "shop", "cargo", "repair"], ["habitation", "refinery", "cargo center", "clinic", "refuel", "repair"], "Pyro hub i Terminus med refinery, cargo center, clinic, repair/refuel og commodity/admin flow.", LINKS.uexRuinStation, "High-risk system: check route og landingsforhold før du flyver tung cargo."),
      systemLocation("Checkmate", "Pyro", "station", ["pyro", "station", "refinery", "sale", "shop", "cargo", "repair"], ["habitation", "refinery", "cargo center", "clinic", "refuel", "repair"], "Pyro hub i Monox. God kandidat som base for mining/salvage, hvis du accepterer risikoen.", LINKS.uexCheckmate),
      systemLocation("Orbituary", "Pyro", "station", ["pyro", "station", "refinery", "sale", "shop", "cargo", "repair"], ["habitation", "refinery", "cargo center", "clinic", "refuel", "repair"], "Pyro hub i Bloom med refinery og cargo center. Brug som stop mellem mining/salvage og salg.", LINKS.uexOrbituary),
      systemLocation("Nyx Gateway (Pyro)", "Pyro", "refinery", ["pyro", "station", "gateway", "refinery", "cargo", "sale"], ["refinery", "cargo center", "clinic", "refuel", "repair"], "Gateway-station i Pyro mod Nyx. Praktisk som transit/refinery/cargo stop.", LINKS.uexNyxGatewayPyro),
      systemLocation("Stanton Gateway (Pyro)", "Pyro", "refinery", ["pyro", "station", "gateway", "refinery", "cargo", "sale"], ["refinery", "cargo center", "transit"], "Gateway/refinery stop mod Stanton. Brug UEX Refineries til yield/workload før du processer.", LINKS.uexMiningRefineries),
      systemLocation("Pyro asteroid clusters / L-points", "Pyro", "mining", ["pyro", "mining", "asteroid", "l-point", "prospector", "mole"], ["ship mining", "asteroids", "scan loop"], "Brug UEX Mining Locations før turen; Pyro har mange rapporterede asteroid/mining areas, men risikoen er højere.", LINKS.uexMiningLocations, "Planlæg fuel, repair og exit før du fylder cargo."),
      systemLocation("Pyro surface mining areas", "Pyro", "mining", ["pyro", "mining", "roc", "ground mining", "gems"], ["ROC", "gems", "surface mining"], "Brug som ROC/ground-mining placeholder: vælg konkret moon/planet via UEX, og noter egne sikre spots efter scouting.", LINKS.uexMiningLocations),
      systemLocation("Pyro salvage contract loops", "Pyro", "salvage", ["pyro", "salvage", "vulture", "rmc", "cmat"], ["contracts", "RMC", "CMAT"], "Salvage kan betale sig, men check RMC/CMAT demand ved station/gateway før du flyver langt.", LINKS.uexRmc, "Pirate/player-risk kan gøre korte loops bedre end store holds."),
      systemLocation("Pyro admin / commodity markets", "Pyro", "sale", ["pyro", "sale", "cargo", "admin", "commodity"], ["admin", "commodity sale", "cargo"], "Ruin, Checkmate, Orbituary og gateways kan være relevante salgschecks. Brug UEX Routes for live demand.", LINKS.uexRoutes),
      systemLocation("Pyro Buy and Fly / item shops", "Pyro", "shop", ["pyro", "shop", "vehicles", "items", "components"], ["vehicles", "items", "components"], "Find lokale købssteder for ships, vehicles, ammo, tools og components via UEX/SC Trade Tools.", LINKS.scTradeShops),

      systemLocation("Levski", "Nyx", "station", ["nyx", "station", "levski", "refinery", "sale", "shop", "cargo"], ["commodity", "refinery", "cargo center", "shops", "clinic", "repair"], "Hovedhub på Delamar i Nyx med commodity shop, refinery, cargo center, shops, repair/refuel og medical.", LINKS.uexLevski),
      systemLocation("Refinement Center - Levski", "Nyx", "refinery", ["nyx", "levski", "refinery", "mining", "processing"], ["refinery", "ore processing", "mining support"], "Levski har refinement center/refinery flow. Brug UEX Refineries for yield/workload før du starter work order.", LINKS.uexMiningRefineries),
      systemLocation("Refinery Shop / Tools & Supplies - Levski", "Nyx", "shop", ["nyx", "levski", "shop", "mining", "tools", "components"], ["mining support", "tools", "supplies"], "Levski har flere shops tæt på refinery/cargo flow. Brug SC Trade Tools Shops eller UEX Items for præcis inventory.", LINKS.scTradeShops),
      systemLocation("Teach's Ship Shop - Levski", "Nyx", "shop", ["nyx", "levski", "shop", "vehicles", "ships"], ["ship sales", "vehicle sales", "components"], "Ship/vehicle køb i Levski. Brug Skibskøb-fanen og UEX Vehicles for aktuelle priser før du køber.", LINKS.uexVehiclesBuy),
      systemLocation("Stanton Gateway (Nyx)", "Nyx", "refinery", ["nyx", "station", "gateway", "refinery", "cargo", "sale"], ["refinery", "cargo center", "clinic", "refuel", "repair"], "Gateway-station i Nyx mod Stanton med refinery/cargo/support services.", LINKS.uexStantonGatewayNyx),
      systemLocation("Pyro Gateway (Nyx)", "Nyx", "refinery", ["nyx", "station", "gateway", "refinery", "cargo", "sale"], ["refinery", "cargo center", "clinic", "refuel", "repair"], "Gateway-station i Nyx mod Pyro med refinery/cargo/support services.", LINKS.uexPyroGatewayNyx),
      systemLocation("Delamar / Levski area", "Nyx", "mining", ["nyx", "delamar", "mining", "roc", "ground mining"], ["surface mining", "ROC", "local hub"], "Brug Levski som hub og UEX Mining Locations til at vælge konkrete resources rundt om Delamar/Nyx.", LINKS.uexMiningLocations),
      systemLocation("Glaciem Ring", "Nyx", "mining", ["nyx", "mining", "asteroid", "salvage", "glaciem"], ["asteroids", "ship mining", "salvage scan"], "Nyx belt/Glaciem Ring er oplagt at tracke som mining/salvage område. Check UEX før du planlægger run.", LINKS.wikiNyx, "Belt- og resource-data kan være patch-følsomt; bekræft i UEX/in-game."),
      systemLocation("Keeger Belt", "Nyx", "salvage", ["nyx", "salvage", "asteroid", "belt", "keeger"], ["salvage scan", "asteroids", "frontier"], "Nyx belt beta/Keeger Belt er med som frontier salvage/mining reference. Brug egne noter efter scouting.", LINKS.wikiNyx),
      systemLocation("Levski commodity / N.Q.A. checks", "Nyx", "sale", ["nyx", "levski", "sale", "commodity", "nqa", "cargo"], ["commodity sale", "cargo", "N.Q.A."], "Check Levski terminaler for cargo, salvage materials og grey/frontier goods før du flyver videre.", LINKS.uexLevski, "Commodity demand er live/patch-afhængig."),
      systemLocation("Levski shops and services", "Nyx", "shop", ["nyx", "levski", "shop", "items", "medical", "armor"], ["shops", "medical", "food", "items"], "Levski har mange services samlet i Grand Barter Bazaar og relaterede decks. Brug shop browser for præcis butik.", LINKS.wikiLevski)
    ]
  };

  window.SC_PURCHASE_REFERENCE = {
    id: "ship-market",
    type: "purchase-reference",
    name: "Skibskøb",
    manufacturer: "UEX / in-game shops",
    callsign: "MARKET · BUY",
    image: "assets/icons/module-purchase.svg",
    navIcon: "assets/icons/module-purchase.svg",
    status: "market",
    statusLabel: "Priser",
    category: "market",
    primaryRole: "In-game køb af skibe og køretøjer",
    tags: ["market", "ships", "vehicles", "prices", "buy"],
    summary: "Søgbar købsreference med in-game UEC-priser og forhandlere for skibene i guiden plus praktiske transport- og ground vehicles. Tjek UEX-linket før du flyver langt efter et køb.",
    stats: [stat("Datakilde", "UEX 4.8.3"), stat("Items", "22 køb"), stat("Scope", "Guide + transport")],
    quickActions: [
      quick("Søg ship", "Search", "Skriv Taurus, C2, Vulture, ROC, Ursa eller rolle."),
      quick("Billigste check", "Pris", "Kortene viser laveste/praktiske steder først."),
      quick("Ground vehicles", "Ground", "Filter på ground for ROC, Ursa, Cyclone, Mule, STV og ATLS."),
      quick("Cargo transport", "Cargo", "Filter på cargo for Taurus, C2, Cutlass, Caterpillar og support vehicles."),
      quick("Live UEX", "UEX", "Åbn live-listen hvis du vil verificere patch, seller og pris."),
      quick("Plan route", "Map", "Vælg seller efter hvor du allerede er, ikke kun laveste pris.")
    ],
    saleInfo: saleInfo("Live vehicle price check", "UEX-priser er community-maintained og kan ændre sig efter patch eller shop refresh. Brug listen som cockpit-hurtigreference, men verificér live før store køb.", [
      saleLocation("UEX Vehicles To Buy", "Aktuel liste over in-game ship/vehicle sellers, UEC-priser og opdateringsalder.", "", LINKS.uexVehiclesBuy),
      saleLocation("New Deal - Teasa Spaceport - Lorville", "Stærkt all-round sted til mange skibe og ground vehicles."),
      saleLocation("Astro Armada - Area18", "Godt sted til mange Anvil/Origin/specialty ships og små køretøjer."),
      saleLocation("Crusader Showroom - Orison", "Primært sted for Crusader ships som C2 Hercules."),
      saleLocation("Teach's Ship Shop - Levski / Pyro Buy and Fly", "Remote/Pyro alternativer; check risiko og distance før du flyver dertil.")
    ]),
    modes: [
      mode("buy-route", "Købsflow", [], [
        step("Søg først", "Find skibet eller køretøjet i listen og check om der er flere sellers med forskellige priser."),
        step("Vælg seller", "Brug billigste seller hvis du er tæt på. Brug nærmeste seller hvis tidsforbruget er vigtigere end rabatten."),
        step("Verificér live", "Klik UEX før store køb. Shop inventory og priser kan ændre sig mellem patches."),
        step("Klargør hjemtur", "Planlæg hvordan du får det nye køretøj hjem, især ground vehicles der skal transporteres i C2/Cutlass/Taurus.")
      ], [
        note("Scope", "Første version dækker dine guide-skibe plus praktiske transport- og ground vehicles. Hele UEX-listen er linket for alt andet."),
        note("Priser", "Priserne er UEC-priser fra UEX Star Citizen 4.8.3 og er ikke pledge-store dollars.")
      ]),
      mode("transport", "Transport buys", [], [
        step("Billig utility", "Mule, STV, ATLS, CSV-SM og PTV er billige utility-køb til events, cargo og hangararbejde."),
        step("Ground ops", "ROC, Ursa, Cyclone og Dragonfly kræver et transportskib hvis du vil bruge dem effektivt på moons/planets."),
        step("Ship transport", "C2 er hovedtransporten til ROC/Ursa. Cutlass/Taurus kan bruges til mindre transport afhængigt af størrelse og ramp.")
      ], [
        note("Route discipline", "Hvis et køretøj er billigt men sælges langt væk, kan turen koste mere tid end rabatten er værd.")
      ])
    ],
    purchaseItems: [
      purchaseItem("C2 Hercules Starlifter", "Crusader", "Heavy cargo og vehicle transport", "cargo", ["owned", "large ship", "transport", "cargo", "vehicle transport"], "696 SCU", [
        purchaseSeller("New Deal - Crusader Showroom - Orison", "18,900,000 UEC", "Stanton", "25d"),
        purchaseSeller("Astro Armada - Area18", "18,900,000 UEC", "Stanton", "26d")
      ], "Største praktiske transport i guiden til ROC/Ursa og bulk cargo."),
      purchaseItem("Drake Caterpillar", "Drake", "Large cargo appendix", "cargo", ["appendix", "large ship", "cargo"], "576 SCU", [
        purchaseSeller("New Deal - Teasa Spaceport - Lorville", "11,850,300 UEC", "Stanton", "26d")
      ], "Appendix-skib i guiden; cargo-alternativ til C2."),
      purchaseItem("ARGO MOLE", "Argo", "Crew mining", "industry", ["owned", "mining", "industrial", "crew"], "32 SCU", [
        purchaseSeller("New Deal - Teasa Spaceport - Lorville", "8,483,738 UEC", "Stanton", "26d"),
        purchaseSeller("Teach's Ship Shop - Levski", "9,376,763 UEC", "Nyx", "15d")
      ], "Crew mining-skib. Lorville er billigst i den aktuelle UEX-liste."),
      purchaseItem("Constellation Taurus", "RSI", "Freight, daily driver og tractor support", "cargo", ["owned", "cargo", "multirole", "tractor"], "174 SCU", [
        purchaseSeller("New Deal - Teasa Spaceport - Lorville", "7,641,648 UEC", "Stanton", "26d"),
        purchaseSeller("Teach's Ship Shop - Levski", "7,641,648 UEC", "Nyx", "15d")
      ], "God mellemstor cargo/daily-driver før C2 giver mening."),
      purchaseItem("Scorpius", "RSI", "Heavy fighter", "combat", ["owned", "combat", "fighter", "turret"], "", [
        purchaseSeller("New Deal - Teasa Spaceport - Lorville", "5,171,040 UEC", "Stanton", "26d")
      ], "Combat-køb; kræver ikke cargo-route planlægning, men check claim/risk før event."),
      purchaseItem("Prospector", "MISC", "Solo mining", "industry", ["owned", "mining", "industrial", "solo"], "", [
        purchaseSeller("New Deal - Teasa Spaceport - Lorville", "2,783,025 UEC", "Stanton", "26d"),
        purchaseSeller("Buy and Fly - Ruin Station", "2,929,500 UEC", "Pyro", "16d"),
        purchaseSeller("Buy and Fly - Checkmate", "2,929,500 UEC", "Pyro", "17d"),
        purchaseSeller("Buy and Fly - Orbituary", "2,929,500 UEC", "Pyro", "1mo")
      ], "Solo mining entry. Lorville er billigst i den aktuelle liste."),
      purchaseItem("Vulture", "Drake", "Solo salvage", "industry", ["owned", "salvage", "industrial", "solo"], "12 SCU", [
        purchaseSeller("New Deal - Teasa Spaceport - Lorville", "2,513,700 UEC", "Stanton", "26d"),
        purchaseSeller("Buy and Fly - Ruin Station", "2,646,000 UEC", "Pyro", "16d"),
        purchaseSeller("Buy and Fly - Checkmate", "2,646,000 UEC", "Pyro", "17d"),
        purchaseSeller("Buy and Fly - Orbituary", "2,646,000 UEC", "Pyro", "1mo"),
        purchaseSeller("Teach's Ship Shop - Levski", "2,778,300 UEC", "Nyx", "15d")
      ], "Solo salvage money-maker. Køb helst tæt på dit salvage-loop."),
      purchaseItem("Cutlass Black", "Drake", "Multirole cargo og light transport", "cargo", ["owned", "multirole", "cargo", "transport"], "46 SCU", [
        purchaseSeller("New Deal - Teasa Spaceport - Lorville", "2,010,960 UEC", "Stanton", "26d")
      ], "Praktisk transport/daily driver før større cargo ships."),
      purchaseItem("C8 Pisces", "Anvil", "Small shuttle", "support", ["shuttle", "transport", "small ship"], "4 SCU", [
        purchaseSeller("Astro Armada - Area18", "745,290 UEC", "Stanton", "26d")
      ], "Billig shuttle hvis du bare skal rundt og lande let."),
      purchaseItem("C8R Pisces Rescue", "Anvil", "Small medical rescue", "support", ["owned", "medical", "rescue", "shuttle"], "", [
        purchaseSeller("Astro Armada - Area18", "555,660 UEC", "Stanton", "26d")
      ], "Medical shuttle i guiden."),
      purchaseItem("C8X Pisces Expedition", "Anvil", "Small expedition shuttle", "support", ["shuttle", "transport", "small ship"], "4 SCU", [
        purchaseSeller("Astro Armada - Area18", "515,970 UEC", "Stanton", "26d")
      ], "Billig lille transport hvis C8R ikke er nødvendigt."),
      purchaseItem("Ursa Medivac", "RSI", "Ground medical support", "ground", ["owned", "ground vehicle", "medical", "transport"], "", [
        purchaseSeller("New Deal - Teasa Spaceport - Lorville", "118,503 UEC", "Stanton", "26d"),
        purchaseSeller("Teach's Ship Shop - Levski", "118,503 UEC", "Nyx", "15d")
      ], "Ground medical vehicle til C2-baserede bunker/event loops."),
      purchaseItem("Ursa", "RSI", "Ground rover", "ground", ["ground vehicle", "transport", "rover"], "", [
        purchaseSeller("New Deal - Teasa Spaceport - Lorville", "107,730 UEC", "Stanton", "26d")
      ], "Billigere rover hvis du ikke har brug for medbed."),
      purchaseItem("Lynx", "RSI", "Luxury rover", "ground", ["ground vehicle", "transport", "rover"], "", [
        purchaseSeller("New Deal - Teasa Spaceport - Lorville", "129,276 UEC", "Stanton", "26d")
      ], "Komfort-rover; ikke nødvendig, men relevant transportliste."),
      purchaseItem("ROC", "Greycat", "Ground mining", "ground", ["owned", "ground vehicle", "mining", "transport"], "", [
        purchaseSeller("New Deal - Teasa Spaceport - Lorville", "98,753 UEC", "Stanton", "26d"),
        purchaseSeller("Teach's Ship Shop - Levski", "103,950 UEC", "Nyx", "15d")
      ], "Ground mining-køretøj til C2/Cutlass/Taurus transport."),
      purchaseItem("Cyclone", "Tumbril", "Fast ground transport", "ground", ["ground vehicle", "transport", "fast"], "1 SCU", [
        purchaseSeller("New Deal - Teasa Spaceport - Lorville", "98,753 UEC", "Stanton", "26d"),
        purchaseSeller("Buy and Fly - Ruin Station", "103,950 UEC", "Pyro", "16d"),
        purchaseSeller("Buy and Fly - Checkmate", "103,950 UEC", "Pyro", "17d"),
        purchaseSeller("Buy and Fly - Orbituary", "103,950 UEC", "Pyro", "1mo")
      ], "Hurtigt ground vehicle til event/planet ops."),
      purchaseItem("Dragonfly Black", "Drake", "Hoverbike transport", "ground", ["ground vehicle", "hoverbike", "transport"], "", [
        purchaseSeller("New Deal - Teasa Spaceport - Lorville", "325,584 UEC", "Stanton", "26d"),
        purchaseSeller("Buy and Fly - Ruin Station", "342,720 UEC", "Pyro", "16d"),
        purchaseSeller("Buy and Fly - Checkmate", "342,720 UEC", "Pyro", "17d"),
        purchaseSeller("Buy and Fly - Orbituary", "342,720 UEC", "Pyro", "1mo")
      ], "Lille hoverbike til hurtig transport og bunker/event runs."),
      purchaseItem("CSV-SM", "Argo", "Small cargo ground utility", "ground", ["ground vehicle", "cargo", "utility", "transport"], "4 SCU", [
        purchaseSeller("New Deal - Teasa Spaceport - Lorville", "359,100 UEC", "Stanton", "26d"),
        purchaseSeller("New Deal - Crusader Showroom - Orison", "378,000 UEC", "Stanton", "25d"),
        purchaseSeller("Astro Armada - Area18", "378,000 UEC", "Stanton", "26d"),
        purchaseSeller("Buy and Fly - Ruin Station", "378,000 UEC", "Pyro", "16d")
      ], "Ground cargo/utility option til transport og små loads."),
      purchaseItem("ATLS", "Argo", "Cargo handling exosuit", "ground", ["cargo", "tractor", "utility", "transport"], "", [
        purchaseSeller("New Deal - Teasa Spaceport - Lorville", "71,820 UEC", "Stanton", "26d"),
        purchaseSeller("Teach's Ship Shop - Levski", "75,600 UEC", "Nyx", "15d"),
        purchaseSeller("New Deal - Crusader Showroom - Orison", "75,600 UEC", "Stanton", "25d"),
        purchaseSeller("Astro Armada - Area18", "75,600 UEC", "Stanton", "26d")
      ], "Billig cargo-håndtering, ikke et transportskib, men nyttigt til hauling."),
      purchaseItem("Mule", "Drake", "Small cargo utility vehicle", "ground", ["ground vehicle", "cargo", "utility", "transport"], "2 SCU", [
        purchaseSeller("New Deal - Teasa Spaceport - Lorville", "64,638 UEC", "Stanton", "26d"),
        purchaseSeller("Teach's Ship Shop - Levski", "68,040 UEC", "Nyx", "15d")
      ], "Meget billig cargo/utility vehicle til hangar og outpost-arbejde."),
      purchaseItem("STV", "Greycat", "Small ground transport", "ground", ["ground vehicle", "transport", "cheap"], "", [
        purchaseSeller("Astro Armada - Area18", "75,600 UEC", "Stanton", "26d"),
        purchaseSeller("Buy and Fly - Ruin Station", "75,600 UEC", "Pyro", "16d"),
        purchaseSeller("Buy and Fly - Checkmate", "75,600 UEC", "Pyro", "17d"),
        purchaseSeller("Buy and Fly - Orbituary", "75,600 UEC", "Pyro", "1mo")
      ], "Billig persontransport til ground ops."),
      purchaseItem("PTV", "Greycat", "Tiny runabout", "ground", ["ground vehicle", "cheap", "transport"], "", [
        purchaseSeller("Teach's Ship Shop - Levski", "28,350 UEC", "Nyx", "15d"),
        purchaseSeller("Astro Armada - Area18", "28,350 UEC", "Stanton", "26d")
      ], "Billigste lille transport i listen.")
    ]
  };

  window.SC_SHIP_GUIDE_REFERENCE = {
    id: "ship-guides",
    type: "ship-guide-reference",
    name: "Skibsguides",
    manufacturer: "Owned ships",
    callsign: "GUIDES · KEYS",
    image: "assets/icons/module-ship-guides.svg",
    navIcon: "assets/icons/module-ship-guides.svg",
    status: "guide",
    statusLabel: "Keys",
    category: "guides",
    primaryRole: "Individuelle ship keys, quick mode og funktion",
    tags: ["guides", "ships", "keys", "quick mode", "functions"],
    summary: "Samlet indgang til alle skibsspecifikke guides. Vælg et skib herfra for at se quick mode, flow, individuelle keybindings, funktioner og drift-noter uden at venstremenuen vokser for hvert nyt skib.",
    stats: [stat("Skibe", "Mine + appendix"), stat("Layout", "Underfaner"), stat("Formål", "Kort cockpit-reference")],
    quickActions: [
      quick("Vælg skib", "Klik kort", "Åbn et skib fra underfanerne i Skibsguides."),
      quick("Søg ship", "Search", "Skriv Prospector, Vulture, C2, ROC eller rolle."),
      quick("Brug quick mode", "Top", "Se 5-8 vigtigste actions øverst på den valgte ship-side."),
      quick("Find keys", "Taster", "Skibsspecifikke keys ligger på ship-siden; fælles keys ligger i Standard keys."),
      quick("Loadout separat", "Loadouts", "Komponenter og våben ligger i sin egen hovedfane."),
      quick("Udvid senere", "+", "Nye skibe kan tilføjes uden at fylde venstremenuen.")
    ],
    saleInfo: saleInfo("Guide struktur", "Skibsguides samler kun de individuelle ship guides. Standard keys, Loadouts, Skibskøb og Solsystemer bliver egne hovedfaner, så appen kan vokse uden at blive rodet.", [
      saleLocation("Standard keys", "Fælles flight, landing, quantum, power, combat, FPS og ground vehicle defaults."),
      saleLocation("Skibsguides", "Skibsspecifik quick mode, funktion, flow, taster og driftsnoter."),
      saleLocation("Loadouts", "Komponenter, våben, mining heads og buyable upgrades."),
      saleLocation("Skibskøb", "In-game priser, ship sellers og transport vehicles."),
      saleLocation("Solsystemer", "Mining spots, refineries, stations, shops og salgssteder.")
    ]),
    modes: [
      mode("structure", "Struktur", [], [
        step("Hovedfaner først", "Brug venstremenuen til de store områder: Solsystemer, Skibsguides, Loadouts, Skibskøb og Standard keys."),
        step("Skibe som underfaner", "Klik Skibsguides og vælg derefter det konkrete skib i kortlisten."),
        step("Hold hver side kort", "Fælles keys gentages ikke under hvert skib. Ship-siderne viser kun det, der er relevant for rollen."),
        step("Udvid uden støj", "Når du køber eller tilføjer flere skibe, lægges de i Skibsguides i stedet for som nye hovedfaner.")
      ], [
        note("Navigation", "Hvis et skib er valgt, markeres Skibsguides stadig i venstremenuen, så du kan komme tilbage til ship-listen."),
        note("Data", "De enkelte ship guides ligger stadig i `window.SC_SHIPS`; denne fane er kun den samlede indgang.")
      ]),
      mode("workflow", "Brug", [], [
        step("Klik Skibsguides", "Start her når du skal flyve et bestemt skib."),
        step("Filtrér eller søg", "Brug filter for cargo, industri, combat, support, ground eller appendix."),
        step("Åbn ship", "Klik kortet for at åbne ship-sidens quick mode, flow, taster og noter."),
        step("Hop til specialområder", "Brug Loadouts til komponenter, Skibskøb til priser og Solsystemer til steder.")
      ], [
        note("Second-screen flow", "På en anden skærm er det hurtigere at vælge område først og derefter skib end at have alt i én lang sidebar.")
      ])
    ]
  };

  window.SC_LOADOUT_REFERENCE = {
    id: "loadouts",
    type: "loadout-reference",
    name: "Loadouts",
    manufacturer: "UEX / Erkul",
    callsign: "LOADOUT · BUY",
    image: "assets/icons/module-loadouts.svg",
    navIcon: "assets/icons/module-loadouts.svg",
    status: "loadout",
    statusLabel: "Builds",
    category: "loadout",
    primaryRole: "Bedste købbare komponenter og våben pr. skib",
    tags: ["loadout", "components", "weapons", "quantum", "uex", "erkul"],
    summary: "Købbare aUEC-loadouts for dine skibe. Fokus er praktisk stærk performance uden loot/craft-only krav. Klik delene for UEX live-pris og butik før du køber.",
    stats: [stat("Datakilde", "UEX 4.8.3"), stat("Scope", "Dine skibe"), stat("Regel", "Direkte køb")],
    quickActions: [
      quick("Søg ship", "Search", "Skriv Taurus, Scorpius, Prospector, Vulture, ROC eller komponentnavn."),
      quick("Quantum først", "QD", "Opgrader quantum drive først på ships du flyver ofte."),
      quick("Combat check", "Erkul", "Byg våben i Erkul før du køber mange dyre guns."),
      quick("Shop check", "UEX", "Klik UEX-link og vælg nærmeste butik i stedet for blindt at flyve langt."),
      quick("Loot-only", "Advarsel", "Hvis bedre dele ikke kan købes direkte, står det som warning."),
      quick("Efter patch", "Live", "Verificér altid efter større Star Citizen patches.")
    ],
    saleInfo: saleInfo("Loadout live links", "UEX viser aktuelle butikker, pris og om en del kan købes, rent'es eller craftes. Erkul bruges til at bekræfte hardpoints, power draw, capacitor og missile/weapon mix.", [
      saleLocation("UEX Items Finder", "Søg komponent, våben, mining head, salvage gear og butikslokation.", "", LINKS.uexItems),
      saleLocation("Erkul Loadout Calculator", "Byg skibet før køb og check slot-size, våben, ammo, capacitor og power.", "", LINKS.erkul),
      saleLocation("Quantum drives", "Atlas/Hemera/Agni er primære køb i denne guide; XL-1, TS-2 og VK-00 er ikke sat som hovedkøb.", "", LINKS.uexItems),
      saleLocation("Dumper's Depot / Platinum Bay", "Typiske butikker for shields, power plants, coolers og quantum drives. Klik UEX-delen for præcis lokation."),
      saleLocation("CenterMass / Cousin Crow's / Omega Pro", "Typiske steder for ship weapons og high-end komponenter afhængigt af varen. Verificér live før route.")
    ]),
    modes: [
      mode("rules", "Loadout regler", [], [
        step("Direkte køb først", "Hovedanbefalingen er en del, der kan købes for in-game money. Loot-, rent- eller craft-only dele nævnes kun som warning."),
        step("Quantum prioriteres", "Quantum drive giver mest daglig værdi på cargo, mining, salvage og support ships."),
        step("Defensiv industri", "Mining, salvage og cargo får shields/reliability før dyr våben-meta."),
        step("Combat bygges i Erkul", "For Scorpius og bevæbnede cargo ships skal våbenmix bekræftes i Erkul, fordi capacitor, ammo og hardpoints ændrer sig mellem patches.")
      ], [
        note("Patchrisiko", "UEX og Erkul er live værktøjer. Brug denne side som shortlist, ikke som garanti for at hver butik stadig har varen."),
        note("Best of buyable", "Nogle kendte topdele som XL-1, TS-2, FR-76, VK-00 og JS-400 er ikke hovedanbefalet, fordi de ikke fremstår som direkte butikskøb i UEX-dataene.")
      ]),
      mode("shopping", "Købsflow", [], [
        step("Vælg skib i listen", "Find ship-kortet og køb kun de dele, du faktisk skal bruge til den næste rolle."),
        step("Åbn UEX på delen", "Klik komponenten og vælg nærmeste seller. Priser og butikslager kan ændre sig."),
        step("Verificér i Erkul", "Læg delene ind i Erkul før masseindkøb, især weapons på Taurus, Cutlass, C2 og Scorpius."),
        step("Gem notes", "Hvis en shop mangler varen i spillet, notér alternativ seller i guiden næste gang.")
      ], [
        note("Operational rule", "Køb ikke alt på én tur hvis det kræver flere systemer. Start med quantum/shield og test skibet før dyre våbenpakker.")
      ])
    ],
    loadoutShips: [
      loadoutShip("loadout-taurus", "Constellation Taurus", "Medium cargo / daily driver", "cargo", ["owned", "cargo", "multirole", "s2 quantum", "s3 shield"], "Praktisk daily/cargo build: hurtig S2 quantum, stærk S3 shield og laser cannons hvis du vil kunne rydde NPCs uden ammo-logistik.", [
        loadoutPart("Quantum drive · S2", "Hemera", "Cousin Crow's / Platinum Bay CRU-L1 og CRU-L5 · ca. 168,000 UEC", "Bedste direkte købbare S2 quantum shortlist til hurtig travel. Crossfield er billigere, men Hemera er stærkere daglig upgrade.", LINKS.uexHemera, "XL-1 er kendt topvalg på papiret, men UEX viser den ikke som direkte buy."),
        loadoutPart("Shield · S3", "Parapet", "GrimHEX eller Omega Pro · ca. 792,000 UEC", "Taurus skal overleve cargo-runs og NPC-interdictions. S3 Industrial Grade A er den robuste buyable shield-retning.", LINKS.uexParapet),
        loadoutPart("Power / cooling", "Lotus S2 power + IceBox/S2 cooler check", "Cousin Crow's, Platinum Bay og Dumper's Depot via UEX", "Opgrader kun hvis våben/loadout presser power eller heat. Quantum og shield giver mere mærkbar værdi først.", LINKS.uexLotus, "JS-400 er ikke sat som buyable hovedvalg."),
        loadoutPart("Pilot weapons", "4x S5 laser cannons, fx M7A-klassen", "CenterMass / Cousin Crow's / UEX Items", "Laser cannons er stærke til PvE og kræver ingen ammo logistics. Byg præcist i Erkul før køb.", LINKS.erkul),
        loadoutPart("Turret / missiles", "Behold stock eller match laser repeaters", "Erkul + UEX Items", "Taurus er ikke primært combat ship; brug penge på QD/shield før turrets og missiles.", LINKS.erkul)
      ], [
        "Cargo first: Hvis du kun køber én ting, køb Hemera.",
        "Undgå ballistic hovedbuild på Taurus hvis du vil have nem second-screen cargo drift."
      ]),
      loadoutShip("loadout-c2", "C2 Hercules", "Heavy cargo / vehicle transport", "cargo", ["owned", "cargo", "large ship", "s3 quantum", "vehicle transport"], "C2 skal flytte meget kapital. Buildet prioriterer S3 quantum, store shields og defensive laser weapons uden at gøre den til et kamp-skib.", [
        loadoutPart("Quantum drive · S3", "Agni", "Everus Harbor eller Omega Pro · ca. 430,920 UEC", "Direkte købbart hurtigt S3 quantum drive. Giver mest værdi på lange C2 cargo/vehicle routes.", LINKS.uexAgni, "TS-2 er stærk men UEX viser ikke direkte buy."),
        loadoutPart("Shield · S3", "Parapet", "GrimHEX eller Omega Pro · ca. 792,000 UEC", "Robust buyable S3 shield til dyr cargo og store landinger.", LINKS.uexParapet),
        loadoutPart("Power / cooling", "Durango S3 power + Chill-Max/IceBox cooler check", "Dumper's Depot Area18 / Omega Pro / UEX", "Reliability før DPS. Opgrader hvis Erkul viser power/heat problemer med dine weapons.", LINKS.uexDurango),
        loadoutPart("Pilot weapons", "S5 laser cannons, fx M7A-klassen", "CenterMass / UEX Items", "Brug kun defensive PvE weapons. C2 skal undgå fights og sælge cargo, ikke jage targets.", LINKS.erkul),
        loadoutPart("Operational fit", "QT fuel/range route check", "UEX Trade Routes + Erkul", "Test om Agni-ruten passer til dine normale cargo-routes; hurtigst er ikke altid mest fuel-effektivt.", LINKS.uexRoutes)
      ], [
        "C2 er kapitalrisiko. Check destination demand før du investerer i cargo og loadout samme aften."
      ]),
      loadoutShip("loadout-cutlass", "Cutlass Black", "Multirole transport / light combat", "cargo", ["owned", "multirole", "transport", "s2 quantum", "combat"], "Cutlass er bedst som billig utility: hurtig S2 quantum, buyable S2 shield og simple S3 laser weapons for NPC-defense.", [
        loadoutPart("Quantum drive · S2", "Hemera", "Cousin Crow's / Platinum Bay CRU-L1 og CRU-L5 · ca. 168,000 UEC", "Gør Cutlass mærkbart bedre som daily transport og ROC shuttle.", LINKS.uexHemera, "XL-1 er ikke direkte buy i UEX."),
        loadoutPart("Shield · S2", "Rampart", "Omega Pro New Babbage, CRU-L4, HUR-L2/HUR-L5 og gateways · ca. 396,000 UEC", "Direkte købbart S2 Industrial Grade A shield til multirole overlevelse.", LINKS.uexRampart, "FR-76 står ikke som direkte buy."),
        loadoutPart("Power / cooling", "Lotus S2 power + IceBox cooler check", "Cousin Crow's / Platinum Bay / Dumper's Depot via UEX", "Stock kan være nok. Opgrader efter Erkul hvis du skifter alle weapons.", LINKS.uexLotus),
        loadoutPart("Pilot weapons", "4x S3 laser repeaters/cannons, fx Panther/M-series", "CenterMass / Cousin Crow's / UEX Items", "Match alle hardpoints samme våbentype for nem aim og capacitor management.", LINKS.erkul),
        loadoutPart("Turret", "2x S3 match pilot weapons", "Erkul + UEX Items", "Hvis du ofte har gunner, køb matchende S3 weapons til turret. Solo: prioriter QD/shield først.", LINKS.erkul)
      ], [
        "Best value: Hemera + Rampart før våbenpakke.",
        "Cutlass kan transportere ROC, men test ramp/landing før lange gem-runs."
      ]),
      loadoutShip("loadout-scorpius", "Scorpius", "Heavy fighter", "combat", ["owned", "combat", "fighter", "s1 quantum", "turret"], "Scorpius skal bygges som ren combat: ens S3 weapons på pilot og turret, S1 buyable shield og QD efter om du vil have range eller hurtig claim-to-fight travel.", [
        loadoutPart("Quantum drive · S1", "Atlas", "Platinum Bay HUR-L5 · ca. 84,000 UEC", "God daily/range S1 quantum til fighter travel uden at gøre fuel-planlægning irriterende.", LINKS.uexAtlas, "VK-00 er ikke sat som hovedvalg, fordi UEX ikke viser direkte buy."),
        loadoutPart("Shield · S1", "Palisade", "Omega Pro New Babbage / CRU-L4 og gateway shops · ca. 198,000 UEC", "Direkte købbart S1 Grade A shield. Fighter-meta kan ændre sig, så check Erkul før full combat spend.", LINKS.uexPalisade),
        loadoutPart("Power / cooling", "Breton S1 power + Ultra-Flow cooler", "Cousin Crow's / Platinum Bay / UEX", "Buyable reliability upgrade. JS-300/JS-400-familien skal live-checkes, da flere topdele ikke er direkte buy.", LINKS.uexBreton),
        loadoutPart("Pilot weapons", "4x S3 laser repeaters/cannons", "CenterMass / Cousin Crow's / UEX Items", "Brug samme projectile speed på alle pilot guns. Laser er nemmest til PvE; ballistic er kun hvis du accepterer ammo.", LINKS.erkul),
        loadoutPart("Turret weapons", "4x S3 match pilot weapons", "CenterMass / Erkul / UEX Items", "Scorpius får sin værdi med gunner. Match turret og pilot våben for samme lead/aim feel.", LINKS.erkul)
      ], [
        "Hvis du flyver solo ofte, er Scorpius stadig stærk, men full turret weapon spend giver først maksimal værdi med gunner.",
        "For PvP skal våbenvalg live-checkes i Erkul efter patch."
      ]),
      loadoutShip("loadout-prospector", "Prospector", "Solo mining", "industry", ["owned", "mining", "solo", "s1 quantum"], "Prospector-loadout skal gøre mining-ruten kortere og klippen mere kontrollerbar. Quantum og mining head/modules betyder mere end ship weapons.", [
        loadoutPart("Quantum drive · S1", "Atlas", "Platinum Bay HUR-L5 · ca. 84,000 UEC", "Stærk daily mining QD med god praktisk range. Burst er et billigere/faster-check alternativ, men Atlas er tryggere til mining loops.", LINKS.uexAtlas),
        loadoutPart("Shield · S1", "Palisade", "Omega Pro New Babbage / CRU-L4 og gateway shops · ca. 198,000 UEC", "Buyable defensiv upgrade til solo mining, hvor du helst bare vil væk med cargo.", LINKS.uexPalisade),
        loadoutPart("Mining head", "Helix/Hofstede/Lancet S1 efter materiale", "Refinery shops, mining support shops og UEX Items", "Køb mining head efter hvilke ores du faktisk jagter. Brug Erkul/UEX til resistance, instability og power.", LINKS.uexMiningHeads),
        loadoutPart("Mining modules", "Passive resistance/instability modules + consumables", "Refinery shops / UEX Items", "Modules slår våbenopgraderinger for Prospector. Hav consumables klar før du flyver til belt/moon.", LINKS.uexMiningHeads),
        loadoutPart("Weapons", "Behold stock", "Ingen nødvendig spend", "Prospector skal undgå kamp. Brug pengene på mining head, modules og QD.", LINKS.erkul)
      ], [
        "Start med Atlas og mining head; resten kan vente.",
        "Tjek UEX Mining Locations og Refineries før du fylder saddlebags."
      ]),
      loadoutShip("loadout-mole", "ARGO MOLE", "Crew mining", "industry", ["owned", "mining", "crew", "s2 quantum"], "MOLE-buildet handler om crew mining-effektivitet: S2 quantum til route, robuste shields og specialiserede mining heads pr. operator.", [
        loadoutPart("Quantum drive · S2", "Hemera", "Cousin Crow's / Platinum Bay CRU-L1 og CRU-L5 · ca. 168,000 UEC", "S2 buyable speed upgrade til store mining loops mellem belt, refinery og sale.", LINKS.uexHemera),
        loadoutPart("Shield · S2", "Rampart", "Omega Pro New Babbage, CRU-L4, HUR-L2/HUR-L5 og gateways · ca. 396,000 UEC", "MOLE er et stort mining target. Buyable S2 Grade A shield er bedre værdi end våben.", LINKS.uexRampart, "FR-76 er ikke sat som direct-buy hovedvalg."),
        loadoutPart("Power / cooling", "Lotus S2 power + IceBox cooler check", "Cousin Crow's / Platinum Bay / UEX", "Opgrader hvis tre heads/modules giver power/heat issues. Ellers prioriter mining gear.", LINKS.uexLotus),
        loadoutPart("Mining heads", "Mix af control/power heads pr. turret", "Refinery shops, mining support shops og UEX Items", "Kør ikke tre ens heads blindt. Én operator kan fokusere power, en anden stability/control afhængigt af rocks.", LINKS.uexMiningHeads),
        loadoutPart("Weapons", "Behold stock / defensive only", "Ingen stor spend", "MOLE skal bruge escort eller undgå kamp. Våben er ikke bedste investering.", LINKS.erkul)
      ], [
        "Crew-kommunikation og mining modules giver mere end dyre combat upgrades.",
        "Køb consumables i bulk før turen."
      ]),
      loadoutShip("loadout-vulture", "Vulture", "Solo salvage", "industry", ["owned", "salvage", "solo", "s1 quantum"], "Vulture skal være hurtig ud til panels/contracts og sikker hjem med RMC/CMAT. Structural salvage tools er vigtigere end combat weapons.", [
        loadoutPart("Quantum drive · S1", "Atlas", "Platinum Bay HUR-L5 · ca. 84,000 UEC", "God range og daglig drift til salvage loops. Brug Burst hvis du vil teste billigere/faster S1 travel.", LINKS.uexAtlas),
        loadoutPart("Shield · S1", "Palisade", "Omega Pro New Babbage / CRU-L4 og gateway shops · ca. 198,000 UEC", "Buyable shield upgrade til solo salvage, især når du har værdifuld RMC/CMAT onboard.", LINKS.uexPalisade),
        loadoutPart("Power / cooling", "Breton S1 power + Ultra-Flow cooler", "Cousin Crow's / Platinum Bay / UEX", "Nice-to-have efter QD/shield. Stock er ofte acceptabelt til salvage.", LINKS.uexBreton),
        loadoutPart("Salvage heads", "Behold Abrade/Trawler style setup og justér efter patch", "UEX Items / Erkul", "Salvage head tuning ændrer sig. Tjek UEX/Erkul hvis du skifter fra hull scraping til structural salvage fokus.", LINKS.erkul),
        loadoutPart("Weapons", "Behold stock", "Ingen nødvendig spend", "Vulture skal væk fra kamp. Brug pengene på QD, shield og route discipline.", LINKS.erkul)
      ], [
        "Structural salvage keys ligger på Vulture-siden; loadoutet her fokuserer på køb.",
        "Check RMC/CMAT demand før du fylder holdet."
      ]),
      loadoutShip("loadout-c8r", "C8R Pisces Rescue", "Medical shuttle", "support", ["owned", "medical", "rescue", "s1 quantum"], "C8R får mest ud af range, survivability og lave driftsomkostninger. Våben er sekundært.", [
        loadoutPart("Quantum drive · S1", "Atlas", "Platinum Bay HUR-L5 · ca. 84,000 UEC", "Bedste praktiske buyable S1 QD til rescue, bunker og shuttle loops.", LINKS.uexAtlas),
        loadoutPart("Shield · S1", "Palisade", "Omega Pro New Babbage / CRU-L4 og gateway shops · ca. 198,000 UEC", "Giver mere tid til at komme væk med patient eller gear.", LINKS.uexPalisade),
        loadoutPart("Power / cooling", "Breton S1 power + Ultra-Flow cooler", "Cousin Crow's / Platinum Bay / UEX", "Opgrader kun efter QD/shield. Medical gameplay presser sjældent components hårdt.", LINKS.uexBreton),
        loadoutPart("Weapons", "Behold stock / light laser repeaters", "CenterMass / UEX Items hvis du absolut vil opgradere", "C8R skal lande og redde, ikke blive i kamp.", LINKS.erkul),
        loadoutPart("Medical gear", "Medpens, multitool, tractor attachment", "Hospitals, cargo decks og station shops", "Loadoutet er ikke kun ship parts; hold FPS medical kit og tractor klar.", LINKS.uexItems)
      ], [
        "Hvis du flyver rescue alene, er Atlas den mest mærkbare opgradering."
      ]),
      loadoutShip("loadout-roc", "ROC", "Ground mining vehicle", "ground", ["owned", "ground", "mining", "vehicle"], "ROC har ikke quantum drive. Bedste loadout er transportskib, mining consumables, suit og route/sale plan.", [
        loadoutPart("Vehicle fit", "Behold stock mining laser", "Ingen stor component spend", "ROC-værdien ligger i gem-route, scanning og transport, ikke dyre komponenter.", LINKS.erkul),
        loadoutPart("Transport", "C2 / Cutlass / Taurus afhængigt af ramp og område", "Brug dine egne ships", "C2 er mest komfortabel. Cutlass/Taurus kræver test med ramp og terrain før lange runs.", LINKS.uexVehiclesBuy),
        loadoutPart("FPS gear", "Pembroke/Novikov efter klima + multitool", "Armor shops / station shops / UEX Items", "ROC mining fejler ofte på environment og logistics før vehicle loadout.", LINKS.uexItems),
        loadoutPart("Sale planning", "Hadanite/Aphorite/Dolivine live price check", "UEX Mining Pricing", "Check gem-priser og nearest sell før du kører langt.", LINKS.uexMiningPricing),
        loadoutPart("Support", "Medpens + tractor attachment", "Station shops", "Gør recovery og cargo flyt lettere ved outposts.", LINKS.uexItems)
      ], [
        "ROC-upgrade nummer 1 er et godt transportskib og et kendt mining spot."
      ]),
      loadoutShip("loadout-ursa", "Ursa Medivac", "Ground medical support", "ground", ["owned", "ground", "medical", "vehicle"], "Ursa Medivac er support. Loadoutet handler om transport, medical flow og overlevelse på ground missions.", [
        loadoutPart("Vehicle fit", "Behold stock", "Ingen kritisk component spend", "Ursa skal levere medbed og transport. Den skal ikke bygges som primær combat platform.", LINKS.erkul),
        loadoutPart("Transport", "C2 Hercules som primær carrier", "Brug eget C2", "C2 giver bedst margin til Ursa + gear + event crew.", LINKS.uexVehiclesBuy),
        loadoutPart("Medical gear", "Medpens, medgun, tractor og spare armor", "Hospitals / station shops / UEX Items", "Medical vehicle er kun så nyttigt som det gear, der ligger klar.", LINKS.uexItems),
        loadoutPart("Ground weapons", "Personlige weapons efter mission", "CenterMass / weapon shops / UEX Items", "Køb FPS loadout separat; Ursa-våben er ikke den vigtigste investering.", LINKS.uexItems),
        loadoutPart("Route", "Land nær objective men uden turret line-of-sight", "Mission planning", "Operational placering betyder mere end komponenter.", LINKS.erkul)
      ], [
        "Brug den sammen med C2 til bunker/event recovery."
      ]),
      loadoutShip("loadout-caterpillar", "Caterpillar", "Large cargo appendix", "appendix", ["appendix", "cargo", "large ship", "s3 quantum"], "Caterpillar er appendix, men build-retningen ligner C2: S3 quantum, store shields og kun defensive weapons.", [
        loadoutPart("Quantum drive · S3", "Agni", "Everus Harbor eller Omega Pro · ca. 430,920 UEC", "Direkte købbart hurtigt S3 QD til store cargo routes.", LINKS.uexAgni, "TS-2 er ikke direkte buy i UEX."),
        loadoutPart("Shield · S3", "Parapet", "GrimHEX eller Omega Pro · ca. 792,000 UEC", "Robust cargo-defense shield. Prioriter før våben.", LINKS.uexParapet),
        loadoutPart("Power / cooling", "Durango S3 power + Chill-Max/IceBox cooler check", "Dumper's Depot Area18 / Omega Pro / UEX", "Opgrader efter Erkul hvis du bygger tungere weapons.", LINKS.uexDurango),
        loadoutPart("Weapons", "Defensive laser cannons/repeaters", "CenterMass / UEX Items", "Undgå ballistic ammo logistics på cargo ship med lang route.", LINKS.erkul),
        loadoutPart("Cargo flow", "UEX route + demand check", "UEX Trade Routes", "Det bedste Caterpillar loadout er stadig en route, der kan sælge lasten.", LINKS.uexRoutes)
      ], [
        "Appendix-skib: hold dataen som cargo-reference, ikke som første upgrade-prioritet."
      ])
    ]
  };

  window.SC_STANDARD_REFERENCE = {
    id: "standard-keys",
    name: "Standard keys",
    manufacturer: "Keyboard / Mouse",
    callsign: "COMMON · ALL SHIPS",
    image: "assets/icons/module-keys.svg",
    navIcon: "assets/icons/module-keys.svg",
    status: "standard",
    statusLabel: "Fælles",
    category: "standard",
    primaryRole: "Fælles taster for alle skibe",
    tags: ["standard", "keyboard", "all ships"],
    summary: "Her ligger de generelle standardkommandoer, som ikke behøver gentages på hvert skib. Brug ship-siderne til de særlige mining-, salvage-, medical-, cargo- og turret-kommandoer.",
    stats: [stat("Dækker", "Alle skibe"), stat("Input", "Keyboard / mouse"), stat("Formål", "Kort reference")],
    quickActions: [
      quick("Åbn Standard keys", "1", "Brug som fælles reference for flight, landing, power og combat."),
      quick("Søg efter skib/rolle", "Search", "Skriv mining, salvage, cargo, medical eller skibsnavn."),
      quick("Print valgt view", "Print", "Print eller gem en kort reference til anden skærm."),
      quick("Fokusvisning", "▣", "Skjul venstre skibsliste når du kun vil se valgt guide.")
    ],
    saleInfo: saleInfo("Live trade check", "Brug faste salgssteder som startpunkt, men verificér altid pris, demand og freight elevator-status før store runs.", [
      saleLocation("UEX / SC Trade Tools", "Brug dem til live demand, pris og terminalnavn før du fylder et skib."),
      saleLocation("TDD / CBD / Admin terminals", "Typiske steder for cargo og refined commodities afhængigt af varetype."),
      saleLocation("Refinery / gateway terminals", "Nogle råvarer og ores kan have dedikerede refinery ore terminals."),
      saleLocation("Patch note", "Hvis en terminal ikke køber varen, prøv anden terminaltype eller check live-databaser.", "Star Citizen economy og terminaler ændrer sig ofte mellem patches.")
    ]),
    modes: [
      mode("flight", "Flight", ["general", "flight", "landing", "power"], [
        step("Start og flyv", "Brug denne side til de faste flight-, power-, gear- og quantum-kommandoer."),
        step("Hold ship-sider korte", "Gå til et konkret skib når du kun vil se de specialkommandoer, der er relevante for rollen."),
        step("Verificér efter patch", "Hvis CIG ændrer defaults, ret standardgruppen her én gang i stedet for under hvert skib.")
      ], [
        note("Brugsmønster", "Når du kan flight-keys udenad, bliver denne side mest backup og print/reference.")
      ]),
      mode("combat-targeting", "Combat / targeting", ["combat", "targeting", "scanning"], [
        step("Combat basics", "Fire, missiles, countermeasures, targeting og scanning ligger samlet her."),
        step("Skibsspecifik combat", "Scorpius-siden viser kun de særlige ting som turret og konfiguration.")
      ], [
        note("Scope", "Det her er generelle combat- og target-keys, ikke en build-guide.")
      ]),
      mode("tools-support", "Tools / support", ["cargo", "tractor", "medical", "fps"], [
        step("Tools og support", "Cargo, tractor, FPS og medical keys ligger her, fordi de går igen på tværs af flere skibe og situationer."),
        step("Rolleflow", "Taurus, Vulture, C8R og Ursa viser stadig de flows hvor de her keys bruges i praksis.")
      ], [
        note("Ikke alle skibe", "Nogle af disse keys kræver udstyr eller et relevant skib, men de er ikke unikke for ét skib.")
      ]),
      mode("ground", "Ground vehicles", ["ground"], [
        step("Køretøjer", "Fælles vehicle drive, boost, brake, lights og weapon preset controls."),
        step("ROC og Ursa", "Gå til ROC eller Ursa Medivac for de specialiserede mining/medical flows.")
      ], [
        note("Ground scope", "Ground vehicle keys er samlet her, så ROC og Ursa kan holde fokus på deres rolle.")
      ])
    ]
  };

  window.SC_SHIPS = [
    {
      id: "constellation-taurus",
      name: "Constellation Taurus",
      manufacturer: "RSI",
      callsign: "TAURUS · FREIGHT",
      image: "assets/fankit/wallpapers/constellation-taurus.jpg",
      status: "owned",
      statusLabel: "Min",
      category: "cargo",
      primaryRole: "Fragt, daily driver og tractor-support",
      tags: ["cargo", "multirole", "tractor"],
      summary: "Taurus er solid fragt- og utility-platform: handelsruter, box missions, let multicrew og cargo-opgaver hvor C2 er for stor.",
      stats: [stat("Primær brug", "Medium freight"), stat("Besætning", "Solo / multicrew"), stat("Keybinds", "Special")],
      quickActions: [
        quick("Cargo check", "UEX", "Vælg vare og demand før du køber."),
        quick("Request landing", "Left Alt + N", "Brug ved TDD/city eller station før unloading."),
        quick("Port locks", "Right Alt + K", "Lås item ports op/ned før komponent- eller tractor-arbejde."),
        quick("Tractor attach", "Left Mouse", "Flyt cargo eller komponenter med tractor."),
        quick("Tractor detach", "Right Mouse", "Slip eller detach objekt."),
        quick("Lock down", "F", "Luk døre/elevatorer via interaction før takeoff.")
      ],
      saleInfo: saleInfo("Cargo salg", "Taurus er bedst til medium cargo-runs og utility. Brug live demand før køb, især hvis varen er dyr.", [
        saleLocation("Area18 TDD / IO Tower", "Godt første check for lovlige commodity-runs i ArcCorp-området."),
        saleLocation("Lorville CBD", "Godt første check for industri- og bulkvarer omkring Hurston."),
        saleLocation("New Babbage TDD", "Godt første check for MicroTech-ruter."),
        saleLocation("Station Admin terminals", "Brug til mindre cargo, mission boxes eller low-volume salg."),
        saleLocation("UEX route check", "Check buy/sell, demand og refresh før du fylder Taurus.", "Undgå at købe mere end destinationen realistisk aftager.")
      ]),
      modes: [
        mode("cargo", "Cargo", ["cargo", "tractor"], [
          step("Planlæg rute", "Tjek station, hangar og cargo-type før køb, så du ikke binder kapital i en dårlig rute."),
          step("Lås skibet ned", "Luk døre og elevatorer efter loading, især ved offentlige hangarer og outposts."),
          step("Brug tractor-flow", "Port locks, tractor og cargo placement er de vigtigste hurtigkommandoer på Taurus."),
          step("Afslut med salgscheck", "Noter terminal, efterspørgsel og pris før næste rute.")
        ], [
          note("Loadout", "Gem quantum drive, shields og våbenvalg her, når du vælger fast standard-build."),
          note("Cargo discipline", "Brug C2 til tung volumen; brug Taurus når du vil have hurtigere og mindre risikabel fragt.")
        ]),
        mode("combat", "Defense", [], [
          step("Target først", "Lock target og vurder om du skal kæmpe eller disengage."),
          step("Hold power simpelt", "Weapons under firing window, shields under pres, engines når du skal væk."),
          step("Brug countermeasures tidligt", "Hellere én decoy for meget end at miste fuld cargo.")
        ], [
          note("Rolle", "Taurus kan forsvare sig, men er ikke bygget som fighter.")
        ])
      ]
    },
    {
      id: "c2-hercules",
      name: "C2 Hercules",
      manufacturer: "Crusader",
      callsign: "C2 · HEAVY LIFT",
      image: "assets/fankit/wallpapers/c2-hercules.jpg",
      status: "owned",
      statusLabel: "Min",
      category: "cargo",
      primaryRole: "Tung fragt og køretøjstransport",
      tags: ["cargo", "vehicle transport", "large ship"],
      summary: "C2 er tung transport: store handelsruter, ROC/Ursa transport og opgaver hvor volumen betyder mere end fleksibilitet.",
      stats: [stat("Primær brug", "Heavy cargo"), stat("Besætning", "Solo / support"), stat("Keybinds", "Special")],
      quickActions: [
        quick("Route verify", "UEX", "Check profit, demand og terminal før stor investering."),
        quick("Front/rear ramp", "F", "Brug interaction til ramp og doors."),
        quick("Request landing", "Left Alt + N", "Kald ATC tidligt; C2 kræver plads."),
        quick("Vehicle load", "W/A/S/D", "Load ROC/Ursa langsomt og lige."),
        quick("Cargo lock", "F", "Luk ramper før takeoff."),
        quick("Abort sale", "UEX", "Find backup-destination hvis terminalen ikke aftager varen.")
      ],
      saleInfo: saleInfo("Bulk cargo salg", "C2 bør kun fyldes på ruter med dokumenteret demand. En fuld C2 på forkert terminal binder meget kapital.", [
        saleLocation("Major city TDD/CBD", "Primær destination for store lovlige commodity-runs."),
        saleLocation("Gateway / station terminals", "Brug kun hvis live demand viser kapacitet nok til stor volumen."),
        saleLocation("UEX route planner", "Sorter efter demand og inventory, ikke kun margin."),
        saleLocation("SC Trade Tools", "God backup til at sammenligne ruter og risiko."),
        saleLocation("Freight elevator check", "Bekræft at location kan modtage cargo før du flyver langt.", "Server- og patchfejl kan gøre en ellers god rute ubrugelig.")
      ]),
      modes: [
        mode("cargo", "Cargo", ["cargo"], [
          step("Vælg sikker rute", "Prioriter kendte handelsstop og landingszoner med plads til store ramper."),
          step("Load køretøj", "Kør ROC eller Ursa ind roligt, parkér lige og luk rampen før takeoff."),
          step("Før log", "Skriv vare, købspris, salgspris og risiko pr. rute.")
        ], [
          note("Operational risk", "Stor last betyder høj tabsrisiko. Brug kun ruter du stoler på efter en patch."),
          note("Køretøjer", "ROC og Ursa Medivac hører naturligt hjemme i C2-flowet.")
        ]),
        mode("flight", "Flyvning", [], [
          step("Preflight", "Check doors, ramp, landing gear og rute før du forlader hangar."),
          step("Manøvrering", "Hold større afstand og planlæg drej tidligt."),
          step("Landing", "Brug langsom approach og hold øje med rampeplads.")
        ], [
          note("Checklist", "Hold C2-checklisten kort, så den kan læses hurtigt på anden skærm.")
        ])
      ]
    },
    {
      id: "cutlass-black",
      name: "Cutlass Black",
      manufacturer: "Drake",
      callsign: "CUTLASS · MULTIROLE",
      image: "assets/fankit/wallpapers/cutlass-black.jpg",
      status: "owned",
      statusLabel: "Min",
      category: "cargo",
      primaryRole: "Multirole, bunker, fragt og let support",
      tags: ["multirole", "cargo", "daily driver"],
      summary: "Cutlass Black er fleksibel hverdagsplatform: småfragt, bunker-support, box missions og hurtige flyt uden at tage specialskibene frem.",
      stats: [stat("Primær brug", "Daily driver"), stat("Besætning", "Solo / 2"), stat("Keybinds", "Special")],
      quickActions: [
        quick("Open ramp/doors", "F", "Brug interaction på ramp eller sidedøre."),
        quick("Tractor move", "Left Mouse", "Flyt boxes, loot eller komponenter."),
        quick("Cargo check", "Admin", "Småfragt kan ofte sælges ved admin/cargo terminals."),
        quick("Turret handoff", "Hold Y", "Crew går ind/ud af turret/seat."),
        quick("Mission loot", "I", "Sorter loot før du tager afsted."),
        quick("Repair/restock", "Station", "Cutlass bruges ofte som daily driver; restock før næste loop.")
      ],
      saleInfo: saleInfo("Småfragt og loot", "Cutlass er god til små sikre runs, mission cargo og bunker-loot. Den skal ikke bruges som stor spekulationshauler.", [
        saleLocation("Station Admin terminals", "Første stop for små cargo-partier og mission-relateret freight."),
        saleLocation("City trade terminals", "Brug hvis varen er almindelig commodity med city demand."),
        saleLocation("Weapon/armor shops", "Tjek shops for loot-salg hvis patchen understøtter item sale."),
        saleLocation("GrimHEX / station hubs", "Praktisk for hurtig unloading efter risky loops."),
        saleLocation("Live price check", "Check UEX/SC Trade Tools for commodity boxes før køb.", "Loot og cargo-regler ændrer sig mellem patches.")
      ]),
      modes: [
        mode("daily", "Daglig brug", ["cargo", "tractor"], [
          step("Vælg missionstype", "Brug Cutlass til box, bunker-support, småfragt og hurtige flyt."),
          step("Hold bagrampen ren", "Lad plads til loot, boxes eller køretøj før takeoff."),
          step("Afslut opgaven", "Noter hvor du parkerer, hvis skibet bruges som mobil base.")
        ], [
          note("Standard-loadout", "Skriv quantum drive, shields og våbenvalg her."),
          note("Known issues", "Gem patch-specifikke fejl her, fx dør, ramp eller inventory-problemer.")
        ]),
        mode("combat", "Combat", ["turret"], [
          step("Sæt power-prioritet", "Noter dit flow for shields, weapons og engines."),
          step("Brug turret hvis multicrew", "Skriv crew-roller og comms-kald her."),
          step("Disengage tidligt", "Cutlass er fleksibel, ikke en ren heavy fighter.")
        ], [
          note("Combat note", "Tilføj kun de combat-taster du faktisk bruger mest, så listen ikke bliver støjende.")
        ])
      ]
    },
    {
      id: "scorpius",
      name: "Scorpius",
      manufacturer: "RSI",
      callsign: "SCORPIUS · COMBAT",
      image: "assets/fankit/wallpapers/scorpius.jpg",
      status: "owned",
      statusLabel: "Min",
      category: "combat",
      primaryRole: "Heavy fighter og multicrew combat",
      tags: ["combat", "fighter", "multicrew"],
      summary: "Scorpius er kampplatformen: target management, weapons, missiles, countermeasures og turret-samarbejde.",
      stats: [stat("Primær brug", "Combat"), stat("Besætning", "1-2"), stat("Keybinds", "Special")],
      quickActions: [
        quick("Wings/config", "Alt + K", "Skift konfiguration når gear er oppe, hvis understøttet."),
        quick("Enter missile mode", "Middle Mouse", "Brug missiles før tæt dogfight."),
        quick("Countermeasure", "H / J", "Decoy eller noise ved missile warning."),
        quick("Turret recenter", "Hold C", "Recenter remote turret."),
        quick("Exit turret", "Hold Y", "Forlad remote turret/seat."),
        quick("Repair/restock", "Station", "Restock missiles og repairs efter combat.")
      ],
      saleInfo: saleInfo("Combat payouts", "Scorpius sælger normalt ikke cargo. Pengene kommer fra bounty, beacon eller event payout, og drift handler om restock/repair.", [
        saleLocation("Bounty payout", "Belønning udbetales via mission/system, ikke trade terminal."),
        saleLocation("Station services", "Repair, refuel og restock efter hver combat-session."),
        saleLocation("Loot cleanup", "Hvis du samler FPS/ship loot, sælg ved relevante shops/admin terminals."),
        saleLocation("Risk note", "Undgå at bruge Scorpius som cargo-skib; tabt cargo er ikke dens styrke.")
      ]),
      modes: [
        mode("combat", "Combat", ["turret"], [
          step("Target flow", "Find target, lock, vurder afstand og prioriter trussel."),
          step("Power management", "Skift power efter situation: engines til position, shields under pres, weapons ved firing window."),
          step("Countermeasures", "Brug H/J tidligt nok til at det faktisk hjælper."),
          step("Reset", "Efter kamp: reload, repair, restock og noter hvad der manglede.")
        ], [
          note("Crew", "Tilføj turret-rolle og comms-kald hvis du flyver Scorpius med en anden spiller."),
          note("Loadout", "Gem våbengrupper, ammo-typer og komponentvalg her.")
        ], [
          bind("Ship configuration / wings", "Alt + K", "Skift Scorpius-konfiguration når landing gear er oppe, hvis patchen understøtter det.")
        ]),
        mode("flight", "Flyvning", [], [
          step("Pre-engagement", "Check fuel, repairs, ammo og bindings før bounty eller combat beacon."),
          step("Position", "Hold energi og afstand under kontrol; undgå at blive fanget stationært.")
        ], [
          note("Training", "Skriv de øvelser du bruger til at huske combat binds.")
        ])
      ]
    },
    {
      id: "prospector",
      name: "Prospector",
      manufacturer: "MISC",
      callsign: "PROSPECTOR · MINING",
      image: "assets/fankit/wallpapers/prospector.jpg",
      status: "owned",
      statusLabel: "Min",
      category: "industry",
      primaryRole: "Solo mining",
      tags: ["industry", "mining", "solo"],
      summary: "Prospector er solo-mining: scan, find god sten, stabilisér laser, fracture, extract og hjem til raffinering eller salg.",
      stats: [stat("Primær brug", "Solo mining"), stat("Besætning", "1"), stat("Keybinds", "Special")],
      quickActions: [
        quick("Mining mode", "M", "Skift til mining operator mode."),
        quick("Scan/ping", "V / Tab", "Find rocks og narrow scan angle efter signal."),
        quick("Fire laser", "Left Mouse", "Fracture eller extract afhængigt af mode."),
        quick("Switch fracture/extract", "Left Alt + Left Mouse", "Skift beam mode hvor relevant."),
        quick("Laser power up", "Mouse Wheel Up", "Øg power langsomt ind i grønt felt."),
        quick("Module 1-3", "Left Alt + 1-3", "Aktiver mining consumables."),
        quick("Jettison", "Left Alt + J", "Dump cargo hvis loadout/rock går galt.")
      ],
      saleInfo: saleInfo("Mining salg", "Prospector-loopet er typisk: mine rå ore, lav refinery work order, flyt refined cargo til en køber med demand.", [
        saleLocation("Refinery deck", "Start work order ved station/refinery efter mining run."),
        saleLocation("TDD / city commodity terminals", "Typisk første check for refined ore salg efter hauling."),
        saleLocation("Refinery ore terminals", "Nogle gateways/refinery locations har dedikerede ore terminals."),
        saleLocation("UEX Mining / Refineries", "Check mineralværdi, refinery yield og salgssteder før længere runs."),
        saleLocation("Backup destination", "Hav en sekundær TDD/admin destination klar.", "Efter patches kan freight elevator eller demand blokere salg.")
      ]),
      modes: [
        mode("mining", "Mining", ["mining"], [
          step("Find feltet", "Hop til kendt mining-lokation, scan bredt og filtrer efter masse, instability og materialer."),
          step("Vurder stenen", "Undgå dårlige kombinationer af høj instability og lav værdi, medmindre du tester udstyr."),
          step("Start fracture", "Hold laserstyrke kontrolleret og arbejd mod grønt felt uden at overophede stenen."),
          step("Extract", "Skift til extraction, saml de værdifulde fragmenter og lad lavværdi blive liggende."),
          step("Raffinér eller sælg", "Noter station, yield og om ruten var tiden værd.")
        ], [
          note("Mining head", "Gem dit faste mining head og moduler her, fx stabilitet, power og consumables."),
          note("Patch-sikkerhed", "Mining-balancen ændrer sig ofte. Markér noter med patchnummer, når du finjusterer.")
        ]),
        mode("loadout", "Loadout", ["mining"], [
          step("Komponenter", "Skriv fast quantum drive, shields og mining head."),
          step("Consumables", "Noter hvilke consumables du faktisk bruger og hvornår."),
          step("Efter patch", "Tjek om mining head og moduler stadig virker som forventet.")
        ], [
          note("Prospector build", "Denne sektion er klar til dit konkrete build.")
        ])
      ]
    },
    {
      id: "argo-mole",
      name: "ARGO MOLE",
      manufacturer: "ARGO",
      callsign: "MOLE · CREW MINING",
      image: "assets/fankit/wallpapers/argo-mole.jpg",
      status: "owned",
      statusLabel: "Min",
      category: "industry",
      primaryRole: "Multicrew mining",
      tags: ["industry", "mining", "multicrew"],
      summary: "MOLE er mining med crew: rollefordeling, turret-mining, koordinering og mere disciplin end Prospector.",
      stats: [stat("Primær brug", "Crew mining"), stat("Besætning", "2-4"), stat("Keybinds", "Special")],
      quickActions: [
        quick("Mining mode", "M", "Turret-operator går i mining mode."),
        quick("Scan/ping", "V / Tab", "Pilot eller scanner finder rocks."),
        quick("Fire laser", "Left Mouse", "Laser på aftalt callout."),
        quick("Laser modules", "Left Alt + 1-3", "Aktiver consumables efter crew-call."),
        quick("Turret recenter", "Hold C", "Recenter mining turret."),
        quick("Exit turret", "Hold Y", "Forlad turret/seat."),
        quick("Jettison", "Left Alt + J", "Dump cargo ved fejl eller dårlig load.")
      ],
      saleInfo: saleInfo("Crew mining salg", "MOLE bør planlægge salgsflow før cargo er fuld, fordi crew-tid er dyrere end solo-tid.", [
        saleLocation("Refinery deck", "Opret work orders straks efter run, og noter yield/timer."),
        saleLocation("Major city TDD", "Første salgscheck for refined high-value ore."),
        saleLocation("UEX mineral prices", "Brug live priser til at vælge hvilke rocks crewet gider mine."),
        saleLocation("Crew split note", "Notér payout-regel før turen starter."),
        saleLocation("Demand check", "Undgå at raffinere/haulte mere end en destination kan aftage.", "Economy og terminaler ændrer sig ofte.")
      ]),
      modes: [
        mode("crew-mining", "Crew mining", ["mining", "turret"], [
          step("Fordel roller", "Pilot, scan, laser-operatorer og cargo/route-noter."),
          step("Callouts", "Brug korte kald for power op, power ned, instability og fracture."),
          step("Synkroniser lasers", "Noter dit crew-flow for flere mining heads på samme rock."),
          step("Extraction", "Saml målrettet og undgå at fylde med lavværdi.")
        ], [
          note("Crew standard", "Skriv standard comms, roller og hvem der gør hvad."),
          note("Turret setup", "Gem mining heads og moduler pr. turret.")
        ]),
        mode("flight", "Flyvning", [], [
          step("Positionering", "Hold skibet stabilt og orienteret, så turret-operators kan arbejde uden at kæmpe mod vinklerne."),
          step("Exit route", "Planlæg hjemtur før cargo er fuld.")
        ], [
          note("Pilot note", "MOLE-guiden bør adskille pilotens taster fra turret-operatorens taster.")
        ])
      ]
    },
    {
      id: "vulture",
      name: "Vulture",
      manufacturer: "Drake",
      callsign: "VULTURE · SALVAGE",
      image: "assets/fankit/wallpapers/vulture.jpg",
      status: "owned",
      statusLabel: "Min",
      category: "industry",
      primaryRole: "Solo salvage",
      tags: ["industry", "salvage", "solo"],
      summary: "Vulture er solo-salvage: find vrag, strip hull, håndter cargo boxes og hold loopet kort nok til at være effektivt.",
      stats: [stat("Primær brug", "Salvage"), stat("Besætning", "1"), stat("Keybinds", "Special")],
      quickActions: [
        quick("Salvage mode", "M", "Deploy salvage arm/operator mode."),
        quick("Scrape beam", "Left Mouse", "Scrape hull først for RMC."),
        quick("Fracture tool", "Left Alt + W", "Skift til structural/fracture efter hull scrape."),
        quick("Fire fracture", "Right Alt + W", "Knæk vraget i mindre dele."),
        quick("Disintegrate", "Right Alt + S", "Sug de brækkede dele ind som CMAT."),
        quick("Back to scrape", "Left Alt + S", "Tilbage til almindelig salvage heads."),
        quick("Tractor attach", "Left Mouse", "Flyt RMC/CM boxes med tractor."),
        quick("Sell check", "UEX", "Check RMC/CM demand før du flyver langt.")
      ],
      saleInfo: saleInfo("Salvage salg", "Vulture-salg afhænger af RMC/CM demand. Brug live database før du vælger destination.", [
        saleLocation("RMC demand page", "Check UEX commodity page for Recycled Material Composite før afgang."),
        saleLocation("CMAT / construction materials", "Check Construction Materials demand separat hvis du har CM boxes."),
        saleLocation("Admin / commodity terminals", "Prøv relevante station/city/admin terminals afhængigt af demand."),
        saleLocation("GrimHEX / trade hubs", "Kan være praktiske backup-steder, men pris og demand varierer."),
        saleLocation("Freight elevator check", "Bekræft at box unloading virker på destinationen.", "RMC/CM sell locations skifter, og broken elevators kan ødelægge et run.")
      ]),
      modes: [
        mode("salvage", "Salvage", ["salvage", "tractor", "cargo"], [
          step("Find mål", "Vælg lovlig salvage, mission eller vragfelt og check risiko før du går tæt på."),
          step("Strip hull", "Hold jævn afstand og arbejd systematisk over fladerne."),
          step("Fracture", "Når hull er scraped nok, brug structural salvage til at fracture vraget i mindre dele."),
          step("Disintegrate", "Skift til disintegrate og fyld buffer/boxes med Construction Materials fra delene."),
          step("Håndter boxes", "Flyt kasser løbende, så produktionen ikke stopper på et dårligt tidspunkt."),
          step("Sælg", "Noter salgssted, pris og hvor meget tid runnet tog.")
        ], [
          note("Salvage heads", "Gem hvilke heads du bruger og hvornår de skiftes."),
          note("Structural salvage", "Det du kaldte destruction mode er fracture + disintegrate. Hvis HUD key hints viser en anden bind efter patch, følg HUD'en og opdater noten."),
          note("Cargo discipline", "Noter hvor mange boxes du vil tage før salg, så du ikke overdriver risikoen.")
        ]),
        mode("structural-salvage", "Structural salvage", ["salvage", "tractor"], [
          step("Scrape først", "Strip hull for RMC med normal salvage beam, før du bruger structural salvage."),
          step("Focus fracture", "Tryk Left Alt + W for at fokusere fracture tool, hvis du vil væk fra normal scraping."),
          step("Fracture vraget", "Tryk Right Alt + W for fracture fire og hold position tæt nok på target, indtil det brækker op."),
          step("Disintegrate delene", "Tryk Right Alt + S for disintegrate fire og arbejd delene ned til Construction Materials."),
          step("Tilbage til scrape", "Tryk Left Alt + S for at fokusere alle salvage heads igen, hvis du skal tilbage til normal hull scraping."),
          step("Box flow", "Tøm buffer og flyt RMC/CMAT boxes med tractor beam, før produktionen stopper.")
        ], [
          note("Navn", "Star Citizen kalder flowet structural salvage: Fracture og Disintegrate."),
          note("Patch note", "Salvage binds er patch-følsomme. Slå Key Bind Hints til i spillet, hvis HUD'en ikke matcher guiden.")
        ], [
          bind("Focus fracture tool", "Left Alt + W", "Vælg fracture/structural salvage tool."),
          bind("Toggle fracture fire", "Right Alt + W", "Knæk target i mindre dele."),
          bind("Toggle disintegrate fire", "Right Alt + S", "Disintegrate dele til Construction Materials."),
          bind("Focus all salvage heads", "Left Alt + S", "Tilbage til standard scraping/all heads."),
          bind("Toggle fire left", "Right Alt + A", "Venstre salvage head on/off."),
          bind("Toggle fire right", "Right Alt + D", "Højre salvage head on/off.")
        ]),
        mode("cargo", "Cargo", ["cargo", "tractor"], [
          step("Stacking", "Hold ganglinjer og døre fri."),
          step("Unload", "Skriv din faste unload-rutine her.")
        ], [
          note("Box flow", "Denne note er til dine konkrete Vulture-cargo vaner.")
        ])
      ]
    },
    {
      id: "c8r-pisces-rescue",
      name: "C8R Pisces Rescue",
      manufacturer: "Anvil",
      callsign: "C8R · MEDICAL",
      image: "assets/fankit/wallpapers/c8r-pisces-rescue.jpg",
      status: "owned",
      statusLabel: "Min",
      category: "support",
      primaryRole: "Rescue, medical og hurtig support",
      tags: ["support", "medical", "small ship"],
      summary: "C8R er hurtig rescue-support: kom ind, stabilisér, heal, extract eller flyv videre med lav kompleksitet.",
      stats: [stat("Primær brug", "Medical rescue"), stat("Besætning", "1-2"), stat("Keybinds", "Special")],
      quickActions: [
        quick("Accept beacon", "MobiGlas", "Check afstand og risiko før du accepterer."),
        quick("Request landing", "Left Alt + N", "Brug ved station/hospital pickup."),
        quick("Draw medgun", "3", "Hvis medgun er udstyret."),
        quick("Use medgun", "Left Mouse", "Heal patient eller stabilisér."),
        quick("Self diagnose", "B", "Medgun self mode."),
        quick("Open rear door", "F", "Interaction på dør/ramp."),
        quick("Extract", "Hold Y", "Seat/exit flow ved pickup/dropoff.")
      ],
      saleInfo: saleInfo("Medical payout og loot", "C8R tjener typisk på rescue beacons, service og event payout, ikke cargo-salg.", [
        saleLocation("Medical beacons", "Payout kommer via beacon/mission flow når rescue gennemføres."),
        saleLocation("Hospitals / clinics", "Brug som pickup/dropoff og restock af medical supplies."),
        saleLocation("Station shops", "Sælg eventuelt loot eller køb medpens/medgun supplies."),
        saleLocation("Risk filter", "Spring beacons over hvis de lugter af trap eller ligger i højrisiko-zone."),
        saleLocation("Restock note", "Refill medical kit efter hvert rescue loop.")
      ]),
      modes: [
        mode("rescue", "Rescue", ["medical"], [
          step("Modtag beacon", "Check afstand, risiko og om rescue er i armistice, bunker eller åbent område."),
          step("Land sikkert", "Prioriter sikker landingszone fremfor korteste afstand."),
          step("Stabilisér", "Brug medbed, medgun eller supplies efter situation."),
          step("Extract", "Få patient ind, luk døre og forlad området hurtigt.")
        ], [
          note("Medical kit", "Gem hvad du altid vil have med: medpens, multitool, tractor, armor og våben."),
          note("Rules", "Skriv dine egne go/no-go regler for rescue beacons med høj risiko.")
        ])
      ]
    },
    {
      id: "roc",
      name: "ROC",
      manufacturer: "Greycat",
      callsign: "ROC · GROUND MINING",
      image: "assets/fankit/wallpapers/roc.jpg",
      status: "owned",
      statusLabel: "Min",
      category: "industry",
      primaryRole: "Ground mining",
      tags: ["industry", "ground vehicle", "mining"],
      summary: "ROC er ground-mining køretøjet: transportér den i C2, find gems, mine, collect og vend tilbage.",
      stats: [stat("Primær brug", "Ground mining"), stat("Besætning", "1"), stat("Keybinds", "Special")],
      quickActions: [
        quick("Deploy from C2", "F", "Åbn ramp og kør roligt ud."),
        quick("Drive", "W/A/S/D", "Kør og positionér ved gem nodes."),
        quick("Scan", "V", "Find gem clusters fra vehicle/ship."),
        quick("Mining fire", "Left Mouse", "Aktiver mining beam."),
        quick("Adjust power", "Mouse Wheel", "Juster beam power."),
        quick("Collect", "Right Mouse", "Brug collect/alternate action hvor relevant."),
        quick("Return/load", "W/A/S/D", "Kør tilbage og load før salg.")
      ],
      saleInfo: saleInfo("Gem salg", "ROC-salg handler om gems og korte sikre loops. Brug nærmeste fungerende terminal med demand fremfor at køre for langt.", [
        saleLocation("Mining outposts", "Første check for gem/ore sale tæt på mining area."),
        saleLocation("Refinery / station admin", "Backup hvis outpost ikke køber eller terminalen fejler."),
        saleLocation("Major city terminals", "Brug hvis du alligevel hauler gems hjem i C2."),
        saleLocation("UEX harvestables", "Check gem price og demand før du bruger lang tid på et område."),
        saleLocation("Terrain note", "Vælg salgssted efter rute og terræn, ikke kun toppris.", "Lang køretid kan æde gevinsten.")
      ]),
      modes: [
        mode("ground-mining", "Ground mining", ["groundMining"], [
          step("Transport", "Load ROC i C2 eller andet transportskib og parkér stabilt."),
          step("Find gems", "Scan fra skib eller køretøj, og marker gode felter."),
          step("Mine", "Hold laser stabil og saml kun værdifulde gems."),
          step("Return", "Kør tilbage, load sikkert og sælg eller flyt videre.")
        ], [
          note("Transport", "C2 Hercules er oplagt som ROC-transport i denne liste."),
          note("Terrain", "Gem gode planet/moon spots og farlige terræntyper her.")
        ])
      ]
    },
    {
      id: "ursa-medivac",
      name: "Ursa Medivac",
      manufacturer: "RSI",
      callsign: "URSA · MEDIVAC",
      image: "assets/fankit/wallpapers/ursa-medivac.jpg",
      status: "owned",
      statusLabel: "Min",
      category: "support",
      primaryRole: "Ground medical support",
      tags: ["support", "medical", "ground vehicle"],
      summary: "Ursa Medivac er ground-support: brug den med C2 til bunker, event, rescue og operationer hvor en medicinsk fallback tæt på området giver mening.",
      stats: [stat("Primær brug", "Ground medical"), stat("Besætning", "1+"), stat("Keybinds", "Special")],
      quickActions: [
        quick("Deploy from C2", "F", "Åbn ramp og kør ud med exit-retning klar."),
        quick("Drive", "W/A/S/D", "Positionér tæt nok på operationen, men ikke i skudlinjen."),
        quick("Vehicle lights", "L", "Brug lys ved night ops."),
        quick("Draw medgun", "3", "Brug medical gear ved patient."),
        quick("Use medgun", "Left Mouse", "Heal eller stabilisér."),
        quick("Self diagnose", "B", "Medgun self mode."),
        quick("Extract patient", "F", "Interaction på døre/medbed.")
      ],
      saleInfo: saleInfo("Support payout og loot", "Ursa Medivac er supportværktøj. Penge kommer fra mission/event payout, bunker-loot eller rescue-aftaler.", [
        saleLocation("Bunker / event payout", "Mission payout håndteres af missionen, ikke commodity terminal."),
        saleLocation("Medical supplies", "Restock ved hospitals, clinics eller relevante shops."),
        saleLocation("Loot sale", "Sælg FPS-loot ved relevante shops/admin terminals hvis patchen tillader det."),
        saleLocation("C2 return flow", "Load Ursa tilbage før du sælger loot eller flytter operationen."),
        saleLocation("Safety note", "Parkér så den kan køre væk hurtigt, ikke bare tæt på målet.")
      ]),
      modes: [
        mode("medical", "Medical", ["medical"], [
          step("Deploy", "Kør ud fra transportskib og parkér med exit-retning klar."),
          step("Treat", "Brug medical bed og supplies efter skadegrad."),
          step("Extract", "Flyt patient tilbage til skib eller sikker zone.")
        ], [
          note("Deployment", "Gem hvordan du loader den i C2, og hvor den står bedst under operationer."),
          note("Support kit", "Skriv standard inventory for bunker- og rescue-ture.")
        ])
      ]
    },
    {
      id: "caterpillar",
      name: "Caterpillar",
      manufacturer: "Drake",
      callsign: "CAT · APPENDIX",
      image: "assets/fankit/wallpapers/caterpillar.jpg",
      status: "appendix",
      statusLabel: "Appendix",
      category: "cargo",
      primaryRole: "Bonusnoter om fragt og Drake cargo",
      tags: ["cargo", "appendix", "large ship"],
      summary: "Caterpillar er med som appendix, fordi den har været nævnt. Brug den som sammenligning, ønskeliste eller fremtidig guide.",
      stats: [stat("Primær brug", "Cargo appendix"), stat("Besætning", "Multicrew"), stat("Keybinds", "Special")],
      quickActions: [
        quick("Route verify", "UEX", "Check demand og terminal før stor cargo-investering."),
        quick("Doors/modules", "F", "Brug interaction på doors/cargo modules."),
        quick("Undock module", "Right Alt + N", "Module undock hvor understøttet."),
        quick("Tractor cargo", "Left Mouse", "Flyt cargo eller komponenter."),
        quick("Request landing", "Left Alt + N", "Kald ATC tidligt."),
        quick("Backup sell", "UEX", "Hav alternativ destination klar.")
      ],
      saleInfo: saleInfo("Large cargo appendix", "Caterpillar bruges her som cargo-reference. Brug samme salgsdisciplin som C2: demand før volumen.", [
        saleLocation("Major city TDD/CBD", "Første check for store lovlige cargo-runs."),
        saleLocation("Station admin / cargo terminals", "Backup for mindre partier eller mission cargo."),
        saleLocation("UEX route planner", "Check demand, inventory, distance og ROI."),
        saleLocation("SC Trade Tools", "Sammenlign ruter før køb."),
        saleLocation("Patch risk", "Caterpillar/module behavior kan ændre sig; verificér før stor last.", "Appendix-skib: ikke markeret som ejet i appen.")
      ]),
      modes: [
        mode("appendix", "Appendix", ["cargo", "tractor"], [
          step("Sammenlign rolle", "Brug noten til at sammenligne Caterpillar mod Taurus og C2."),
          step("Gem spørgsmål", "Skriv de ting du vil undersøge før et eventuelt køb eller brug.")
        ], [
          note("Appendix", "Ikke markeret som ejet i denne app-version.")
        ], [
          bind("Undock module", "Right Alt + N", "Caterpillar/Ironclad module undock hvor understøttet.")
        ])
      ]
    }
  ];
})();
