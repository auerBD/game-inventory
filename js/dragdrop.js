    function ziehen(ev) {
      // Walk up to the card element to get the item ID
      const card = ev.target.closest("[data-item-id]");
      if (card) {
        ev.dataTransfer.setData("text", card.getAttribute("data-item-id"));
      }
    }

    function ablegenErlauben(ev) {
      ev.preventDefault();
    }

    function ablegen(ev) {
      ev.preventDefault();
      const itemId = ev.dataTransfer.getData("text");
      const card = document.querySelector("[data-item-id='" + itemId + "']");
      if (!card) return;

      // Find the closest valid drop target: a .slot or the item-pool grid
      const slot = ev.target.closest(".slot");
      const pool = ev.target.closest("#item-pool-grid");

      if (slot) {
        // Only one card per slot
        if (!slot.querySelector("[data-item-id]")) {
          const parentLi = card.parentElement;
          if (parentLi && parentLi.tagName === "LI") {
            parentLi.remove();
          }
          slot.appendChild(card);
          markSlotOccupied(slot);

        }
      } else if (pool) {
        // Dropping back into the pool — wrap in <li>
        const li = document.createElement("li");
        li.appendChild(card);
        pool.appendChild(li);

        // If card came from a slot, mark that slot empty
        const oldSlot = card.closest ? null : null; // handled below
      }

      updateSlotCounter();
    }