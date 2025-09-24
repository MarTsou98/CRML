import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);
function StatsCharts({ groupedOrders }) {
  const totalDamages = {
    "Μεταφορά εξωτερικού": 0,
    "Μεταφορά εσωτερικού": 0,
    "Τοποθέτηση": 0,
    "Διάφορα": 0,
  };

  const revenueData = [];

  Object.entries(groupedOrders).forEach(([groupName, group]) => {
    revenueData.push({ groupName, revenue: group.totalRevenue, profit: group.totalProfit });
    Object.keys(totalDamages).forEach(type => {
      totalDamages[type] += group.totalDamages[type];
    });
  });

  const pieData = {
    labels: Object.keys(totalDamages),
    datasets: [
      {
        label: "Total Damages",
        data: Object.values(totalDamages),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const barData = {
    labels: revenueData.map(r => r.groupName),
    datasets: [
      {
        label: "Σύνολα",
        data: revenueData.map(r => r.revenue),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Διαφορά",
        data: revenueData.map(r => r.profit),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };
 const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };
  return (
    <div style={{ marginTop: "2rem", display: "flex", flexWrap: "wrap", gap: "2rem" }}>
      <div style={{ flex: "1 1 300px", maxWidth: "400px", height: "300px" }}>
        <h4 style={{ textAlign: "center" }}>Έξοδα</h4>
        <Pie data={pieData} options={chartOptions} />
      </div>

      <div style={{ flex: "1 1 300px", maxWidth: "500px", height: "300px" }}>
        <h4 style={{ textAlign: "center" }}>Σύνολα/Κέρδος ανά ομάδα</h4>
        <Bar data={barData} options={chartOptions} />
      </div>
    </div>
  );
}
// Helper: summarize damages by type
function summarizeDamages(damages) {
  const summary = {
    "Μεταφορά εξωτερικού": 0,
    "Μεταφορά εσωτερικού": 0,
    "Τοποθέτηση": 0,
    "Διάφορα": 0,
  };

  if (Array.isArray(damages)) {
    damages.forEach(d => {
      if (d.typeOfDamage && summary.hasOwnProperty(d.typeOfDamage)) {
        summary[d.typeOfDamage] += d.amount || 0;
      }
    });
  }
  return summary;
}

// Helper: group and summarize orders
function groupAndSummarizeOrders(orders, groupBy) {
  const grouped = {};
  orders.forEach(order => {
    let key;
    if (groupBy === 'orderedFromCompany') {
      key = order.orderedFromCompany || 'Unassigned';
    } else if (groupBy === 'salesperson_id') {
      const person = order.salesperson_id;
      key = person ? `${person.firstName || ''} ${person.lastName || ''}`.trim() : 'Unassigned';
    } else if (groupBy === 'contractor_id') {
      const contractor = order.contractor_id;
      key = contractor ? contractor.EnterpriseName || 'Unassigned' : 'Unassigned';
    }

    if (!grouped[key]) {
      grouped[key] = {
        orders: [],
        totalRevenue: 0,
        totalProfit: 0,
        totalCash: 0,
        totalBank: 0,
        totalNetPrice: 0,
        totalDamages: {
          "Μεταφορά εξωτερικού": 0,
          "Μεταφορά εσωτερικού": 0,
          "Τοποθέτηση": 0,
          "Διάφορα": 0,
        }
      };
    }

    const netPrice = (order.moneyDetails?.timi_Polisis || 0) - (order.moneyDetails?.FPA || 0);
    grouped[key].totalNetPrice += netPrice;

    const damageSummary = summarizeDamages(order.moneyDetails?.damages);

    grouped[key].orders.push(order);
    grouped[key].totalRevenue += order.moneyDetails?.timi_Polisis || 0;
    grouped[key].totalProfit += order.moneyDetails?.profit || 0;
    grouped[key].totalCash += order.moneyDetails?.cash || 0;
    grouped[key].totalBank += order.moneyDetails?.bank || 0;

    Object.keys(grouped[key].totalDamages).forEach(type => {
      grouped[key].totalDamages[type] += damageSummary[type];
    });
  });
  return grouped;
}

function StatsTable({ data, groupBy }) {
  if (!data || data.length === 0) return <p>No orders found.</p>;

  const groupedOrders = groupAndSummarizeOrders(data, groupBy);

  // Grand totals
  let grandTotals = {
    revenue: 0,
    profit: 0,
    cash: 0,
    bank: 0,
    netPrice: 0,
    damages: {
      "Μεταφορά εξωτερικού": 0,
      "Μεταφορά εσωτερικού": 0,
      "Τοποθέτηση": 0,
      "Διάφορα": 0,
    }
  };

  Object.values(groupedOrders).forEach(group => {
    grandTotals.revenue += group.totalRevenue;
    grandTotals.profit += group.totalProfit;
    grandTotals.cash += group.totalCash;
    grandTotals.bank += group.totalBank;
    grandTotals.netPrice += group.totalNetPrice;
    Object.keys(group.totalDamages).forEach(type => {
      grandTotals.damages[type] += group.totalDamages[type];
    });
  });

  // Excel export
const handleDownloadExcel = () => {
  const wb = XLSX.utils.book_new();

  Object.entries(groupedOrders).forEach(([groupName, groupData]) => {
    const wsData = [
      [
        "Πελάτης",
        "Εργολάβος",
        "Ημερομηνία",
        "Τύπος",
        "Είδος",
        "Καθαρή Τιμή",
        "ΦΠΑ",
        "Cash",
        "Bank",
        "Proforma",
        "Μεταφορά Εξωτ.",
        "Μεταφορά Εσωτ.",
        "Διάφορα έξοδα",
        "Τοποθέτηση",
        "Τιμή Πώλησης",
        "Διαφορά"
      ]
    ];

    groupData.orders.forEach(order => {
      const damageSummary = summarizeDamages(order.moneyDetails?.damages);
      const netPrice = Math.round(((order.moneyDetails?.timi_Polisis || 0) - (order.moneyDetails?.FPA || 0)) * 100) / 100;
      const timiPolisis = Math.round((order.moneyDetails?.timi_Polisis || 0) * 100) / 100;
      const profit = Math.round((order.moneyDetails?.profit || 0) * 100) / 100;
      const cash = Math.round((order.moneyDetails?.cash || 0) * 100) / 100;
      const bank = Math.round((order.moneyDetails?.bank || 0) * 100) / 100;
      const proforma = Math.round((order.moneyDetails?.timi_Timokatalogou || 0) * 100) / 100;
      const extTransport = Math.round(damageSummary["Μεταφορά εξωτερικού"] * 100) / 100;
      const intTransport = Math.round(damageSummary["Μεταφορά εσωτερικού"] * 100) / 100;
      const various = Math.round(damageSummary["Διάφορα"] * 100) / 100;
      const installation = Math.round(damageSummary["Τοποθέτηση"] * 100) / 100;

      wsData.push([
        `${order.customer_id?.firstName || ""} ${order.customer_id?.lastName || ""}`,
        order.contractor_id?.EnterpriseName || "",
        new Date(order.DateOfOrder).toLocaleDateString(),
        order.orderedFromCompany || "",
        order.orderType || "",
        netPrice,
        order.moneyDetails?.FPA || 0,
        cash,
        bank,
        proforma,
        extTransport,
        intTransport,
        various,
        installation,
        timiPolisis,
        profit
      ]);
    });

    // Add totals row for the group
    wsData.push([
      `Total for ${groupName}`,
      "",
      "",
      "",
      groupData.totalNetPrice,
      "",
      "",
      groupData.totalCash,
      groupData.totalBank,
      "",
      groupData.totalDamages["Μεταφορά εξωτερικού"],
      groupData.totalDamages["Μεταφορά εσωτερικού"],
      groupData.totalDamages["Διάφορα"],
      groupData.totalDamages["Τοποθέτηση"],
      groupData.totalRevenue,
      groupData.totalProfit
    ]);

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, groupName.substring(0, 31));
  });

  // Grand totals sheet
  const wsGrand = XLSX.utils.aoa_to_sheet([
    ["Grand Totals"],
    ["Net Price", grandTotals.netPrice],
    ["Revenue", grandTotals.revenue],
    ["Profit", grandTotals.profit],
    ["Cash", grandTotals.cash],
    ["Bank", grandTotals.bank],
    ["Μεταφορά Εξωτ.", grandTotals.damages["Μεταφορά εξωτερικού"]],
    ["Μεταφορά Εσωτ.", grandTotals.damages["Μεταφορά εσωτερικού"]],
    ["Διάφορα", grandTotals.damages["Διάφορα"]],
    ["Τοποθέτηση", grandTotals.damages["Τοποθέτηση"]],
  ]);
  XLSX.utils.book_append_sheet(wb, wsGrand, "Grand Totals");

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([wbout], { type: "application/octet-stream" }), "orders_stats.xlsx");
};


  return (
    <div>
      <button onClick={handleDownloadExcel} style={{ marginBottom: "1rem" }}>
        Download Excel
      </button>

      {Object.entries(groupedOrders).map(([groupName, groupData]) => (
        <div key={groupName} style={{ marginBottom: "2rem" }}>
          <h2>
            {groupBy === "orderedFromCompany" ? "Company: "
              : groupBy === "salesperson_id" ? "Salesperson: "
              : "Contractor: "}
            {groupName}
          </h2>

          <table border="1" cellPadding="5" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Πελάτης</th>
                <th>Εργολάβος</th>
                <th>Ημερομηνία</th>
                <th>Τύπος</th>
                <th>Είδος</th>
                <th>Καθαρή Τιμή</th>
                <th>ΦΠΑ</th>
                <th>Cash</th>
                <th>Bank</th>
                <th>Proforma</th>
                <th>Μεταφορά Εξωτ.</th>
                <th>Μεταφορά Εσωτ.</th>
                <th>Διάφορα έξοδα</th>
                <th>Τοποθέτηση</th>
                <th>Τιμή Πώλησης</th>
                <th>Διαφορά</th>
              </tr>
            </thead>
            <tbody>
              {groupData.orders.map(order => {
                const damageSummary = summarizeDamages(order.moneyDetails?.damages);
                return (
                  <tr key={order._id}>
                    <td>{order.customer_id?.firstName} {order.customer_id?.lastName}</td>
                    <td>{order.contractor_id?.EnterpriseName}</td>
                    <td>{new Date(order.DateOfOrder).toLocaleDateString()}</td>
                    <td>{order.orderedFromCompany}</td>
                    <td>{order.orderType}</td>
                    <td>{((order.moneyDetails?.timi_Polisis || 0) - (order.moneyDetails?.FPA || 0)).toFixed(2)}</td>
                    <td>{(order.moneyDetails?.FPA || 0).toFixed(2)}</td>
                    <td>{(order.moneyDetails?.cash || 0).toFixed(2)}</td>
                    <td>{(order.moneyDetails?.bank || 0).toFixed(2)}</td>
                    <td>{order.moneyDetails?.timi_Timokatalogou || 0}</td>
                    <td>{damageSummary["Μεταφορά εξωτερικού"].toFixed(2)}</td>
                    <td>{damageSummary["Μεταφορά εσωτερικού"].toFixed(2)}</td>
                    <td>{damageSummary["Διάφορα"].toFixed(2)}</td>
                    <td>{damageSummary["Τοποθέτηση"].toFixed(2)}</td>
                    <td>{(order.moneyDetails?.timi_Polisis || 0).toFixed(2)}</td>
                    <td>{(order.moneyDetails?.profit || 0).toFixed(2)}</td>
                  </tr>
                );
              })}
              <tr style={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
                <td colSpan={2}>Total for {groupName}</td>
                <td colSpan={3}></td>
                <td>{groupData.totalNetPrice.toFixed(2)}</td>
                <td></td>
                
                <td>{groupData.totalCash.toFixed(2)}</td>
                <td>{groupData.totalBank.toFixed(2)}</td>
                <td></td>
                <td>{groupData.totalDamages["Μεταφορά εξωτερικού"].toFixed(2)}</td>
                <td>{groupData.totalDamages["Μεταφορά εσωτερικού"].toFixed(2)}</td>
                <td>{groupData.totalDamages["Διάφορα"].toFixed(2)}</td>
                <td>{groupData.totalDamages["Τοποθέτηση"].toFixed(2)}</td>
                <td>{groupData.totalRevenue.toFixed(2)}</td>
                <td>{groupData.totalProfit.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}

      {/* Grand totals */}
      <div style={{ fontWeight: "bold", fontSize: "1.1rem", marginTop: "1rem" }}>
        <p>Grand Totals:</p>
        <p>Net Price: {grandTotals.netPrice.toFixed(2)}</p>
        <p>Revenue: {grandTotals.revenue.toFixed(2)}</p>
        <p>Profit: {grandTotals.profit.toFixed(2)}</p>
        <p>Cash: {grandTotals.cash.toFixed(2)}</p>
        <p>Bank: {grandTotals.bank.toFixed(2)}</p>
        <p>Μεταφορά Εξωτ.: {grandTotals.damages["Μεταφορά εξωτερικού"].toFixed(2)}</p>
        <p>Μεταφορά Εσωτ.: {grandTotals.damages["Μεταφορά εσωτερικού"].toFixed(2)}</p>
        <p>Διάφορα Έξοδα: {grandTotals.damages["Διάφορα"].toFixed(2)}</p>
        <p>Τοποθέτηση: {grandTotals.damages["Τοποθέτηση"].toFixed(2)}</p>
      </div>
       <StatsCharts groupedOrders={groupedOrders} />
    </div>
  );
}

export default StatsTable;
