/* 
   Responsibilities:
     - Render item cards into the item pool from data.js
     - Create inventory slots dynamically
     - Handle item selection and detail panel
     - Handle item pool filter (by type)
     - Track and display slot usage counter
*/

/* -----------------------------------------------------------------------------
   CONSTANTS
   ----------------------------------------------------------------------------- */

const INVENTORY_ROWS = 5;
const INVENTORY_COLS = 6;
const TOTAL_SLOTS    = INVENTORY_ROWS * INVENTORY_COLS;  /* 30 slots */

/* Tracks which item is currently selected (for detail panel) */
let selectedItemId = null;


/* =============================================================================
   INIT — entry point, called once the DOM is fully loaded
   ============================================================================= */

document.addEventListener("DOMContentLoaded", function () {
    renderInventorySlots();
    renderItemPool(ITEMS);
    setupFilter();
    setupDetailClose();
    updateSlotCounter();
});


/* =============================================================================
   RENDER INVENTORY SLOTS
   ============================================================================= */

function renderInventorySlots() {
    const grid = document.getElementById("inventory-grid");

    for (let i = 0; i < TOTAL_SLOTS; i++) {
        const slot = createSlotElement(i);
        grid.appendChild(slot);
    }
}


function createSlotElement(index) {
    const slot = document.createElement("div");

    slot.classList.add("slot");
    slot.setAttribute("data-slot-index", index);

    return slot;
}


/* =============================================================================
   RENDER ITEM POOL
   ============================================================================= */

function renderItemPool(items) {
    const poolGrid = document.getElementById("item-pool-grid");

    poolGrid.innerHTML = "";

    if (items.length === 0) {
        const empty = document.createElement("li");
        empty.classList.add("item-pool__empty");
        empty.textContent = "No items found.";
        poolGrid.appendChild(empty);
        return;
    }

    items.forEach(function (item) {
        const listItem = document.createElement("li");
        const card     = createItemCard(item);

        listItem.appendChild(card);
        poolGrid.appendChild(listItem);
    });
}


/* =============================================================================
   CREATE ITEM CARD
   ============================================================================= */

function createItemCard(item) {
    const card = document.createElement("div");

    card.classList.add("item-card", "item-card--" + item.rarity);
    card.setAttribute("data-item-id", item.id);
    card.setAttribute("draggable", "true");
    card.addEventListener("dragstart", ziehen);

    /* --- Icon --- */
    const icon = document.createElement("span");
    icon.classList.add("item-card__icon");
    icon.textContent = item.emoji;
    card.appendChild(icon);

    /* --- Quantity badge (only if quantity > 1) --- */
    if (item.quantity > 1) {
        const qty = document.createElement("span");
        qty.classList.add("item-card__quantity");
        qty.textContent = item.quantity;
        card.appendChild(qty);
    }

    /* --- Star rating (only for weapons) --- */
    if (item.stars > 0) {
        const starsWrapper = document.createElement("span");
        starsWrapper.classList.add("item-card__stars");

        for (let i = 0; i < item.stars; i++) {
            const star = document.createElement("span");
            star.classList.add("item-card__star");
            star.textContent = "★";
            starsWrapper.appendChild(star);
        }

        card.appendChild(starsWrapper);
    }

    /* --- Click listener: show item detail panel --- */
    card.addEventListener("click", function () {
        showItemDetail(item);
    });

    return card;
}


/* =============================================================================
   ITEM DETAIL PANEL
   ============================================================================= */

function showItemDetail(item) {
    const panel       = document.getElementById("item-detail");
    const icon        = document.getElementById("item-detail-icon");
    const name        = document.getElementById("item-detail-name");
    const type        = document.getElementById("item-detail-type");
    const rarity      = document.getElementById("item-detail-rarity");
    const description = document.getElementById("item-detail-description");

    icon.textContent        = item.emoji;
    icon.alt                = item.name;
    name.textContent        = item.name;
    type.textContent        = item.type.charAt(0).toUpperCase() + item.type.slice(1);
    description.textContent = item.description;

    rarity.textContent = item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1);
    rarity.className   = "item-detail__rarity item-detail__rarity--" + item.rarity;

    /* Mark selected card visually */
    if (selectedItemId) {
        const prev = document.querySelector("[data-item-id='" + selectedItemId + "']");
        if (prev) prev.classList.remove("item-card--selected");
    }

    selectedItemId = item.id;
    const current = document.querySelector("[data-item-id='" + item.id + "']");
    if (current) current.classList.add("item-card--selected");

    panel.removeAttribute("hidden");
}


function hideItemDetail() {
    const panel = document.getElementById("item-detail");
    panel.setAttribute("hidden", "");

    if (selectedItemId) {
        const card = document.querySelector("[data-item-id='" + selectedItemId + "']");
        if (card) card.classList.remove("item-card--selected");
        selectedItemId = null;
    }
}


/* =============================================================================
   FILTER
   ============================================================================= */

function setupFilter() {
    const filterSelect = document.getElementById("item-filter");

    filterSelect.addEventListener("change", function () {
        const selectedType = filterSelect.value;

        if (selectedType === "all") {
            renderItemPool(ITEMS);
        } else {
            const filtered = ITEMS.filter(function (item) {
                return item.type === selectedType;
            });
            renderItemPool(filtered);
        }
    });
}


/* =============================================================================
   SLOT COUNTER
   ============================================================================= */

function updateSlotCounter() {
    const usedCount  = document.getElementById("slot-used-count");
    const totalCount = document.getElementById("slot-total-count");

    const occupiedSlots = document.querySelectorAll(".slot--occupied").length;

    usedCount.textContent  = occupiedSlots;
    totalCount.textContent = TOTAL_SLOTS;
}


/* =============================================================================
   DETAIL CLOSE BUTTON
   ============================================================================= */

function setupDetailClose() {
    const closeBtn = document.getElementById("item-detail-close");

    closeBtn.addEventListener("click", function () {
        hideItemDetail();
    });
}


/* =============================================================================
   PUBLIC HELPERS
   ============================================================================= */

function markSlotOccupied(slotElement) {
    slotElement.classList.add("slot--occupied");
    updateSlotCounter();
}

function markSlotEmpty(slotElement) {
    slotElement.classList.remove("slot--occupied");
    updateSlotCounter();
}