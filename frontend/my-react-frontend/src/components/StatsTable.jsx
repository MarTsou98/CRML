import React, { useRef } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

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
  if (!Array.isArray(orders)) return grouped; 
  orders.forEach(order => {
    let key;
    if (groupBy === 'orderedFromCompany') key = order.orderedFromCompany || 'Unassigned';
    else if (groupBy === 'salesperson_id') {
      const person = order.salesperson_id;
      key = person ? `${person.firstName || ''} ${person.lastName || ''}`.trim() : 'Unassigned';
    } else if (groupBy === 'contractor_id') {
      const contractor = order.contractor_id;
      key = contractor ? contractor.EnterpriseName || 'Unassigned' : 'Unassigned';
    }

    if (!grouped[key]) grouped[key] = {
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

// Charts component
function StatsCharts({ groupedOrders, allOrders = []  }) {
  const totalDamages = { "Μεταφορά εξωτερικού": 0, "Μεταφορά εσωτερικού": 0, "Τοποθέτηση": 0, "Διάφορα": 0 };
  const revenueData = [];
  Object.entries(groupedOrders).forEach(([groupName, group]) => {
    revenueData.push({ groupName, revenue: group.totalRevenue, profit: group.totalProfit });
    Object.keys(totalDamages).forEach(type => totalDamages[type] += group.totalDamages[type]);
  });

  // Salespeople charts
  const salespeopleGrouped = groupAndSummarizeOrders(allOrders, 'salesperson_id');
  const salespeopleNet = Object.entries(salespeopleGrouped).map(([name, group]) => ({
    name,
    netPrice: group.totalNetPrice
  }));

  const salespeoplePie = {
    labels: salespeopleNet.map(s => s.name),
    datasets: [{ data: salespeopleNet.map(s => s.netPrice), backgroundColor: ["#FF6384","#36A2EB","#FFCE56","#4BC0C0","#9966FF"] }]
  };
  const salespeopleBar = {
    labels: salespeopleNet.map(s => s.name),
    datasets: [{ label: "Καθαρή Τιμή", data: salespeopleNet.map(s => s.netPrice), backgroundColor: "rgba(255,206,86,0.6)" }]
  };

  // Companies charts
  const companiesGrouped = groupAndSummarizeOrders(allOrders, 'orderedFromCompany');
  const companiesNet = Object.entries(companiesGrouped).map(([name, group]) => ({ name, netPrice: group.totalNetPrice }));
  const companiesPie = {
    labels: companiesNet.map(c => c.name),
    datasets: [{ data: companiesNet.map(c => c.netPrice), backgroundColor: ["#FF6384","#36A2EB","#FFCE56","#4BC0C0","#9966FF"] }]
  };
  const companiesBar = {
    labels: companiesNet.map(c => c.name),
    datasets: [{ label: "Καθαρή Τιμή", data: companiesNet.map(c => c.netPrice), backgroundColor: "rgba(75,192,192,0.6)" }]
  };

  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } };

  return (
    <div style={{ marginTop: "2rem", display: "flex", flexWrap: "wrap", gap: "2rem" }}>
      <div style={{ flex: "1 1 300px", maxWidth: "400px", height: "300px" }}>
        <h4 style={{ textAlign: "center" }}>Έξοδα</h4>
        <Pie data={{ labels: Object.keys(totalDamages), datasets: [{ data: Object.values(totalDamages), backgroundColor: ["#FF6384","#36A2EB","#FFCE56","#4BC0C0"] }] }} options={chartOptions} />
      </div>
      <div style={{ flex: "1 1 400px", maxWidth: "400px", height: "300px" }}>
        <h4 style={{ textAlign: "center" }}>Καθαρή Τιμή ανά Salesperson (Pie)</h4>
        <Pie data={salespeoplePie} options={chartOptions} />
      </div>
      <div style={{ flex: "1 1 400px", maxWidth: "400px", height: "300px" }}>
        <h4 style={{ textAlign: "center" }}>Καθαρή Τιμή ανά Salesperson (Bar)</h4>
        <Bar data={salespeopleBar} options={chartOptions} />
      </div>
      <div style={{ flex: "1 1 400px", maxWidth: "400px", height: "300px" }}>
        <h4 style={{ textAlign: "center" }}>Καθαρή Τιμή ανά Company (Pie)</h4>
        <Pie data={companiesPie} options={chartOptions} />
      </div>
      <div style={{ flex: "1 1 400px", maxWidth: "400px", height: "300px" }}>
        <h4 style={{ textAlign: "center" }}>Καθαρή Τιμή ανά Company (Bar)</h4>
        <Bar data={companiesBar} options={chartOptions} />
      </div>
      <div style={{ flex: "1 1 500px", maxWidth: "500px", height: "300px" }}>
        <h4 style={{ textAlign: "center" }}>Σύνολα/Κέρδος ανά ομάδα</h4>
        <Bar data={{ labels: revenueData.map(r => r.groupName), datasets: [{ label: "Σύνολα", data: revenueData.map(r => r.revenue), backgroundColor: "rgba(75,192,192,0.6)" }, { label: "Διαφορά", data: revenueData.map(r => r.profit), backgroundColor: "rgba(153,102,255,0.6)" }] }} options={chartOptions} />
      </div>
    </div>
  );
}

// Main component
function StatsTable({ data, groupBy, start, end }) {
  const containerRef = useRef();
  if (!data || data.length === 0) return <p>No orders found.</p>;

  const groupedOrders = groupAndSummarizeOrders(data, groupBy);

  let grandTotals = { revenue: 0, profit: 0, cash: 0, bank: 0, netPrice: 0, damages: { "Μεταφορά εξωτερικού": 0, "Μεταφορά εσωτερικού": 0, "Τοποθέτηση": 0, "Διάφορα": 0 } };
  Object.values(groupedOrders).forEach(group => {
    grandTotals.revenue += group.totalRevenue;
    grandTotals.profit += group.totalProfit;
    grandTotals.cash += group.totalCash;
    grandTotals.bank += group.totalBank;
    grandTotals.netPrice += group.totalNetPrice;
    Object.keys(group.totalDamages).forEach(type => grandTotals.damages[type] += group.totalDamages[type]);
  });

  const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-GB") : "";

  const handleDownloadExcel = () => {
    const wb = XLSX.utils.book_new();
    Object.entries(groupedOrders).forEach(([groupName, groupData]) => {
      const wsData = [["Πελάτης","Εργολάβος","Ημερομηνία","Είδος","Καθαρή Τιμή","ΦΠΑ","Cash","Bank","Proforma","Μεταφορά Εξωτ.","Μεταφορά Εσωτ.","Διάφορα έξοδα","Τοποθέτηση","Τιμή Πώλησης","Διαφορά","Ποσοστό"]];
      groupData.orders.forEach(order => {
        const damageSummary = summarizeDamages(order.moneyDetails?.damages);
        const totalDamages = Object.values(damageSummary).reduce((sum, val) => sum + val, 0);
        wsData.push([
          `${order.customer_id?.firstName || ""} ${order.customer_id?.lastName || ""}`,
          order.contractor_id?.EnterpriseName || "",
          new Date(order.DateOfOrder).toLocaleDateString(),
          order.orderedFromCompany || "",
          Math.round(((order.moneyDetails?.timi_Polisis || 0) - (order.moneyDetails?.FPA || 0)) * 100)/100,
          order.moneyDetails?.FPA || 0,
          order.moneyDetails?.cash || 0,
          order.moneyDetails?.bank || 0,
          order.moneyDetails?.timi_Timokatalogou || 0,
          damageSummary["Μεταφορά εξωτερικού"],
          damageSummary["Μεταφορά εσωτερικού"],
          damageSummary["Διάφορα"],
          damageSummary["Τοποθέτηση"],
          order.moneyDetails?.timi_Polisis || 0,
          ((order.moneyDetails?.profit || 0) - totalDamages).toFixed(2),
          order.moneyDetails?.timi_Polisis
            ? ((order.moneyDetails.profit / order.moneyDetails.timi_Polisis) * 100).toFixed(2) + "%"
            : "0%"
        ]);
      });
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, groupName.substring(0,31));
    });
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "orders_stats.xlsx");
  };

  const handleDownloadPDF = async () => {
    if (!containerRef.current) return;
    const margin = 30;
    const pdf = new jsPDF("l", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const tableEl = document.getElementById("table-container");
    const tableCanvas = await html2canvas(tableEl, { scale: 2 });
    const tableImg = tableCanvas.toDataURL("image/png");
    let tableScale = Math.min((pageWidth - margin * 2) / tableCanvas.width, (pageHeight - margin * 2) / tableCanvas.height);
    pdf.addImage(tableImg, "PNG", margin, margin, tableCanvas.width * tableScale, tableCanvas.height * tableScale);

    const chartsEl = document.getElementById("charts-container");
    const chartDivs = chartsEl.querySelectorAll("div");
    const oldHeights = [];
    chartDivs.forEach((div, i) => { oldHeights[i] = div.style.height; div.style.height = "auto"; });
    const chartsCanvas = await html2canvas(chartsEl, { scale: 2 });
    chartDivs.forEach((div, i) => { div.style.height = oldHeights[i]; });
    pdf.addPage();
    let chartsScale = Math.min((pageWidth - margin * 2) / chartsCanvas.width, (pageHeight - margin * 2) / chartsCanvas.height);
    pdf.addImage(chartsCanvas.toDataURL("image/png"), "PNG", (pageWidth - chartsCanvas.width * chartsScale)/2, margin, chartsCanvas.width * chartsScale, chartsCanvas.height * chartsScale);

    const grandEl = document.getElementById("grandtotals-container");
    const grandCanvas = await html2canvas(grandEl, { scale: 2 });
    pdf.addPage();
    let grandScale = Math.min((pageWidth - margin * 2) / grandCanvas.width, (pageHeight - margin * 2) / grandCanvas.height);
    pdf.addImage(grandCanvas.toDataURL("image/png"), "PNG", (pageWidth - grandCanvas.width * grandScale)/2, margin, grandCanvas.width * grandScale, grandCanvas.height * grandScale);

    pdf.save("orders_stats.pdf");
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem", display: "flex", gap: "1rem" }}>
        <button
          onClick={handleDownloadExcel}
          style={{
            padding: "10px 20px", backgroundColor: "#4CAF50", color: "#fff",
            border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)", transition: "all 0.2s ease-in-out"
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#45a049"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#4CAF50"}
        >Download Excel</button>

        <button
          onClick={handleDownloadPDF}
          style={{
            padding: "10px 20px", backgroundColor: "#2196F3", color: "#fff",
            border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)", transition: "all 0.2s ease-in-out"
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1976D2"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2196F3"}
        >Download PDF</button>
      </div>

      <div id="table-container" ref={containerRef} style={{ marginTop: "2rem" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          Περίοδος: {formatDate(start)} - {formatDate(end)}
        </h2>
        {Object.entries(groupedOrders).map(([groupName, groupData]) => (
          <div key={groupName} style={{ marginBottom: "3rem" }}>
            <h3 style={{
              background: "#4a90e2", color: "white", padding: "0.5rem 1rem",
              borderRadius: "6px", marginBottom: "0.5rem"
            }}>
              {groupBy === "orderedFromCompany" ? "Εταιρεία: " : groupBy === "salesperson_id" ? "Πωλητής: " : "Εργολάβος: "} {groupName}
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
              <thead>
                <tr style={{ backgroundColor: "#f4f6f8", color: "#333", textAlign: "center", fontWeight: "bold", borderBottom: "2px solid #ddd" }}>
                  {["Πελάτης","Εργολάβος","Ημερομηνία","Είδος","Καθαρή Τιμή","ΦΠΑ","Cash","Bank","Proforma","Μεταφορά Εξωτ.","Μεταφορά Εσωτ.","Διάφορα έξοδα","Τοποθέτηση","Τιμή Πώλησης","Διαφορά","Ποσοστό"].map(header => (
                    <th key={header} style={{ border: "1px solid #ddd", padding: "8px" }}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groupData.orders.map((order, idx) => {
                  const damageSummary = summarizeDamages(order.moneyDetails?.damages);
                  const totalDamages = Object.values(damageSummary).reduce((sum, val) => sum + val, 0);
                  return (
                    <tr key={order._id} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9f9f9", textAlign: "center" }}>
                      {[
                        `${order.customer_id?.firstName || ""} ${order.customer_id?.lastName || ""}`,
                        order.contractor_id?.EnterpriseName || "",
                        new Date(order.DateOfOrder).toLocaleDateString(),
                        order.orderedFromCompany || "",
                        ((order.moneyDetails?.timi_Polisis || 0) - (order.moneyDetails?.FPA || 0)).toFixed(2),
                        (order.moneyDetails?.FPA || 0).toFixed(2),
                        (order.moneyDetails?.cash || 0).toFixed(2),
                        (order.moneyDetails?.bank || 0).toFixed(2),
                        order.moneyDetails?.timi_Timokatalogou || 0,
                        damageSummary["Μεταφορά εξωτερικού"].toFixed(2),
                        damageSummary["Μεταφορά εσωτερικού"].toFixed(2),
                        damageSummary["Διάφορα"].toFixed(2),
                        damageSummary["Τοποθέτηση"].toFixed(2),
                        (order.moneyDetails?.timi_Polisis || 0).toFixed(2),
                        ((order.moneyDetails?.profit || 0) - totalDamages).toFixed(2),
                        order.moneyDetails?.timi_Polisis
                          ? ((order.moneyDetails.profit / order.moneyDetails.timi_Polisis) * 100).toFixed(2) + "%"
                          : "0%"
                      ].map((cell, i) => (
                        <td key={i} style={{ border: "1px solid #ddd", padding: "8px" }}>{cell}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div id="charts-container">
        <StatsCharts groupedOrders={groupedOrders} allOrders={data || []} />
      </div>

      <div
        id="grandtotals-container"
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem",
          marginTop: "4rem", padding: "3rem", background: "#e0e0e0",
          borderRadius: "16px", boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
          maxWidth: "500px", marginLeft: "auto", marginRight: "auto"
        }}
      >
        <h1>Σύνολα</h1>
        {[
          { label: "Net Price", value: grandTotals.netPrice, color: "#4CAF50" },
          { label: "Revenue", value: grandTotals.revenue, color: "#2196F3" },
          { label: "Profit", value: grandTotals.profit, color: "#FF9800" },
          { label: "Cash", value: grandTotals.cash, color: "#9C27B0" },
          { label: "Bank", value: grandTotals.bank, color: "#00BCD4" },
          { label: "Μεταφορά Εξωτ.", value: grandTotals.damages["Μεταφορά εξωτερικού"], color: "#F44336" },
          { label: "Μεταφορά Εσωτ.", value: grandTotals.damages["Μεταφορά εσωτερικού"], color: "#FF5722" },
          { label: "Διάφορα Έξοδα", value: grandTotals.damages["Διάφορα"], color: "#607D8B" },
          { label: "Τοποθέτηση", value: grandTotals.damages["Τοποθέτηση"], color: "#795548" }
        ].map((item, idx) => (
          <div key={idx} style={{
            width: "100%", background: "#fff", borderLeft: `6px solid ${item.color}`,
            borderRadius: "10px", padding: "1.5rem 2rem", textAlign: "center", boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
          }}>
            <div style={{ fontSize: "1rem", color: "#555", marginBottom: "0.5rem" }}>{item.label}</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "600", color: "#111" }}>{item.value.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatsTable;
