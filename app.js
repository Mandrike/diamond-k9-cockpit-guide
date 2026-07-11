(function () {
  "use strict";

  var ships = window.SC_SHIPS || [];
  var keybindGroups = window.SC_KEYBIND_GROUPS || {};
  var systemReference = window.SC_SYSTEM_REFERENCE || null;
  var purchaseReference = window.SC_PURCHASE_REFERENCE || null;
  var shipGuideReference = window.SC_SHIP_GUIDE_REFERENCE || null;
  var loadoutReference = window.SC_LOADOUT_REFERENCE || null;
  var standardReference = window.SC_STANDARD_REFERENCE || null;
  var state = {
    selectedShipId: systemReference ? systemReference.id : (standardReference ? standardReference.id : (ships.length ? ships[0].id : null)),
    selectedModeId: null,
    filter: "all",
    query: "",
    systemId: "stanton",
    systemFilter: "all",
    systemQuery: "",
    purchaseFilter: "all",
    purchaseQuery: "",
    guideFilter: "all",
    guideQuery: "",
    loadoutFilter: "all",
    loadoutQuery: ""
  };

  var elements = {
    searchInput: document.getElementById("searchInput"),
    shipList: document.getElementById("shipList"),
    shipStatus: document.getElementById("shipStatus"),
    shipName: document.getElementById("shipName"),
    roleTags: document.getElementById("roleTags"),
    shipSummary: document.getElementById("shipSummary"),
    shipStats: document.getElementById("shipStats"),
    shipImage: document.getElementById("shipImage"),
    shipCallsign: document.getElementById("shipCallsign"),
    quickActionList: document.getElementById("quickActionList"),
    saleTitle: document.getElementById("saleTitle"),
    saleInfoList: document.getElementById("saleInfoList"),
    systemDirectory: document.getElementById("systemDirectory"),
    systemSelectorList: document.getElementById("systemSelectorList"),
    systemSearchInput: document.getElementById("systemSearchInput"),
    systemLocationList: document.getElementById("systemLocationList"),
    systemFilterButtons: Array.prototype.slice.call(document.querySelectorAll("[data-system-filter]")),
    purchaseDirectory: document.getElementById("purchaseDirectory"),
    purchaseSearchInput: document.getElementById("purchaseSearchInput"),
    purchaseItemList: document.getElementById("purchaseItemList"),
    purchaseFilterButtons: Array.prototype.slice.call(document.querySelectorAll("[data-purchase-filter]")),
    shipGuideDirectory: document.getElementById("shipGuideDirectory"),
    shipGuideSearchInput: document.getElementById("shipGuideSearchInput"),
    shipGuideItemList: document.getElementById("shipGuideItemList"),
    shipGuideFilterButtons: Array.prototype.slice.call(document.querySelectorAll("[data-guide-filter]")),
    loadoutDirectory: document.getElementById("loadoutDirectory"),
    loadoutSearchInput: document.getElementById("loadoutSearchInput"),
    loadoutItemList: document.getElementById("loadoutItemList"),
    loadoutFilterButtons: Array.prototype.slice.call(document.querySelectorAll("[data-loadout-filter]")),
    modeTabs: document.getElementById("modeTabs"),
    flowTitle: document.getElementById("flowTitle"),
    procedureList: document.getElementById("procedureList"),
    keybindList: document.getElementById("keybindList"),
    noteList: document.getElementById("noteList"),
    focusButton: document.getElementById("focusButton"),
    printButton: document.getElementById("printButton"),
    filterButtons: Array.prototype.slice.call(document.querySelectorAll("[data-filter]"))
  };

  function normalize(value) {
    return String(value || "").toLocaleLowerCase("da-DK");
  }

  function findSelectedShip() {
    if (systemReference && state.selectedShipId === systemReference.id) {
      return systemReference;
    }

    if (purchaseReference && state.selectedShipId === purchaseReference.id) {
      return purchaseReference;
    }

    if (shipGuideReference && state.selectedShipId === shipGuideReference.id) {
      return shipGuideReference;
    }

    if (loadoutReference && state.selectedShipId === loadoutReference.id) {
      return loadoutReference;
    }

    if (standardReference && state.selectedShipId === standardReference.id) {
      return standardReference;
    }

    return ships.find(function (ship) {
      return ship.id === state.selectedShipId;
    }) || systemReference || shipGuideReference || loadoutReference || purchaseReference || standardReference || ships[0];
  }

  function findSelectedMode(ship) {
    if (!ship || !ship.modes.length) {
      return null;
    }

    return ship.modes.find(function (mode) {
      return mode.id === state.selectedModeId;
    }) || ship.modes[0];
  }

  function shipMatchesFilter(ship, filter) {
    var activeFilter = filter || state.filter;

    if (activeFilter === "all") {
      return true;
    }

    if (activeFilter === "owned") {
      return ship.status === "owned";
    }

    return ship.category === activeFilter || ship.tags.indexOf(activeFilter) !== -1;
  }

  function shipMatchesQuery(ship, queryValue) {
    var query = normalize(queryValue === undefined ? state.query : queryValue);
    if (!query) {
      return true;
    }

    var searchable = [
      ship.name,
      ship.manufacturer,
      ship.primaryRole,
      ship.summary,
      ship.statusLabel
    ].concat(ship.tags, ship.modes.map(function (mode) {
      return mode.title;
    })).join(" ");

    return normalize(searchable).indexOf(query) !== -1;
  }

  function getFilteredShips() {
    return ships.filter(function (ship) {
      return shipMatchesFilter(ship) && shipMatchesQuery(ship);
    });
  }

  function getNavigationItems() {
    return [systemReference, shipGuideReference, loadoutReference, purchaseReference, standardReference].filter(Boolean).filter(function (item) {
      return navigationMatchesFilter(item) && navigationMatchesQuery(item);
    });
  }

  function navigationMatchesFilter(item) {
    if (state.filter === "all") {
      return true;
    }

    if (item.type === "ship-guide-reference") {
      return ships.some(function (ship) {
        return shipMatchesFilter(ship, state.filter);
      });
    }

    return item.category === state.filter || item.tags.indexOf(state.filter) !== -1 || item.status === state.filter;
  }

  function navigationMatchesQuery(item) {
    var query = normalize(state.query);
    if (!query) {
      return true;
    }

    var searchable = [
      item.name,
      item.manufacturer,
      item.primaryRole,
      item.summary,
      item.statusLabel
    ].concat(item.tags, item.modes.map(function (mode) {
      return mode.title;
    })).join(" ");

    if (normalize(searchable).indexOf(query) !== -1) {
      return true;
    }

    if (item.type !== "ship-guide-reference") {
      return false;
    }

    return ships.some(function (ship) {
      return shipMatchesQuery(ship, query);
    });
  }

  function selectedShipIsGuideChild() {
    return shipGuideReference && ships.some(function (ship) {
      return ship.id === state.selectedShipId;
    });
  }

  function navigationItemIsActive(item) {
    return item.id === state.selectedShipId || (item.type === "ship-guide-reference" && selectedShipIsGuideChild());
  }

  function createElement(tagName, className, text) {
    var element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }

    if (text !== undefined) {
      element.textContent = text;
    }

    return element;
  }

  function renderShipList() {
    var navigationItems = getNavigationItems();
    elements.shipList.textContent = "";

    if (!navigationItems.length) {
      elements.shipList.appendChild(createElement("p", "empty-state", "Ingen hovedfaner matcher filteret."));
      return;
    }

    navigationItems.forEach(function (ship) {
      elements.shipList.appendChild(renderShipButton(ship));
    });
  }

  function renderShipButton(ship) {
    var button = createElement("button", "ship-button");
    button.type = "button";
    button.dataset.shipId = ship.id;
    button.dataset.category = ship.category;
    button.setAttribute("aria-pressed", navigationItemIsActive(ship) ? "true" : "false");

    if (navigationItemIsActive(ship)) {
      button.classList.add("is-active");
    }

    var strip = createElement("span", "ship-strip");
    var copy = createElement("span");
    var title = createElement("span", "ship-button-title", ship.name);
    var role = createElement("span", "ship-button-role", ship.primaryRole);
    var pill = createElement("span", "ship-pill", ship.statusLabel);

    copy.appendChild(title);
    copy.appendChild(role);
    button.appendChild(strip);
    button.appendChild(copy);
    button.appendChild(pill);

    return button;
  }

  function renderBrief(ship) {
    elements.shipStatus.textContent = ship.statusLabel + " · " + ship.manufacturer;
    elements.shipName.textContent = ship.name;
    elements.shipSummary.textContent = ship.summary;
    elements.shipCallsign.textContent = ship.callsign;
    elements.shipImage.src = ship.image || "assets/cockpit-panel.svg";
    elements.shipImage.alt = ship.name;

    elements.roleTags.textContent = "";
    ship.tags.forEach(function (tag) {
      elements.roleTags.appendChild(createElement("span", "tag", tag));
    });

    if (ship.status === "appendix") {
      elements.roleTags.appendChild(createElement("span", "tag is-warn", "Appendix"));
    }

    elements.shipStats.textContent = "";
    ship.stats.forEach(function (stat) {
      var item = createElement("div", "stat-item");
      item.appendChild(createElement("span", "stat-label", stat.label));
      item.appendChild(createElement("span", "stat-value", stat.value));
      elements.shipStats.appendChild(item);
    });
  }

  function renderModeTabs(ship, mode) {
    elements.modeTabs.textContent = "";

    ship.modes.forEach(function (shipMode) {
      var button = createElement("button", "mode-tab", shipMode.title);
      button.type = "button";
      button.dataset.modeId = shipMode.id;
      button.setAttribute("aria-pressed", shipMode.id === mode.id ? "true" : "false");

      if (shipMode.id === mode.id) {
        button.classList.add("is-active");
      }

      elements.modeTabs.appendChild(button);
    });
  }

  function renderQuickActions(ship) {
    elements.quickActionList.textContent = "";
    var quickActions = ship.quickActions || [];

    if (!quickActions.length) {
      elements.quickActionList.appendChild(createElement("p", "empty-state", "Ingen quick actions endnu."));
      return;
    }

    quickActions.slice(0, 8).forEach(function (action) {
      var item = createElement("div", "quick-action-item");
      var key = createElement("kbd", null, action.key);
      var copy = createElement("div");
      copy.appendChild(createElement("div", "quick-action-title", action.label));
      copy.appendChild(createElement("p", "quick-action-detail", action.detail));
      item.appendChild(key);
      item.appendChild(copy);
      elements.quickActionList.appendChild(item);
    });
  }

  function renderSaleInfo(ship) {
    var saleInfo = ship.saleInfo || {};
    var locations = saleInfo.locations || [];
    elements.saleInfoList.textContent = "";
    elements.saleTitle.textContent = saleInfo.title || "Steder og flow";

    if (saleInfo.summary) {
      elements.saleInfoList.appendChild(createElement("p", "sale-summary", saleInfo.summary));
    }

    if (!locations.length) {
      elements.saleInfoList.appendChild(createElement("p", "empty-state", "Ingen salgsnoter endnu."));
      return;
    }

    locations.slice(0, 5).forEach(function (location) {
      var item = createElement("div", "sale-info-item");
      var locationTitle = createElement("div", "sale-location");

      if (location.url) {
        var link = createElement("a", "sale-location-link", location.name);
        link.href = location.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.title = "Åbn live reference";
        locationTitle.appendChild(link);
      } else {
        locationTitle.textContent = location.name;
      }

      item.appendChild(locationTitle);
      item.appendChild(createElement("p", "sale-detail", location.detail));
      if (location.warning) {
        item.appendChild(createElement("p", "sale-warning", location.warning));
      }
      elements.saleInfoList.appendChild(item);
    });
  }

  function getFilteredSystemLocations(ship) {
    var query = normalize(state.systemQuery);
    var locations = ship.systemLocations || [];
    var activeSystemId = getActiveSystemId(ship);

    return locations.filter(function (location) {
      if (!locationMatchesSystem(location, activeSystemId)) {
        return false;
      }

      var filterMatch = state.systemFilter === "all" || location.type === state.systemFilter || location.tags.indexOf(state.systemFilter) !== -1;
      if (!filterMatch) {
        return false;
      }

      if (!query) {
        return true;
      }

      var searchable = [
        location.name,
        location.system,
        location.type,
        location.detail,
        location.warning || ""
      ].concat(location.tags, location.services).join(" ");

      return normalize(searchable).indexOf(query) !== -1;
    });
  }

  function getActiveSystemId(ship) {
    var groups = (ship && ship.systemGroups) || [];
    if (!groups.length) {
      return "";
    }

    if (!groups.some(function (group) { return group.id === state.systemId; })) {
      state.systemId = groups[0].id;
    }

    return state.systemId;
  }

  function locationMatchesSystem(location, activeSystemId) {
    if (!activeSystemId) {
      return true;
    }

    if (normalize(location.system) === "live") {
      return true;
    }

    return normalize(location.system) === activeSystemId || location.tags.indexOf(activeSystemId) !== -1;
  }

  function renderLocationLink(location) {
    if (!location.url) {
      return createElement("span", "system-location-name", location.name);
    }

    var link = createElement("a", "system-location-link", location.name);
    link.href = location.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.title = "Åbn live reference";
    return link;
  }

  function renderSystemSelector(ship) {
    var groups = ship.systemGroups || [];
    var activeSystemId = getActiveSystemId(ship);

    elements.systemSelectorList.textContent = "";

    groups.forEach(function (group) {
      var button = createElement("button", "system-selector-card");
      var titleRow = createElement("span", "system-selector-top");
      var titleWrap = createElement("span");
      var tags = createElement("span", "system-service-row");

      button.type = "button";
      button.dataset.systemId = group.id;
      button.setAttribute("aria-pressed", group.id === activeSystemId ? "true" : "false");

      if (group.id === activeSystemId) {
        button.classList.add("is-active");
      }

      titleWrap.appendChild(createElement("span", "system-selector-title", group.name));
      titleWrap.appendChild(createElement("span", "system-selector-label", group.label));
      titleRow.appendChild(titleWrap);
      titleRow.appendChild(createElement("span", "ship-pill", group.status || "System"));

      (group.tags || []).slice(0, 4).forEach(function (tag) {
        tags.appendChild(createElement("span", "system-service-tag", tag));
      });

      button.appendChild(titleRow);
      button.appendChild(createElement("span", "system-selector-summary", group.summary));
      button.appendChild(tags);
      elements.systemSelectorList.appendChild(button);
    });
  }

  function renderSystemDirectory(ship) {
    var isSystem = ship && ship.type === "system-reference";
    elements.systemDirectory.hidden = !isSystem;

    if (!isSystem) {
      elements.systemSelectorList.textContent = "";
      elements.systemLocationList.textContent = "";
      return;
    }

    renderSystemSelector(ship);

    var locations = getFilteredSystemLocations(ship);
    elements.systemLocationList.textContent = "";

    if (!locations.length) {
      elements.systemLocationList.appendChild(createElement("p", "empty-state", "Ingen steder matcher søgningen."));
      return;
    }

    locations.forEach(function (location) {
      var item = createElement("article", "system-location-item");
      var top = createElement("div", "system-location-top");
      var meta = createElement("span", "system-location-meta", location.system + " · " + location.type);
      var tags = createElement("div", "system-service-row");

      top.appendChild(renderLocationLink(location));
      top.appendChild(meta);

      location.services.slice(0, 6).forEach(function (service) {
        tags.appendChild(createElement("span", "system-service-tag", service));
      });

      item.appendChild(top);
      item.appendChild(createElement("p", "system-location-detail", location.detail));
      item.appendChild(tags);

      if (location.warning) {
        item.appendChild(createElement("p", "sale-warning", location.warning));
      }

      elements.systemLocationList.appendChild(item);
    });
  }

  function getFilteredShipGuideItems() {
    var query = state.guideQuery;

    return ships.filter(function (ship) {
      return shipMatchesFilter(ship, state.guideFilter) && shipMatchesQuery(ship, query);
    });
  }

  function renderShipGuideDirectory(ship) {
    var isGuide = ship && ship.type === "ship-guide-reference";
    elements.shipGuideDirectory.hidden = !isGuide;

    if (!isGuide) {
      elements.shipGuideItemList.textContent = "";
      return;
    }

    var guideShips = getFilteredShipGuideItems();
    elements.shipGuideItemList.textContent = "";

    if (!guideShips.length) {
      elements.shipGuideItemList.appendChild(createElement("p", "empty-state", "Ingen skibsguides matcher søgningen."));
      return;
    }

    guideShips.forEach(function (guideShip) {
      var card = createElement("button", "ship-guide-card");
      var visual = createElement("span", "ship-guide-visual");
      var image = document.createElement("img");
      var copy = createElement("span", "ship-guide-copy");
      var header = createElement("span", "ship-guide-card-header");
      var titleWrap = createElement("span");
      var title = createElement("span", "ship-guide-title", guideShip.name);
      var role = createElement("span", "ship-guide-role", guideShip.primaryRole);
      var status = createElement("span", "ship-guide-status", guideShip.statusLabel);
      var summary = createElement("span", "ship-guide-summary", guideShip.summary);
      var modeRow = createElement("span", "system-service-row");

      card.type = "button";
      card.dataset.guideShipId = guideShip.id;
      card.setAttribute("aria-label", "Åbn " + guideShip.name);

      image.src = guideShip.image || "assets/cockpit-panel.svg";
      image.alt = "";
      visual.appendChild(image);

      titleWrap.appendChild(title);
      titleWrap.appendChild(role);
      header.appendChild(titleWrap);
      header.appendChild(status);

      guideShip.modes.slice(0, 5).forEach(function (mode) {
        modeRow.appendChild(createElement("span", "system-service-tag", mode.title));
      });

      copy.appendChild(header);
      copy.appendChild(summary);
      copy.appendChild(modeRow);
      card.appendChild(visual);
      card.appendChild(copy);
      elements.shipGuideItemList.appendChild(card);
    });
  }

  function getFilteredPurchaseItems(ship) {
    var query = normalize(state.purchaseQuery);
    var items = ship.purchaseItems || [];

    return items.filter(function (item) {
      var filterMatch = state.purchaseFilter === "all" || item.category === state.purchaseFilter || item.tags.indexOf(state.purchaseFilter) !== -1;
      if (!filterMatch) {
        return false;
      }

      if (!query) {
        return true;
      }

      var sellerText = item.sellers.map(function (seller) {
        return [seller.name, seller.price, seller.system, seller.updated].join(" ");
      }).join(" ");

      var searchable = [
        item.name,
        item.manufacturer,
        item.role,
        item.category,
        item.scu,
        item.note,
        sellerText
      ].concat(item.tags).join(" ");

      return normalize(searchable).indexOf(query) !== -1;
    });
  }

  function renderPurchaseDirectory(ship) {
    var isPurchase = ship && ship.type === "purchase-reference";
    elements.purchaseDirectory.hidden = !isPurchase;

    if (!isPurchase) {
      elements.purchaseItemList.textContent = "";
      return;
    }

    var items = getFilteredPurchaseItems(ship);
    elements.purchaseItemList.textContent = "";

    if (!items.length) {
      elements.purchaseItemList.appendChild(createElement("p", "empty-state", "Ingen køb matcher søgningen."));
      return;
    }

    items.forEach(function (item) {
      var card = createElement("article", "purchase-item");
      var header = createElement("div", "purchase-item-header");
      var titleWrap = createElement("div");
      var title = createElement("a", "purchase-item-title", item.name);
      var meta = createElement("div", "purchase-item-meta", item.manufacturer + " · " + item.role);
      var pill = createElement("span", "purchase-price-pill", item.sellers.length ? item.sellers[0].price : "No price");
      var sellerList = createElement("div", "purchase-seller-list");
      var tags = createElement("div", "system-service-row");

      title.href = item.url;
      title.target = "_blank";
      title.rel = "noopener noreferrer";

      titleWrap.appendChild(title);
      titleWrap.appendChild(meta);
      header.appendChild(titleWrap);
      header.appendChild(pill);

      item.sellers.slice(0, 5).forEach(function (seller) {
        var row = createElement("div", "purchase-seller-row");
        var sellerCopy = createElement("div");
        sellerCopy.appendChild(createElement("span", "purchase-seller-name", seller.name));
        sellerCopy.appendChild(createElement("span", "purchase-seller-system", [seller.system, seller.updated ? "updated " + seller.updated : ""].filter(Boolean).join(" · ")));
        row.appendChild(sellerCopy);
        row.appendChild(createElement("span", "purchase-seller-price", seller.price));
        sellerList.appendChild(row);
      });

      item.tags.slice(0, 6).forEach(function (tag) {
        tags.appendChild(createElement("span", "system-service-tag", tag));
      });

      card.appendChild(header);
      if (item.scu) {
        card.appendChild(createElement("p", "purchase-scu", "Cargo / capacity: " + item.scu));
      }
      if (item.note) {
        card.appendChild(createElement("p", "system-location-detail", item.note));
      }
      card.appendChild(sellerList);
      card.appendChild(tags);

      elements.purchaseItemList.appendChild(card);
    });
  }

  function getFilteredLoadoutShips(ship) {
    var query = normalize(state.loadoutQuery);
    var items = ship.loadoutShips || [];

    return items.filter(function (item) {
      var filterMatch = state.loadoutFilter === "all" || item.category === state.loadoutFilter || item.tags.indexOf(state.loadoutFilter) !== -1;
      if (!filterMatch) {
        return false;
      }

      if (!query) {
        return true;
      }

      var partText = item.parts.map(function (part) {
        return [part.slot, part.fit, part.buy, part.reason, part.warning].join(" ");
      }).join(" ");

      var searchable = [
        item.name,
        item.role,
        item.category,
        item.summary,
        partText
      ].concat(item.tags, item.notes).join(" ");

      return normalize(searchable).indexOf(query) !== -1;
    });
  }

  function renderLoadoutPart(part) {
    var row = createElement("div", "loadout-part-row");
    var copy = createElement("div");
    var slot = createElement("span", "loadout-slot", part.slot);
    var fit;

    if (part.url) {
      fit = createElement("a", "loadout-fit", part.fit);
      fit.href = part.url;
      fit.target = "_blank";
      fit.rel = "noopener noreferrer";
      fit.title = "Åbn live reference";
    } else {
      fit = createElement("span", "loadout-fit", part.fit);
    }

    copy.appendChild(slot);
    copy.appendChild(fit);
    copy.appendChild(createElement("p", "loadout-buy", part.buy));
    copy.appendChild(createElement("p", "loadout-reason", part.reason));

    if (part.warning) {
      copy.appendChild(createElement("p", "sale-warning", part.warning));
    }

    row.appendChild(copy);
    return row;
  }

  function renderLoadoutDirectory(ship) {
    var isLoadout = ship && ship.type === "loadout-reference";
    elements.loadoutDirectory.hidden = !isLoadout;

    if (!isLoadout) {
      elements.loadoutItemList.textContent = "";
      return;
    }

    var items = getFilteredLoadoutShips(ship);
    elements.loadoutItemList.textContent = "";

    if (!items.length) {
      elements.loadoutItemList.appendChild(createElement("p", "empty-state", "Ingen loadouts matcher søgningen."));
      return;
    }

    items.forEach(function (item) {
      var card = createElement("article", "loadout-item");
      var header = createElement("div", "loadout-item-header");
      var titleWrap = createElement("div");
      var title = createElement("h4", "loadout-item-title", item.name);
      var meta = createElement("div", "loadout-item-meta", item.role);
      var pill = createElement("span", "loadout-pill", item.category);
      var tags = createElement("div", "system-service-row");
      var partList = createElement("div", "loadout-part-list");

      titleWrap.appendChild(title);
      titleWrap.appendChild(meta);
      header.appendChild(titleWrap);
      header.appendChild(pill);

      item.parts.forEach(function (part) {
        partList.appendChild(renderLoadoutPart(part));
      });

      item.tags.slice(0, 6).forEach(function (tag) {
        tags.appendChild(createElement("span", "system-service-tag", tag));
      });

      card.appendChild(header);
      card.appendChild(createElement("p", "loadout-summary", item.summary));
      card.appendChild(partList);
      card.appendChild(tags);

      if (item.notes && item.notes.length) {
        var noteList = createElement("ul", "loadout-note-list");
        item.notes.slice(0, 3).forEach(function (note) {
          noteList.appendChild(createElement("li", null, note));
        });
        card.appendChild(noteList);
      }

      elements.loadoutItemList.appendChild(card);
    });
  }

  function renderProcedures(mode) {
    elements.flowTitle.textContent = mode.title;
    elements.procedureList.textContent = "";

    if (!mode.procedure.length) {
      elements.procedureList.appendChild(createElement("p", "empty-state", "Ingen flow-noter endnu."));
      return;
    }

    mode.procedure.forEach(function (step) {
      var item = createElement("li", "procedure-item");
      var copy = createElement("div");
      copy.appendChild(createElement("p", "procedure-title", step.title));
      copy.appendChild(createElement("p", "procedure-detail", step.detail));
      item.appendChild(copy);
      elements.procedureList.appendChild(item);
    });
  }

  function getModeKeybindSections(mode) {
    var sections = [];
    var keyGroups = mode.keyGroups || [];

    keyGroups.forEach(function (groupId) {
      var group = keybindGroups[groupId];
      if (!group || !group.items || !group.items.length) {
        return;
      }

      sections.push({
        title: group.title || groupId,
        items: group.items
      });
    });

    var modeSpecific = (mode.keybinds || []).filter(function (binding) {
      return binding.key;
    });

    if (modeSpecific.length) {
      sections.push({
        title: "Skibsspecifikt",
        items: modeSpecific
      });
    }

    return sections;
  }

  function renderKeybindItem(binding) {
    var item = createElement("div", "keybind-item");
    var copy = createElement("div");
    var key = createElement("kbd", null, binding.key);
    copy.appendChild(createElement("div", "keybind-action", binding.action));
    copy.appendChild(createElement("p", "keybind-context", binding.context));
    item.appendChild(copy);
    item.appendChild(key);
    return item;
  }

  function renderKeybinds(mode, ship) {
    var sections = getModeKeybindSections(mode);
    elements.keybindList.textContent = "";

    if (!sections.length) {
      var message = ship && ship.status !== "standard"
        ? "Ingen skibsspecifikke taster her. Brug Standard keys for flight, landing, quantum, power og combat defaults."
        : "Ingen taster registreret endnu.";
      elements.keybindList.appendChild(createElement("p", "empty-state", message));
      return;
    }

    sections.forEach(function (section) {
      var sectionElement = createElement("section", "keybind-section");
      sectionElement.appendChild(createElement("h4", "keybind-section-title", section.title));

      section.items.forEach(function (binding) {
        sectionElement.appendChild(renderKeybindItem(binding));
      });

      elements.keybindList.appendChild(sectionElement);
    });
  }

  function renderNotes(mode) {
    elements.noteList.textContent = "";

    if (!mode.notes.length) {
      elements.noteList.appendChild(createElement("p", "empty-state", "Ingen noter endnu."));
      return;
    }

    mode.notes.forEach(function (note) {
      var item = createElement("div", "note-item");
      item.appendChild(createElement("div", "note-title", note.title));
      item.appendChild(createElement("p", "note-body", note.body));
      elements.noteList.appendChild(item);
    });
  }

  function render() {
    var ship = findSelectedShip();
    if (!ship) {
      return;
    }

    if (ship.type === "system-reference") {
      getActiveSystemId(ship);
      if (!state.selectedModeId || !ship.modes.some(function (mode) { return mode.id === state.selectedModeId; })) {
        state.selectedModeId = state.systemId;
      }
    } else if (!state.selectedModeId || !ship.modes.some(function (mode) { return mode.id === state.selectedModeId; })) {
      state.selectedModeId = ship.modes[0].id;
    }

    var mode = findSelectedMode(ship);

    renderShipList();
    renderBrief(ship);
    renderQuickActions(ship);
    renderSaleInfo(ship);
    renderSystemDirectory(ship);
    renderShipGuideDirectory(ship);
    renderPurchaseDirectory(ship);
    renderLoadoutDirectory(ship);
    renderModeTabs(ship, mode);
    renderProcedures(mode);
    renderKeybinds(mode, ship);
    renderNotes(mode);
  }

  elements.shipList.addEventListener("click", function (event) {
    var button = event.target.closest("[data-ship-id]");
    if (!button) {
      return;
    }

    state.selectedShipId = button.dataset.shipId;
    state.selectedModeId = null;
    render();
  });

  elements.modeTabs.addEventListener("click", function (event) {
    var button = event.target.closest("[data-mode-id]");
    if (!button) {
      return;
    }

    var selectedShip = findSelectedShip();
    if (selectedShip && selectedShip.type === "system-reference" && (selectedShip.systemGroups || []).some(function (group) { return group.id === button.dataset.modeId; })) {
      state.systemId = button.dataset.modeId;
    }

    state.selectedModeId = button.dataset.modeId;
    render();
  });

  elements.systemSelectorList.addEventListener("click", function (event) {
    var button = event.target.closest("[data-system-id]");
    if (!button) {
      return;
    }

    state.systemId = button.dataset.systemId;
    state.selectedModeId = button.dataset.systemId;
    render();
  });

  elements.shipGuideItemList.addEventListener("click", function (event) {
    var button = event.target.closest("[data-guide-ship-id]");
    if (!button) {
      return;
    }

    state.selectedShipId = button.dataset.guideShipId;
    state.selectedModeId = null;
    render();
  });

  elements.filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      state.filter = button.dataset.filter;
      elements.filterButtons.forEach(function (filterButton) {
        filterButton.classList.toggle("is-active", filterButton === button);
      });
      renderShipList();
    });
  });

  elements.systemFilterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      state.systemFilter = button.dataset.systemFilter;
      elements.systemFilterButtons.forEach(function (filterButton) {
        filterButton.classList.toggle("is-active", filterButton === button);
      });
      renderSystemDirectory(findSelectedShip());
    });
  });

  elements.purchaseFilterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      state.purchaseFilter = button.dataset.purchaseFilter;
      elements.purchaseFilterButtons.forEach(function (filterButton) {
        filterButton.classList.toggle("is-active", filterButton === button);
      });
      renderPurchaseDirectory(findSelectedShip());
    });
  });

  elements.loadoutFilterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      state.loadoutFilter = button.dataset.loadoutFilter;
      elements.loadoutFilterButtons.forEach(function (filterButton) {
        filterButton.classList.toggle("is-active", filterButton === button);
      });
      renderLoadoutDirectory(findSelectedShip());
    });
  });

  elements.shipGuideFilterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      state.guideFilter = button.dataset.guideFilter;
      elements.shipGuideFilterButtons.forEach(function (filterButton) {
        filterButton.classList.toggle("is-active", filterButton === button);
      });
      renderShipGuideDirectory(findSelectedShip());
    });
  });

  elements.searchInput.addEventListener("input", function () {
    state.query = elements.searchInput.value;
    renderShipList();
  });

  elements.systemSearchInput.addEventListener("input", function () {
    state.systemQuery = elements.systemSearchInput.value;
    renderSystemDirectory(findSelectedShip());
  });

  elements.purchaseSearchInput.addEventListener("input", function () {
    state.purchaseQuery = elements.purchaseSearchInput.value;
    renderPurchaseDirectory(findSelectedShip());
  });

  elements.loadoutSearchInput.addEventListener("input", function () {
    state.loadoutQuery = elements.loadoutSearchInput.value;
    renderLoadoutDirectory(findSelectedShip());
  });

  elements.shipGuideSearchInput.addEventListener("input", function () {
    state.guideQuery = elements.shipGuideSearchInput.value;
    renderShipGuideDirectory(findSelectedShip());
  });

  elements.focusButton.addEventListener("click", function () {
    document.body.classList.toggle("is-focus");
  });

  elements.printButton.addEventListener("click", function () {
    window.print();
  });

  document.addEventListener("keydown", function (event) {
    if (event.target && ["INPUT", "TEXTAREA", "SELECT"].indexOf(event.target.tagName) !== -1) {
      return;
    }

    if (event.key >= "1" && event.key <= "9") {
      var index = Number(event.key) - 1;
      var navigationItems = getNavigationItems();
      if (navigationItems[index]) {
        state.selectedShipId = navigationItems[index].id;
        state.selectedModeId = null;
        render();
      }
    }
  });

  render();
})();
