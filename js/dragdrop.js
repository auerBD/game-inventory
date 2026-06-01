/* =============================================================================
   dragdrop.js — JS Special Task 12
   Drag-and-Drop Interface (DOM-Elemente verschieben)

   This file handles ALL drag & drop logic.
   It uses functions from inventory.js (createItemCard, getItemById,
   markSlotOccupied, markSlotEmpty) but does NOT modify any other file.

   Flow:
     1. User drags an item card (from pool OR from a slot)
     2. Card is dragged over a target slot → visual feedback
     3. User drops:
        a) onto empty slot  → item moves there
        b) onto filled slot → items swap positions
        c) back onto pool   → item returns to pool, slot cleared

   Event delegation is used throughout so it works for
   dynamically created cards (rendered by inventory.js).
   ============================================================================= */


/* -----------------------------------------------------------------------------
   MODULE STATE
   These variables track what is being dragged and where it came from.
   ----------------------------------------------------------------------------- */

let draggedItemId     = null;   /* ID of the item currently being dragged */
let dragSourceSlot    = null;   /* slot element the drag started from (null if from pool) */
let dragSourceCard    = null;   /* the actual card element being dragged */
let dragOverSlot      = null;   /* slot currently under the cursor — for cleanup */


/* =============================================================================
   INIT — attach all drag & drop event listeners after the DOM is ready
   ============================================================================= */

document.addEventListener("DOMContentLoaded", function () {
    setupDragAndDrop();
});


function setupDragAndDrop() {
    const inventoryGrid = document.getElementById("inventory-grid");
    const itemPoolGrid  = document.getElementById("item-pool-grid");

    /* --- Drag START & END (delegated on document, catches dynamically added cards) --- */
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("dragend",   handleDragEnd);

    /* --- Inventory grid: drop target events --- */
    inventoryGrid.addEventListener("dragover",  handleSlotDragOver);
    inventoryGrid.addEventListener("dragenter", handleSlotDragEnter);
    inventoryGrid.addEventListener("dragleave", handleSlotDragLeave);
    inventoryGrid.addEventListener("drop",      handleSlotDrop);

    /* --- Item pool: allow dragging items back --- */
    itemPoolGrid.addEventListener("dragover",  handlePoolDragOver);
    itemPoolGrid.addEventListener("drop",      handlePoolDrop);
}


/* =============================================================================
   DRAG START
   Fires when the user begins dragging an item card.
   Stores the item ID and the source slot (if dragging from inventory).
   ============================================================================= */

function handleDragStart(event) {
    const card = event.target.closest(".item-card");
    if (!card) return;

    draggedItemId  = card.getAttribute("data-item-id");
    dragSourceSlot = card.closest(".slot") || null;
    dragSourceCard = card;  /* null = dragged from pool */

    /* Store ID in dataTransfer for cross-browser support */
    event.dataTransfer.setData("text/plain", draggedItemId);
    event.dataTransfer.effectAllowed = "move";

    /* Slight delay so the card doesn't disappear before drag ghost renders */
    setTimeout(function () {
        card.classList.add("item-card--dragging");
    }, 0);
}


/* =============================================================================
   DRAG END
   Always fires when a drag operation ends (drop or cancelled).
   Cleans up all visual drag states.
   ============================================================================= */

function handleDragEnd(event) {
    const card = event.target.closest(".item-card");
    if (card) {
        card.classList.remove("item-card--dragging");
    }

    /* Remove drag-over highlight from any lingering slot */
    if (dragOverSlot) {
        dragOverSlot.classList.remove("slot--drag-over");
        dragOverSlot = null;
    }

    draggedItemId  = null;
    dragSourceSlot = null;
    dragSourceCard = null;
}


/* =============================================================================
   SLOT — DRAG OVER
   Must call preventDefault() to allow dropping onto this element.
   ============================================================================= */

function handleSlotDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}


/* =============================================================================
   SLOT — DRAG ENTER
   Highlights the slot the user is hovering over.
   Uses closest() so child elements (item cards inside slots) don't interfere.
   ============================================================================= */

function handleSlotDragEnter(event) {
    event.preventDefault();
    const slot = event.target.closest(".slot");
    if (!slot || slot === dragSourceSlot) return;

    /* Remove highlight from previous slot */
    if (dragOverSlot && dragOverSlot !== slot) {
        dragOverSlot.classList.remove("slot--drag-over");
    }

    dragOverSlot = slot;
    slot.classList.add("slot--drag-over");
}


/* =============================================================================
   SLOT — DRAG LEAVE
   Removes the highlight when the cursor leaves a slot.
   Checks relatedTarget to avoid flickering when moving over child elements.
   ============================================================================= */

function handleSlotDragLeave(event) {
    const slot = event.target.closest(".slot");
    if (!slot) return;

    /* Only remove if leaving the slot entirely, not just entering a child */
    const stillInside = slot.contains(event.relatedTarget);
    if (!stillInside) {
        slot.classList.remove("slot--drag-over");
        if (dragOverSlot === slot) {
            dragOverSlot = null;
        }
    }
}


/* =============================================================================
   SLOT — DROP
   The main drop handler. Three cases:
     a) Drop onto empty slot   → move item there
     b) Drop onto filled slot  → swap items
     c) Drop onto source slot  → do nothing (no-op)
   ============================================================================= */

function handleSlotDrop(event) {
    event.preventDefault();

    const targetSlot = event.target.closest(".slot");
    if (!targetSlot) return;

    /* Clean up visual state */
    targetSlot.classList.remove("slot--drag-over");
    dragOverSlot = null;

    /* No-op: dropped back onto the same slot it came from */
    if (targetSlot === dragSourceSlot) return;

    const itemId   = event.dataTransfer.getData("text/plain");
    const item     = getItemById(itemId);
    if (!item) return;

    const existingCard = targetSlot.querySelector(".item-card");

    if (!existingCard) {
        /* ── Case A: Empty slot → just move the card ── */
        moveCardToSlot(item, targetSlot);

    } else {
        /* ── Case B: Occupied slot → swap ── */
        const displacedItemId = existingCard.getAttribute("data-item-id");
        const displacedItem   = getItemById(displacedItemId);

        /* Move dragged item into target slot */
        moveCardToSlot(item, targetSlot);

        /* Move displaced item back to where the drag started */
        if (dragSourceSlot) {
            /* Dragged from a slot → put displaced item there */
            moveCardToSlot(displacedItem, dragSourceSlot);
        } else {
            /* Dragged from pool → put displaced item back in pool */
            returnCardToPool(displacedItem);
        }
    }

    /* ── Remove original card from its source ── */
    if (dragSourceSlot) {
        /* Source was a slot: clear it if Case A (Case B already filled it via swap) */
        if (!dragSourceSlot.querySelector(".item-card")) {
            markSlotEmpty(dragSourceSlot);
        } else if (dragSourceSlot !== targetSlot) {
            /* Case A: source slot still has the old card — remove it */
            dragSourceSlot.innerHTML = "";
            markSlotEmpty(dragSourceSlot);
        }
    } else {
        /* Source was the pool: remove the <li> wrapper of the dragged card */
        const poolListItem = dragSourceCard && dragSourceCard.closest("li");
        if (poolListItem) {
            poolListItem.remove();
        }
    }
}


/* =============================================================================
   POOL — DRAG OVER
   Allows items to be dragged back into the item pool from inventory slots.
   ============================================================================= */

function handlePoolDragOver(event) {
    /* Only allow drop if item is coming from a slot (not from pool itself) */
    if (dragSourceSlot) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }
}


/* =============================================================================
   POOL — DROP
   Returns an item from an inventory slot back to the item pool.
   ============================================================================= */

function handlePoolDrop(event) {
    event.preventDefault();
    if (!dragSourceSlot) return;   /* was already in pool, ignore */

    const itemId = event.dataTransfer.getData("text/plain");
    const item   = getItemById(itemId);
    if (!item) return;

    returnCardToPool(item);

    /* Clear and mark source slot empty */
    dragSourceSlot.innerHTML = "";
    markSlotEmpty(dragSourceSlot);
}


/* =============================================================================
   HELPERS
   ============================================================================= */

/* Moves an item card into a slot, replacing whatever was there */
function moveCardToSlot(item, slotElement) {
    const newCard = createItemCard(item);

    slotElement.innerHTML = "";         /* clear slot */
    slotElement.appendChild(newCard);
    markSlotOccupied(slotElement);
}

/* Appends a new item card back into the item pool list */
function returnCardToPool(item) {
    const poolGrid = document.getElementById("item-pool-grid");
    const listItem = document.createElement("li");
    const card     = createItemCard(item);

    listItem.appendChild(card);
    poolGrid.appendChild(listItem);
}