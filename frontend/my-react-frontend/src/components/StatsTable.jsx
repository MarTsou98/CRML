import React, { useRef } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ChartDataLabels from "chartjs-plugin-datalabels";

import autoTable from "jspdf-autotable";
import "../assets/fonts/NotoSans-Regular-normal"; // adjust path as needed
import"../assets/fonts/NotoSans_Condensed-Bold-normal"; // adjust path as needed
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ChartDataLabels);


function drawGradientHeader(pdf, x, y, width, height, colorStart, colorEnd) {
  const steps = 100; // number of color steps for smooth gradient
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    const r = Math.round(colorStart[0] + ratio * (colorEnd[0] - colorStart[0]));
    const g = Math.round(colorStart[1] + ratio * (colorEnd[1] - colorStart[1]));
    const b = Math.round(colorStart[2] + ratio * (colorEnd[2] - colorStart[2]));
    pdf.setFillColor(r, g, b);
    pdf.rect(x + (i * width) / steps, y, width / steps, height, 'F'); // fill small rectangle
  }
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
function StatsCharts({ allOrders = [] }) {
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      datalabels: {
        color: "#fff",
        formatter: (value, context) => {
          const dataset = context.chart.data.datasets[0];
          const total = dataset.data.reduce((sum, val) => sum + val, 0);
          return ((value / total) * 100).toFixed(1) + "%";
        },
        font: { weight: "bold", size: 14 }
      }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" }, datalabels: { display: false } }
  };

  // --- Salespeople ---
  const salespeopleGrouped = groupAndSummarizeOrders(allOrders, "salesperson_id");
  const salespeopleNet = Object.entries(salespeopleGrouped).map(([name, group]) => ({
    name,
    netPrice: group.totalNetPrice
  }));

  const salespeoplePie = {
    labels: salespeopleNet.map(s => s.name),
    datasets: [{
      data: salespeopleNet.map(s => s.netPrice),
      backgroundColor: ["#FF6384","#36A2EB","#FFCE56","#4BC0C0","#9966FF"]
    }]
  };

  const salespeopleBar = {
    labels: salespeopleNet.map(s => s.name),
    datasets: [{
      label: "Καθαρή Τιμή",
      data: salespeopleNet.map(s => s.netPrice),
      backgroundColor: "rgba(255,206,86,0.6)"
    }]
  };

  // --- Companies ---
  const companiesGrouped = groupAndSummarizeOrders(allOrders, "orderedFromCompany");
  const companiesNet = Object.entries(companiesGrouped).map(([name, group]) => ({
    name,
    netPrice: group.totalNetPrice
  }));

  const companiesPie = {
    labels: companiesNet.map(c => c.name),
    datasets: [{
      data: companiesNet.map(c => c.netPrice),
      backgroundColor: ["#FF6384","#36A2EB","#FFCE56","#4BC0C0","#9966FF"]
    }]
  };

  const companiesBar = {
    labels: companiesNet.map(c => c.name),
    datasets: [{
      label: "Καθαρή Τιμή",
      data: companiesNet.map(c => c.netPrice),
      backgroundColor: "rgba(75,192,192,0.6)"
    }]
  };

  // --- Payment Method ---
  let totalCash = 0, totalBank = 0;
  allOrders.forEach(o => {
    totalCash += o.moneyDetails?.cash || 0;
    totalBank += o.moneyDetails?.bank || 0;
  });

  const paymentPie = {
    labels: ["Cash", "Bank"],
    datasets: [{
      data: [totalCash, totalBank],
      backgroundColor: ["#4CAF50", "#2196F3"]
    }]
  };

  const paymentBar = {
    labels: ["Cash", "Bank"],
    datasets: [{
      label: "Πληρωμές",
      data: [totalCash, totalBank],
      backgroundColor: ["rgba(76,175,80,0.6)", "rgba(33,150,243,0.6)"]
    }]
  };

  // --- Damages ---
  const damagesTotals = { "Μεταφορά εξωτερικού": 0, "Μεταφορά εσωτερικού": 0, "Τοποθέτηση": 0, "Διάφορα": 0 };
  allOrders.forEach(o => {
    const d = summarizeDamages(o.moneyDetails?.damages);
    Object.keys(damagesTotals).forEach(type => damagesTotals[type] += d[type]);
  });

  const damagesPie = {
    labels: Object.keys(damagesTotals),
    datasets: [{
      data: Object.values(damagesTotals),
      backgroundColor: ["#F44336","#FF9800","#9C27B0","#607D8B"]
    }]
  };

  const damagesBar = {
    labels: Object.keys(damagesTotals),
    datasets: [{
      label: "Σύνολο Ζημιών",
      data: Object.values(damagesTotals),
      backgroundColor: "rgba(244,67,54,0.6)"
    }]
  };

  return (
    <div
      style={{
        marginTop: "2rem",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "2rem"
      }}
    >
      {/* Salespeople */}
      <div style={{ height: "400px" }}>
        <h4 style={{ textAlign: "center" }}>Καθαρή Τιμή ανά Salesperson (Pie)</h4>
        <Pie data={salespeoplePie} options={pieOptions} />
      </div>
      <div style={{ height: "400px" }}>
        <h4 style={{ textAlign: "center" }}>Καθαρή Τιμή ανά Salesperson (Bar)</h4>
        <Bar data={salespeopleBar} options={barOptions} />
      </div>

      {/* Companies */}
      <div style={{ height: "400px" }}>
        <h4 style={{ textAlign: "center" }}>Καθαρή Τιμή ανά Company (Pie)</h4>
        <Pie data={companiesPie} options={pieOptions} />
      </div>
      <div style={{ height: "400px" }}>
        <h4 style={{ textAlign: "center" }}>Καθαρή Τιμή ανά Company (Bar)</h4>
        <Bar data={companiesBar} options={barOptions} />
      </div>

      {/* Payment Methods */}
      <div style={{ height: "400px" }}>
        <h4 style={{ textAlign: "center" }}>Πληρωμές (Pie)</h4>
        <Pie data={paymentPie} options={pieOptions} />
      </div>
      <div style={{ height: "400px" }}>
        <h4 style={{ textAlign: "center" }}>Πληρωμές (Bar)</h4>
        <Bar data={paymentBar} options={barOptions} />
      </div>

      {/* Damages */}
      <div style={{ height: "400px" }}>
        <h4 style={{ textAlign: "center" }}>Έξοδα (Pie)</h4>
        <Pie data={damagesPie} options={pieOptions} />
      </div>
      <div style={{ height: "400px" }}>
        <h4 style={{ textAlign: "center" }}>Έξοδα (Bar)</h4>
        <Bar data={damagesBar} options={barOptions} />
      </div>
    </div>
  );
}


// Main component
function StatsTable({ data, groupBy, start, end }) {
  const containerRef = useRef();
  if (!data || data.length === 0) return <p>No orders found.</p>;

  const groupedOrders = groupAndSummarizeOrders(data, groupBy);

  let grandTotals = { revenue: 0, profit: 0, cash: 0, bank: 0, netPrice: 0, FPA: 0, damages: { "Μεταφορά εξωτερικού": 0, "Μεταφορά εσωτερικού": 0, "Τοποθέτηση": 0, "Διάφορα": 0 } };
  Object.values(groupedOrders).forEach(group => {
    grandTotals.revenue += group.totalRevenue;
    grandTotals.FPA += group.orders.reduce((sum, o) => sum + (o.moneyDetails?.FPA || 0), 0);
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

  const topMargin = 30; // top margin for the whole content
  const sideMargin = 40; // left/right margin
  const pdf = new jsPDF("l", "pt", "a4");
  pdf.setFont("NotoSans-Regular");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // ---------- TABLES ----------
  const tableContainer = document.getElementById("table-container");
  const tables = tableContainer.querySelectorAll("table");

  if (tables.length === 0) {
    console.warn("No tables found in #table-container");
  } else {
    const headerHeight = 30; // gradient header height
    const headerMargin = 15; // padding below header
    let startY = topMargin + headerHeight + headerMargin + 10;

    tables.forEach((table, i) => {
      const groupTitleEl = table.previousElementSibling;
      const groupTitle = groupTitleEl ? groupTitleEl.textContent : "";

      const tableTopMargin = topMargin + headerHeight + headerMargin + 10;

      autoTable(pdf, {
        html: table,
        startY: undefined,
        margin: {
          top: tableTopMargin,
          left: sideMargin,
          right: sideMargin,
          bottom: 25,
        },
        theme: "grid",
        styles: {
          font: "NotoSans-Regular",
          fontSize: 8,
          cellPadding: 4,
          overflow: "linebreak",
          halign: "right",
          valign: "middle",
          textColor: 20,
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
        },
        tableWidth: "auto",
        headStyles: {
          font: "NotoSans_Condensed-Bold",
          fontStyle: "normal",
          fontSize: 8,
          fillColor: [230, 230, 230],
          textColor: 20,
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
        },
        footStyles: {
          font: "NotoSans_Condensed-Bold",
          fontStyle: "normal",
          fontSize: 8,
          fillColor: [224, 224, 224],
          textColor: 20,
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
        },
        columnStyles: { 0: { cellWidth: 90, fontSize: 6 }, 1: { fontSize: 6 } },
        didDrawPage: (data) => {
          // Draw gradient header
          drawGradientHeader(pdf, 0, topMargin, pageWidth, headerHeight, [139, 0, 0], [255, 255, 255]);

          // Draw main title
          pdf.setFont("NotoSans_Condensed-Bold");
          pdf.setFontSize(18);
          pdf.setTextColor(255, 255, 255);
          pdf.text("Lube Salonicco", sideMargin, topMargin + 20);

          // Draw date range
          pdf.setFont("NotoSans-Regular");
          pdf.setFontSize(12);
          pdf.setTextColor(255, 255, 255);
          const dateRangeText = `${formatDate(start)} - ${formatDate(end)}`;
          const titleWidth = pdf.getTextWidth("Lube Salonicco         ");
          pdf.text(dateRangeText, sideMargin + titleWidth + 10, topMargin + 20);

          // Draw group title at top of every page for that table
          if (groupTitle) {
            pdf.setFont("NotoSans_Condensed-Bold");
            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);
            pdf.text(groupTitle, sideMargin, topMargin + headerHeight + headerMargin);
          }
        },
      });

      startY = pdf.lastAutoTable?.finalY + 20;
      if (i < tables.length - 1) pdf.addPage();
    });
  }

  // ---------- CHARTS ----------
  const chartsEl = document.getElementById("charts-container");
  if (chartsEl) {
    const chartDivs = chartsEl.querySelectorAll("div");

    for (let i = 1; i < chartDivs.length; i++) {
      const div = chartDivs[i];
      const oldHeight = div.style.height;
      div.style.height = "auto";

      const canvas = await html2canvas(div, { scale: 2 });
      div.style.height = oldHeight;

      const imgData = canvas.toDataURL("image/jpeg", 0.9);

      const chartMargin = 40; // margin around chart
      const scaleX = (pageWidth - chartMargin * 2) / canvas.width;
      const scaleY = (pageHeight - chartMargin * 2) / canvas.height;
      const chartsScale = Math.min(scaleX, scaleY);

      pdf.addPage();
      pdf.addImage(
        imgData,
        "JPEG",
        (pageWidth - canvas.width * chartsScale) / 2,
        chartMargin,
        canvas.width * chartsScale,
        canvas.height * chartsScale,
        undefined,
        "FAST"
      );
    }
  }

  // ---------- GRAND TOTALS ----------
  const grandEl = document.getElementById("grandtotals-container");
  if (grandEl) {
    const grandCanvas = await html2canvas(grandEl, { scale: 1.2 });
    const grandImg = grandCanvas.toDataURL("image/jpeg", 0.7);

    const grandScale = Math.min(
      (pageWidth - sideMargin * 2) / grandCanvas.width,
      (pageHeight - topMargin * 2) / grandCanvas.height
    );

    pdf.addPage();
    pdf.addImage(
      grandImg,
      "JPEG",
      (pageWidth - grandCanvas.width * grandScale) / 2,
      topMargin,
      grandCanvas.width * grandScale,
      grandCanvas.height * grandScale,
      undefined,
      "FAST"
    );
  }

  // ---------- SAVE ----------
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
        <h1 style={{ textAlign: "center", marginBottom: "2rem", color: "red",  }}><b>Lube Salonicco</b></h1>
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
            ((order.moneyDetails?.timi_Polisis || 0)- order.moneyDetails?.FPA - order.moneyDetails.timi_Timokatalogou   - totalDamages).toFixed(2),
            order.moneyDetails?.timi_Polisis
              ? ((order.moneyDetails.timi_Polisis-order.moneyDetails.FPA-order.moneyDetails.timi_Timokatalogou-totalDamages) / (order.moneyDetails.timi_Polisis-order.moneyDetails.FPA) * 100).toFixed(2) + "%"
              : "0%"
          ].map((cell, i) => (
            <td key={i} style={{ border: "1px solid #ddd", padding: "8px" }}>{cell}</td>
          ))}
        </tr>
      );
    })}
  </tbody>
 <tfoot>
  <tr style={{ backgroundColor: "#e0e0e0", fontWeight: "bold", textAlign: "center" }}>
    <td colSpan={4}>Σύνολο</td>
    <td>{groupData.totalNetPrice.toFixed(0)}</td>
    <td>{groupData.orders.reduce((sum, o) => sum + (o.moneyDetails?.FPA || 0), 0).toFixed(0)}</td>
    <td>{groupData.totalCash.toFixed(0)}</td>
    <td>{groupData.totalBank.toFixed(0)}</td>
    <td>{groupData.orders.reduce((sum, o) => sum + (o.moneyDetails?.timi_Timokatalogou || 0), 0)}</td>
    <td>{groupData.totalDamages["Μεταφορά εξωτερικού"].toFixed(0)}</td>
    <td>{groupData.totalDamages["Μεταφορά εσωτερικού"].toFixed(0)}</td>
    <td>{groupData.totalDamages["Διάφορα"].toFixed(0)}</td>
    <td>{groupData.totalDamages["Τοποθέτηση"].toFixed(0)}</td>
    <td>{groupData.totalRevenue.toFixed(0)}</td>
    <td>
      {(groupData.totalProfit
        - groupData.totalDamages["Τοποθέτηση"]
        - groupData.totalDamages["Διάφορα"]
        - groupData.totalDamages["Μεταφορά εξωτερικού"]
        - groupData.totalDamages["Μεταφορά εσωτερικού"]
        - groupData.orders.reduce((sum, o) => sum + (o.moneyDetails?.FPA || 0), 0)
      ).toFixed(0)}
    </td>
    <td>
      {(() => {
        // compute average percentage
        if (!groupData.orders.length) return "0%";
       const totalPercentage = groupData.orders.reduce((sum, order) => {
  const damageSummary = summarizeDamages(order.moneyDetails?.damages);
  const totalDamages = Object.values(damageSummary).reduce((sum, val) => sum + val, 0);
  const netPrice = (order.moneyDetails?.timi_Polisis || 0) - (order.moneyDetails?.FPA || 0);
  const difference = netPrice
                     - (order.moneyDetails?.timi_Timokatalogou || 0)
                     - totalDamages;
  const pct = netPrice ? (difference / netPrice) * 100 : 0;
  return sum + pct;
}, 0);
        const avg = totalPercentage / groupData.orders.length;
        return avg.toFixed(2) + "%";
      })()}
    </td>
  </tr>
</tfoot>

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
{ label: "Profit", value: grandTotals.profit 
  - grandTotals.damages["Τοποθέτηση"] 
  - grandTotals.damages["Διάφορα"] 
  - grandTotals.damages["Μεταφορά εξωτερικού"] 
  - grandTotals.damages["Μεταφορά εσωτερικού"] - grandTotals.FPA, 
  color: "#FF9800" },
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
