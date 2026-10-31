const API_URL = "/api/items";

const tableBody = document.getElementById("itemsTable");
const itemModal = document.getElementById("itemModal");
const itemForm = document.getElementById("itemForm");
const messageBox = document.getElementById("message");
const searchInput = document.getElementById("searchInput");
let allItems = [];
let editingId = null;
let searchTimer = null;

function showMessage(message, type = "success") {
  messageBox.textContent = message;
  messageBox.className = `message show ${type}`;
  window.clearTimeout(showMessage.timer);
  showMessage.timer = window.setTimeout(() => {
    messageBox.className = "message";
  }, 3500);
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong.");
  return data;
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

function renderItems(items) {
  if (!items.length) {
    tableBody.innerHTML = `<tr><td colspan="5" class="empty-state">No items found. Add your first inventory item.</td></tr>`;
  } else {
    tableBody.innerHTML = items.map(item => {
      const quantity = Number(item.quantity);
      const status = quantity === 0
        ? '<span class="stock-status out-stock">Out of stock</span>'
        : quantity <= 5
          ? '<span class="stock-status low-stock">Low stock</span>'
          : '<span class="stock-status in-stock">In stock</span>';
      return `
        <tr>
          <td>${escapeHTML(item.name)}</td>
          <td><span class="category-tag">${escapeHTML(item.category || "General")}</span></td>
          <td><span class="quantity">${quantity}</span></td>
          <td>${status}</td>
          <td class="actions">
            <button class="action-button" data-action="edit" data-id="${escapeHTML(item._id)}">Edit</button>
            <button class="action-button delete" data-action="delete" data-id="${escapeHTML(item._id)}">Delete</button>
          </td>
        </tr>`;
    }).join("");
  }

  document.getElementById("totalItems").textContent = allItems.length;
  document.getElementById("totalQuantity").textContent = allItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  document.getElementById("lowStock").textContent = allItems.filter(item => Number(item.quantity) <= 5).length;
  document.getElementById("itemCount").textContent = `Showing ${items.length} ${items.length === 1 ? "item" : "items"}`;
}

async function loadItems(search = "") {
  tableBody.innerHTML = '<tr><td colspan="5" class="empty-state">Loading inventory...</td></tr>';
  try {
    const data = await apiRequest(`${API_URL}${search ? `?search=${encodeURIComponent(search)}` : ""}`);
    allItems = data.items || [];
    renderItems(allItems);
  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan="5" class="empty-state">${escapeHTML(error.message)}</td></tr>`;
    showMessage(error.message, "error");
  }
}

function openModal(item = null) {
  editingId = item ? item._id : null;
  document.getElementById("modalTitle").textContent = item ? "Edit item" : "Add new item";
  document.getElementById("saveButton").textContent = item ? "Update item" : "Save item";
  document.getElementById("itemName").value = item?.name || "";
  document.getElementById("itemCategory").value = item?.category || "";
  document.getElementById("itemQuantity").value = item ? item.quantity : "";
  itemModal.classList.remove("hidden");
  document.getElementById("itemName").focus();
}

function closeModal() {
  itemModal.classList.add("hidden");
  itemForm.reset();
  editingId = null;
}

document.getElementById("openAddButton").addEventListener("click", () => openModal());
document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("cancelModal").addEventListener("click", closeModal);
document.getElementById("refreshButton").addEventListener("click", () => loadItems(searchInput.value.trim()));
itemModal.addEventListener("click", event => {
  if (event.target === itemModal) closeModal();
});

itemForm.addEventListener("submit", async event => {
  event.preventDefault();
  const payload = {
    name: document.getElementById("itemName").value.trim(),
    category: document.getElementById("itemCategory").value.trim(),
    quantity: Number(document.getElementById("itemQuantity").value)
  };

  const saveButton = document.getElementById("saveButton");
  saveButton.disabled = true;
  saveButton.textContent = "Saving...";
  try {
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const method = editingId ? "PUT" : "POST";
    const result = await apiRequest(url, { method, body: JSON.stringify(payload) });
    closeModal();
    showMessage(result.message || "Saved successfully.");
    await loadItems(searchInput.value.trim());
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = editingId ? "Update item" : "Save item";
  }
});

tableBody.addEventListener("click", async event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const item = allItems.find(entry => entry._id === button.dataset.id);
  if (!item) return;

  if (button.dataset.action === "edit") {
    openModal(item);
    return;
  }

  if (button.dataset.action === "delete") {
    if (!window.confirm(`Delete "${item.name}" from your inventory?`)) return;
    button.disabled = true;
    try {
      const result = await apiRequest(`${API_URL}/${item._id}`, { method: "DELETE" });
      showMessage(result.message || "Item deleted.");
      await loadItems(searchInput.value.trim());
    } catch (error) {
      showMessage(error.message, "error");
      button.disabled = false;
    }
  }
});

searchInput.addEventListener("input", () => {
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => loadItems(searchInput.value.trim()), 250);
});

loadItems();
