/* =========================================================
   DATOS DE EJEMPLO (PLACEHOLDER)
   ---------------------------------------------------------
   TODO: Reemplazar estas constantes por llamadas a tu API
   o base de datos. Cada función renderizadora lee desde aquí.
   ========================================================= */

// KPIs del mes actual
const KPI_DATA = {
  income:  { value: 4850000, change: 12.4, direction: "up"   },
  expense: { value: 2130000, change: -3.2, direction: "down" },
  profit:  { value: 2720000, change: 18.7, direction: "up"   },
  balance: { value: 6420000, change: 5.1,  direction: "up"   }
};

// Datos para gráfico de línea (últimos 6 meses)
const MONTHLY_DATA = {
  labels: ["May", "Jun", "Jul", "Ago", "Sep", "Oct"],
  income:  [3200000, 3800000, 4100000, 3900000, 4500000, 4850000],
  expense: [2400000, 2600000, 2300000, 2500000, 2200000, 2130000]
};

// Datos para gráfico de dona (gastos por categoría)
const EXPENSE_CATEGORIES = {
  labels: ["Proveedores", "Servicios", "Nómina", "Arriendo", "Otros"],
  data:   [780000, 420000, 540000, 280000, 110000]
};

// Movimientos recientes
const MOVEMENTS = [
  { date: "2025-10-28", description: "Venta producto #1042",       category: "Ventas",      type: "income",  amount: 450000, status: "paid"    },
  { date: "2025-10-27", description: "Pago electricidad octubre",  category: "Servicios",   type: "expense", amount: 85000,  status: "paid"    },
  { date: "2025-10-26", description: "Factura cliente ABC Ltda",   category: "Ventas",      type: "income",  amount: 1200000,status: "pending" },
  { date: "2025-10-25", description: "Compra materia prima",       category: "Proveedores", type: "expense", amount: 320000, status: "paid"    },
  { date: "2025-10-24", description: "Pago arriendo local",        category: "Arriendo",    type: "expense", amount: 280000, status: "paid"    },
  { date: "2025-10-22", description: "Servicio de aseo",           category: "Servicios",   type: "expense", amount: 95000,  status: "overdue" },
  { date: "2025-10-20", description: "Venta online #1038",         category: "Ventas",      type: "income",  amount: 230000, status: "paid"    }
];

// Cuentas por cobrar
const RECEIVABLES = [
  { name: "ABC Ltda",       amount: 1200000, dueDate: "2025-11-05" },
  { name: "Comercial XYZ",  amount: 780000,  dueDate: "2025-11-12" },
  { name: "Juan Pérez",     amount: 150000,  dueDate: "2025-11-20" }
];

// Cuentas por pagar
const PAYABLES = [
  { name: "Proveedor Alfa",   amount: 450000, dueDate: "2025-11-03" },
  { name: "Servicio de aseo", amount: 95000,  dueDate: "2025-10-30" },
  { name: "Banco XYZ",        amount: 320000, dueDate: "2025-11-15" }
];

/* =========================================================
   UTILIDADES
   ========================================================= */

// Formatea un número como moneda chilena: $ 1.250.000
function formatCurrency(value) {
  return "$ " + value.toLocaleString("es-CL");
}

// Formatea fecha ISO a formato legible
function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });
}

/* =========================================================
   RENDERIZADO DE KPIs
   ========================================================= */
function renderKPIs() {
  const grid = document.getElementById("kpiGrid");
  const cards = [
    { key: "income",  label: "Ingresos del mes", icon: "📈", cls: "income"  },
    { key: "expense", label: "Gastos del mes",   icon: "📉", cls: "expense" },
    { key: "profit",  label: "Utilidad neta",    icon: "💰", cls: "profit"  },
    { key: "balance", label: "Saldo en caja",    icon: "🏦", cls: "balance" }
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
   RENDERIZADO DE TABLA DE MOVIMIENTOS
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
      </tr>
    `;
  }).join("");
}

/* =========================================================
   RENDERIZADO DE CUENTAS POR COBRAR / PAGAR
   ========================================================= */
function renderAccounts() {
  const rec = document.getElementById("receivablesList");
  const pay = document.getElementById("payablesList");

  rec.innerHTML = RECEIVABLES.map(a => `
    <div class="account-item">
      <div class="account-info">
        <div class="name">${a.name}</div>
        <div class="date">Vence: ${formatDate(a.dueDate)}</div>
      </div>
      <div class="account-amount receivable">${formatCurrency(a.amount)}</div>
    </div>
  `).join("");

  pay.innerHTML = PAYABLES.map(a => `
    <div class="account-item">
      <div class="account-info">
        <div class="name">${a.name}</div>
        <div class="date">Vence: ${formatDate(a.dueDate)}</div>
      </div>
      <div class="account-amount payable">${formatCurrency(a.amount)}</div>
    </div>
  `).join("");
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
          "#2563eb", // Proveedores
          "#10b981", // Servicios
          "#f59e0b", // Nómina
          "#8b5cf6", // Arriendo
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
   FILTRO DE RANGO DE FECHAS
   TODO: Conectar con tu backend para filtrar datos reales.
   ========================================================= */
function setupDateFilter() {
  const buttons = document.querySelectorAll("#dateFilter button");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const range = btn.dataset.range;
      console.log("Rango seleccionado:", range);
      // TODO: Aquí llamarías a tu API con el rango elegido
      // y re-renderizarías KPIs, gráficos y tabla.
    });
  });
}

/* =========================================================
   INICIALIZACIÓN
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  renderKPIs();
  renderMovements();
  renderAccounts();
  renderLineChart();
  renderDoughnutChart();
  setupDateFilter();
});