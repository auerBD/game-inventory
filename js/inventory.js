/* =============================================================================
   inventory.js — DOM Rendering & Inventory Logic
   
   Responsibilities:
     - Render item cards into the item pool from data.js
     - Create inventory slots dynamically
     - Handle item selection and detail panel
     - Handle item pool filter (by type)
     - Track and display slot usage counter
   
   Does NOT handle drag & drop — that lives in dragdrop.js
   ============================================================================= */


/* -----------------------------------------------------------------------------
   CONSTANTS
   ----------------------------------------------------------------------------- */

const INVENTORY_ROWS    = 5;
const INVENTORY_COLS    = 6;
const TOTAL_SLOTS       = INVENTORY_ROWS * INVENTORY_COLS;  /* 30 slots */

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
   Creates TOTAL_SLOTS empty slot elements and appends them to the grid.
   Each slot gets a unique data-slot-index attribute for drag & drop targeting.
   ============================================================================= */

function renderInventorySlots() {
    const grid = document.getElementById("inventory-grid");

    for (let i = 0; i < TOTAL_SLOTS; i++) {
        const slot = createSlotElement(i);
        grid.appendChild(slot);
    }
}


/* -----------------------------------------------------------------------------
   Creates and returns a single slot <div> element.
   @param {number} index — the slot's position index (0 to TOTAL_SLOTS - 1)
   @returns {HTMLElement}
   ----------------------------------------------------------------------------- */

function createSlotElement(index) {
    const slot = document.createElement("div");

    slot.classList.add("slot");
    slot.setAttribute("data-slot-index", index);
    slot.setAttribute("role", "gridcell");
    slot.setAttribute("tabindex", "0");
    slot.setAttribute("aria-label", "Empty inventory slot " + (index + 1));

    return slot;
}


/* =============================================================================
   RENDER ITEM POOL
   Takes an array of items, creates a card for each, and renders them into
   the item pool grid. Clears existing cards first (used by filter too).
   
   @param {Array} items — array of item objects from ITEMS (data.js)
   ============================================================================= */

function renderItemPool(items) {
    const poolGrid = document.getElementById("item-pool-grid");

    /* Clear existing cards before re-rendering (needed for filter) */
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
   Builds a complete item card element from an item object.
   This function is also used by dragdrop.js when dropping an item into a slot.
   
   @param  {Object}      item — item object from ITEMS array
   @returns {HTMLElement} the finished .item-card element
   ============================================================================= */

function createItemCard(item) {
    const card = document.createElement("div");

    /* Base classes */
    card.classList.add("item-card", "item-card--" + item.rarity);

    /* Data attributes — used by drag & drop and detail panel */
    card.setAttribute("data-item-id",   item.id);
    card.setAttribute("draggable",      "true");
    card.setAttribute("tabindex",       "0");
    card.setAttribute("aria-label",     item.name + ", " + item.rarity + " " + item.type);

    /* --- Icon (emoji rendered as text) --- */
    const icon = document.createElement("span");
    icon.classList.add("item-card__icon");
    icon.setAttribute("aria-hidden", "true");
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
        starsWrapper.setAttribute("aria-label", item.stars + " stars");

        for (let i = 0; i < item.stars; i++) {
            const star = document.createElement("span");
            star.classList.add("item-card__star");
            star.setAttribute("aria-hidden", "true");
            star.textContent = "★";
            starsWrapper.appendChild(star);
        }

        card.appendChild(starsWrapper);
    }

    /* --- Click listener: show item detail panel --- */
    card.addEventListener("click", function () {
        showItemDetail(item);
    });

    /* --- Keyboard: Enter or Space also opens detail panel --- */
    card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            showItemDetail(item);
        }
    });

    return card;
}


/* =============================================================================
   ITEM DETAIL PANEL
   Populates the detail panel with item data and makes it visible.
   
   @param {Object} item — item object from ITEMS array
   ============================================================================= */

function showItemDetail(item) {
    const panel       = document.getElementById("item-detail");
    const icon        = document.getElementById("item-detail-icon");
    const name        = document.getElementById("item-detail-name");
    const type        = document.getElementById("item-detail-type");
    const rarity      = document.getElementById("item-detail-rarity");
    const description = document.getElementById("item-detail-description");

    /* Populate fields */
    icon.textContent  = item.emoji;        /* emoji instead of src */
    icon.alt          = item.name;
    name.textContent  = item.name;
    type.textContent  = item.type.charAt(0).toUpperCase() + item.type.slice(1);
    description.textContent = item.description;

    /* Rarity label with color class */
    rarity.textContent = item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1);
    rarity.className   = "item-detail__rarity item-detail__rarity--" + item.rarity;

    /* Mark selected card visually */
    if (selectedItemId) {
        const prev = document.querySelector("[data-item-id='" + selectedItemId + "']");
        if (prev) {
            prev.classList.remove("item-card--selected");
        }
    }

    selectedItemId = item.id;
    const current = document.querySelector("[data-item-id='" + item.id + "']");
    if (current) {
        current.classList.add("item-card--selected");
    }

    /* Show panel (remove the hidden attribute) */
    panel.removeAttribute("hidden");
}


/* -----------------------------------------------------------------------------
   Hides the detail panel and deselects the current item.
   ----------------------------------------------------------------------------- */

function hideItemDetail() {
    const panel = document.getElementById("item-detail");
    panel.setAttribute("hidden", "");

    if (selectedItemId) {
        const card = document.querySelector("[data-item-id='" + selectedItemId + "']");
        if (card) {
            card.classList.remove("item-card--selected");
        }
        selectedItemId = null;
    }
}


/* =============================================================================
   FILTER — filters the item pool by type using the <select> element
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
   SLOT COUNTER — updates the "X / 30 Slots" display in the inventory header
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

    /* Also close with Escape key */
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            hideItemDetail();
        }
    });
}


/* =============================================================================
   PUBLIC HELPERS
   These functions are called by dragdrop.js to keep logic cleanly separated.
   ============================================================================= */

/* Returns the item object for a given item ID */
function getItemById(id) {
    return ITEMS.find(function (item) {
        return item.id === id;
    });
}

/* Marks a slot as occupied and updates the counter */
function markSlotOccupied(slotElement) {
    slotElement.classList.add("slot--occupied");
    slotElement.setAttribute("aria-label", "Occupied inventory slot");
    updateSlotCounter();
}

/* Marks a slot as empty and updates the counter */
function markSlotEmpty(slotElement) {
    slotElement.classList.remove("slot--occupied");
    slotElement.setAttribute("aria-label", "Empty inventory slot");
    updateSlotCounter();
}
