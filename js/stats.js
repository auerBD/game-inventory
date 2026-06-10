/* =============================================================================
   stats.js — Stats Page Logic
   Reads the ITEMS array from data.js and dynamically builds the stats page.
   ============================================================================= */

document.addEventListener("DOMContentLoaded", function () {
    renderStatCards();
    renderBreakdownTable();
    renderRarityList();
});


/* =============================================================================
   STAT CARDS — summary numbers at the top
   ============================================================================= */

function renderStatCards() {
    const container = document.getElementById("stats-cards");

    const totalItems   = ITEMS.length;
    const totalStacks  = ITEMS.reduce(function (sum, item) { return sum + item.quantity; }, 0);
    const weaponCount  = ITEMS.filter(function (i) { return i.type === "weapon"; }).length;
    const rareOrBetter = ITEMS.filter(function (i) {
        return i.rarity === "rare" || i.rarity === "epic" || i.rarity === "legendary";
    }).length;

    const cards = [
        { value: totalItems,   label: "Unique Items" },
        { value: totalStacks,  label: "Total Stack Size" },
        { value: weaponCount,  label: "Weapons" },
        { value: rareOrBetter, label: "Rare or Better" }
    ];

    cards.forEach(function (card) {
        const li = document.createElement("li");
        li.classList.add("stat-card");

        const value = document.createElement("p");
        value.classList.add("stat-card__value");
        value.textContent = card.value;

        const label = document.createElement("p");
        label.classList.add("stat-card__label");
        label.textContent = card.label;

        li.appendChild(value);
        li.appendChild(label);
        container.appendChild(li);
    });
}


/* =============================================================================
   BREAKDOWN TABLE — items grouped by type
   ============================================================================= */

function renderBreakdownTable() {
    const wrapper = document.getElementById("stats-table-wrapper");

    /* Count items per type */
    const typeCounts = {};
    ITEMS.forEach(function (item) {
        if (!typeCounts[item.type]) {
            typeCounts[item.type] = { count: 0, totalQty: 0 };
        }
        typeCounts[item.type].count    += 1;
        typeCounts[item.type].totalQty += item.quantity;
    });

    /* Build table */
    const table = document.createElement("table");
    table.classList.add("stats-table");

    /* Table head */
    const thead = document.createElement("thead");
    thead.innerHTML =
        "<tr>" +
            "<th>Type</th>" +
            "<th>Unique Items</th>" +
            "<th>Total Quantity</th>" +
        "</tr>";
    table.appendChild(thead);

    /* Table body */
    const tbody = document.createElement("tbody");

    Object.keys(typeCounts).forEach(function (type) {
        const row = document.createElement("tr");
        const data = typeCounts[type];

        const tdType = document.createElement("td");
        tdType.textContent = type.charAt(0).toUpperCase() + type.slice(1);

        const tdCount = document.createElement("td");
        tdCount.textContent = data.count;

        const tdQty = document.createElement("td");
        tdQty.textContent = data.totalQty;

        row.appendChild(tdType);
        row.appendChild(tdCount);
        row.appendChild(tdQty);
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    wrapper.appendChild(table);
}


/* =============================================================================
   RARITY LIST — items grouped by rarity with color dots
   ============================================================================= */

function renderRarityList() {
    const list = document.getElementById("rarity-list");

    const rarityOrder  = ["common", "uncommon", "rare", "epic", "legendary"];
    const rarityColors = {
        common:    "var(--rarity-common)",
        uncommon:  "var(--rarity-uncommon)",
        rare:      "var(--rarity-rare)",
        epic:      "var(--rarity-epic)",
        legendary: "var(--rarity-legendary)"
    };

    rarityOrder.forEach(function (rarity) {
        const count = ITEMS.filter(function (i) { return i.rarity === rarity; }).length;
        if (count === 0) return;

        const li = document.createElement("li");
        li.classList.add("rarity-item");

        const dot = document.createElement("span");
        dot.classList.add("rarity-item__dot");
        dot.style.backgroundColor = rarityColors[rarity];

        const name = document.createElement("span");
        name.classList.add("rarity-item__name");
        name.textContent = rarity.charAt(0).toUpperCase() + rarity.slice(1);

        const countEl = document.createElement("span");
        countEl.classList.add("rarity-item__count");
        countEl.textContent = count + " item" + (count !== 1 ? "s" : "");

        li.appendChild(dot);
        li.appendChild(name);
        li.appendChild(countEl);
        list.appendChild(li);
    });
}