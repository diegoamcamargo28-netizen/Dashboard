/* =========================================================
   DATOS DE EJEMPLO - GALLETAS 🍪
   ---------------------------------------------------------
   TODO: Reemplazar con llamadas a API o base de datos
   ========================================================= */

// KPIs Financieros
const KPI_DATA = {
  income:  { value: 2850000, change: 15.4, direction: "up"   },
  expense: { value: 1130000, change: -8.2, direction: "down" },
  profit:  { value: 1720000, change: 22.7, direction: "up"   },
  balance: { value: 3420000, change: 12.1, direction: "up"   }
};

// Datos para gráfico de línea (últimos 6 meses)
const MONTHLY_DATA = {
  labels: ["Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre"],
  income:  [1800000, 2100000, 2300000, 2150000, 2600000, 2850000],
  expense: [900000, 1100000, 950000, 1200000, 1050000, 1130000]
};

// Categorías de gastos
const EXPENSE_CATEGORIES = {
  labels: ["Ingredientes", "Empaque", "Servicios", "Transporte", "Otros"],
  data:   [480000, 280000, 180000, 120000, 60000]
};

// Inventario de Ingredientes
let INGREDIENTS = [
  { id: 1, name: "Harina de trigo", quantity: 25, unit: "Kg", price: 2500, date: "2025-10-15" },
  { id: 2, name: "Azúcar blanca", quantity: 18, unit: "Kg", price: 3200, date: "2025-10-16" },
  { id: 3, name: "Mantequilla", quantity: 12, unit: "Kg", price: 8500, date: "2025-10-14" },
  { id: 4, name: "Huevos", quantity: 144, unit: "unidades", price: 300, date: "2025-10-18" },
  { id: 5, name: "Vainilla", quantity: 2, unit: "L", price: 12000, date: "2025-10-10" },
  { id: 6, name: "Chips de chocolate", quantity: 5, unit: "Kg", price: 18000, date: "2025-10-17" }
];

// Movimientos de Dinero
let MOVEMENTS = [
  { id: 1, date: "2025-10-28", description: "Venta galletas chocolate (50 unidades)", type: "income", category: "sales", amount: 450000, status: "paid" },
  { id: 2, date: "2025-10-27", description: "Compra ingredientes - proveedor local", type: "expense", category: "ingredients", amount: 280000, status: "paid" },
  { id: 3, date: "2025-10-26", description: "Venta online - 30 paquetes", type: "income", category: "sales", amount: 600000, status: "pending" },
  { id: 4, date: "2025-10-25", description: "Compra empaque y bolsas", type: "expense", category: "packaging", amount: 120000, status: "paid" },
  { id: 5, date: "2025-10-24", description: "Servicio internet y electricidad", type: "expense", category: "utilities", amount: 95000, status: "paid" },
  { id: 6, date: "2025-10-22", description: "Venta local tienda - 15 kg galletas", type: "income", category: "sales", amount: 350000, status: "overdue" },
  { id: 7, date: "2025-10-20", description: "Transporte de productos", type: "expense", category: "transportation", amount: 85000, status: "paid" }
];

/* =========================================================
   UTILIDADES
   ========================================================= */

function formatCurrency(value) {
  return "$ " + value.toLocaleString("es-CL");
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });
}

function getStockStatus(quantity) {
  if (quantity < 5) return { status: "low", label: "Bajo" };
  if (quantity < 15) return { status: "medium", label: "Medio" };
  return { status: "high", label: "Suficiente" };
}

function getCurrentDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/* =========================================================
   RENDERIZADO DE KPIs
   ========================================================= */
function renderKPIs() {
  const grid = document.getElementById("kpiGrid");
  const cards = [
    { key: "income",  label: "Ingresos del mes", icon: "📈", cls: "income"  },
    { key: "expense", label: "Gastos del mes",   icon: "📉", cls: "expense" },
    { key: "profit",  label: "Ganancia neta",    icon: "💰", cls: "profit"  },
    { key: "balance", label: "Monto en caja",    icon: "🏦", cls: "balance" }
  ];

  grid.innerHTML = cards.map(c => {
    const d = KPI_DATA[c.key];
    const sign = d.direction === "up" ? "▲" : "▼";
    return `
      <div class="kpi-card">
        <div class="kpi-icon ${c.cls}">${c.icon}</div>
        <div>
          <div class="kpi-label">${c.label}</div>
          <div class="kpi-value">${formatCurrency(d.value)}</div>
          <div class="kpi-change ${d.direction}">
            ${sign} ${Math.abs(d.change)}% vs mes anterior
          </div>
        </div>
      </div>
    `;
  }).join("");
}

/* =========================================================
   RENDERIZADO DE INVENTARIO
   ========================================================= */
function renderInventory() {
  const tbody = document.getElementById("inventoryTable");

  tbody.innerHTML = INGREDIENTS.map(ing => {
    const stock = getStockStatus(ing.quantity);
    const totalValue = ing.quantity * ing.price;
    return `
      <tr>
        <td>${ing.name}</td>
        <td>${ing.quantity}</td>
        <td>${ing.unit}</td>
        <td>${formatCurrency(ing.price)}</td>
        <td><strong>${formatCurrency(totalValue)}</strong></td>
        <td><span class="status-badge ${stock.status}">${stock.label}</span></td>
        <td>
          <button class="btn-danger" onclick="deleteIngredient(${ing.id})">Eliminar</button>
        </td>
      </tr>
    `;
  }).join("");
}

/* =========================================================
   RENDERIZADO DE MOVIMIENTOS
   ========================================================= */
function renderMovements() {
  const tbody = document.getElementById("movementsTable");
  const statusMap = {
    paid:    { label: "Pagado",   cls: "paid"    },
    pending: { label: "Pendiente",cls: "pending" },
    overdue: { label: "Vencido",  cls: "overdue" }
  };
  const typeMap = {
    income:  { label: "Ingreso", cls: "income"  },
    expense: { label: "Egreso",  cls: "expense" }
  };

  tbody.innerHTML = MOVEMENTS.map(m => {
    const s = statusMap[m.status];
    const t = typeMap[m.type];
    const prefix = m.type === "income" ? "+ " : "- ";
    return `
      <tr>
        <td>${formatDate(m.date)}</td>
        <td>${m.description}</td>
        <td>${m.category}</td>
        <td><span class="type-pill ${t.cls}">${t.label}</span></td>
        <td class="amount ${m.type}">${prefix}${formatCurrency(m.amount)}</td>
        <td><span class="badge ${s.cls}">${s.label}</span></td>
        <td>
          <button class="btn-danger" onclick="deleteMovement(${m.id})">Eliminar</button>
        </td>
      </tr>
    `;
  }).join("");
}

/* =========================================================
   RESUMEN FINANCIERO MENSUAL
   ========================================================= */
function renderMonthlySummary() {
  const incomesDiv = document.getElementById("monthlyIncomesSummary");
  const expensesDiv = document.getElementById("monthlyExpensesSummary");

  const totalIncomes = MOVEMENTS
    .filter(m => m.type === "income")
    .reduce((sum, m) => sum + m.amount, 0);

  const totalExpenses = MOVEMENTS
    .filter(m => m.type === "expense")
    .reduce((sum, m) => sum + m.amount, 0);

  const incomesDetail = MOVEMENTS
    .filter(m => m.type === "income")
    .slice(0, 3);

  const expensesDetail = MOVEMENTS
    .filter(m => m.type === "expense")
    .slice(0, 3);

  incomesDiv.innerHTML = `
    <div class="account-item" style="padding: 20px 0; border: none;">
      <div>
        <div style="font-size: 24px; font-weight: 700; color: var(--color-success);">
          ${formatCurrency(totalIncomes)}
        </div>
        <div style="font-size: 12px; color: var(--color-text-muted); margin-top: 4px;">
          Total ingresos registrados
        </div>
      </div>
    </div>
    ${incomesDetail.map(m => `
      <div class="account-item">
        <div class="account-info">
          <div class="name">${m.description}</div>
          <div class="date">${formatDate(m.date)}</div>
        </div>
        <div class="account-amount receivable">+${formatCurrency(m.amount)}</div>
      </div>
    `).join("")}
  `;

  expensesDiv.innerHTML = `
    <div class="account-item" style="padding: 20px 0; border: none;">
      <div>
        <div style="font-size: 24px; font-weight: 700; color: var(--color-danger);">
          ${formatCurrency(totalExpenses)}
        </div>
        <div style="font-size: 12px; color: var(--color-text-muted); margin-top: 4px;">
          Total gastos registrados
        </div>
      </div>
    </div>
    ${expensesDetail.map(m => `
      <div class="account-item">
        <div class="account-info">
          <div class="name">${m.description}</div>
          <div class="date">${formatDate(m.date)}</div>
        </div>
        <div class="account-amount payable">-${formatCurrency(m.amount)}</div>
      </div>
    `).join("")}
  `;
}

/* =========================================================
   GRÁFICOS (Chart.js)
   ========================================================= */
let lineChartInstance = null;
let doughnutChartInstance = null;

function renderLineChart() {
  const ctx = document.getElementById("lineChart").getContext("2d");
  if (lineChartInstance) lineChartInstance.destroy();

  lineChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: MONTHLY_DATA.labels,
      datasets: [
        {
          label: "Ingresos",
          data: MONTHLY_DATA.income,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.35,
          fill: true,
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: "#10b981"
        },
        {
          label: "Gastos",
          data: MONTHLY_DATA.expense,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.08)",
          tension: 0.35,
          fill: true,
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: "#ef4444"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top", labels: { usePointStyle: true, boxWidth: 8 } },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}`
          }
        }
      },
      scales: {
        y: {
          ticks: {
            callback: (v) => "$ " + (v / 1000000).toFixed(1) + "M"
          },
          grid: { color: "#f1f5f9" }
        },
        x: { grid: { display: false } }
      }
    }
  });
}

function renderDoughnutChart() {
  const ctx = document.getElementById("doughnutChart").getContext("2d");
  if (doughnutChartInstance) doughnutChartInstance.destroy();

  doughnutChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: EXPENSE_CATEGORIES.labels,
      datasets: [{
        data: EXPENSE_CATEGORIES.data,
        backgroundColor: [
          "#d97706", // Ingredientes
          "#f59e0b", // Empaque
          "#10b981", // Servicios
          "#8b5cf6", // Transporte
          "#6b7280"  // Otros
        ],
        borderWidth: 0,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "65%",
      plugins: {
        legend: {
          position: "bottom",
          labels: { usePointStyle: true, boxWidth: 8, padding: 12, font: { size: 12 } }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.parsed)}`
          }
        }
      }
    }
  });
}

/* =========================================================
   GESTIÓN DE MODALES
   ========================================================= */
function openModal(modalId) {
  document.getElementById(modalId).classList.add("show");
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("show");
}

function setupModalHandlers() {
  // Modal de Ingredientes
  document.getElementById("btnAddIngredient").addEventListener("click", () => {
    openModal("ingredientModal");
  });

  document.getElementById("closeIngredientModal").addEventListener("click", () => {
    closeModal("ingredientModal");
  });

  document.getElementById("cancelIngredientForm").addEventListener("click", () => {
    closeModal("ingredientModal");
  });

  // Modal de Movimientos
  document.getElementById("btnAddMovement").addEventListener("click", () => {
    document.getElementById("movementDate").valueAsDate = new Date();
    openModal("movementModal");
  });

  document.getElementById("closeMovementModal").addEventListener("click", () => {
    closeModal("movementModal");
  });

  document.getElementById("cancelMovementForm").addEventListener("click", () => {
    closeModal("movementModal");
  });

  // Cerrar modales al hacer clic fuera
  window.addEventListener("click", (event) => {
    const ingredientModal = document.getElementById("ingredientModal");
    const movementModal = document.getElementById("movementModal");
    if (event.target === ingredientModal) closeModal("ingredientModal");
    if (event.target === movementModal) closeModal("movementModal");
  });
}

/* =========================================================
   FORMULARIOS - AGREGAR INGREDIENTE
   ========================================================= */
function setupIngredientForm() {
  document.getElementById("ingredientForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("ingredientName").value;
    const quantity = parseFloat(document.getElementById("ingredientQuantity").value);
    const unit = document.getElementById("ingredientUnit").value;
    const price = parseFloat(document.getElementById("ingredientPrice").value);

    const newId = Math.max(...INGREDIENTS.map(ing => ing.id), 0) + 1;
    INGREDIENTS.push({
      id: newId,
      name,
      quantity,
      unit,
      price,
      date: getCurrentDate()
    });

    document.getElementById("ingredientForm").reset();
    closeModal("ingredientModal");
    renderInventory();
  });
}

function deleteIngredient(id) {
  if (confirm("¿Estás seguro de que deseas eliminar este ingrediente?")) {
    INGREDIENTS = INGREDIENTS.filter(ing => ing.id !== id);
    renderInventory();
  }
}

/* =========================================================
   FORMULARIOS - AGREGAR MOVIMIENTO
   ========================================================= */
function setupMovementForm() {
  document.getElementById("movementForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const date = document.getElementById("movementDate").value;
    const description = document.getElementById("movementDescription").value;
    const type = document.getElementById("movementType").value;
    const category = document.getElementById("movementCategory").value;
    const amount = parseFloat(document.getElementById("movementAmount").value);
    const status = document.getElementById("movementStatus").value;

    const newId = Math.max(...MOVEMENTS.map(m => m.id), 0) + 1;
    MOVEMENTS.push({
      id: newId,
      date,
      description,
      type,
      category,
      amount,
      status
    });

    document.getElementById("movementForm").reset();
    closeModal("movementModal");
    renderMovements();
    renderMonthlySummary();
  });
}

function deleteMovement(id) {
  if (confirm("¿Estás seguro de que deseas eliminar este movimiento?")) {
    MOVEMENTS = MOVEMENTS.filter(m => m.id !== id);
    renderMovements();
    renderMonthlySummary();
  }
}

/* =========================================================
   FILTRO DE RANGO DE FECHAS
   ========================================================= */
function setupDateFilter() {
  const buttons = document.querySelectorAll("#dateFilter button");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const range = btn.dataset.range;
      console.log("Rango seleccionado:", range);
      // TODO: Filtrar datos según el rango
    });
  });
}

/* =========================================================
   INICIALIZACIÓN
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  renderKPIs();
  renderInventory();
  renderMovements();
  renderMonthlySummary();
  renderLineChart();
  renderDoughnutChart();
  setupDateFilter();
  setupModalHandlers();
  setupIngredientForm();
  setupMovementForm();
});
