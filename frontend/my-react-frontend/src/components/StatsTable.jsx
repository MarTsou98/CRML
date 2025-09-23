import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


function StatsTable({ data, groupBy }) {
  if (!data || data.length === 0) return <p>No orders found.</p>;

  const groupedOrders = groupAndSummarizeOrders(data, groupBy);

  // Calculate grand totals
  let grandTotalRevenue = 0;
  let grandTotalProfit = 0;
  Object.values(groupedOrders).forEach(group => {
    grandTotalRevenue += group.totalRevenue;
    grandTotalProfit += group.totalProfit;
  });

  const handleDownloadExcel = () => {
    const wb = XLSX.utils.book_new();

    Object.entries(groupedOrders).forEach(([groupName, groupData]) => {
      const wsData = [
        ["Customer", "Date", "Total", "Profit"]
      ];

      groupData.orders.forEach(order => {
        wsData.push([
          `${order.customer_id?.firstName || ""} ${order.customer_id?.lastName || ""}`,
          new Date(order.DateOfOrder).toLocaleDateString(),
          order.moneyDetails?.timi_Polisis || 0,
          order.moneyDetails?.profit || 0
        ]);
      });

      // Add group totals
      wsData.push(["Total for " + groupName, "", groupData.totalRevenue, groupData.totalProfit]);

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, groupName.substring(0, 31)); // sheet names max 31 chars
    });

    // Add grand total sheet
    const grandTotalSheet = [
      ["Grand Total"],
      ["Total Revenue", grandTotalRevenue],
      ["Total Profit", grandTotalProfit]
    ];
    const wsGrand = XLSX.utils.aoa_to_sheet(grandTotalSheet);
    XLSX.utils.book_append_sheet(wb, wsGrand, "Grand Total");

    // Export
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
            {groupBy === "orderedFromCompany"
              ? "Company: "
              : groupBy === "salesperson_id"
              ? "Salesperson: "
              : "Contractor: "}
            {groupName}
          </h2>

          <table border="1" cellPadding="5" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Profit</th>
              </tr>
            </thead>
            <tbody>
              {groupData.orders.map(order => (
                <tr key={order._id}>
                  <td>{order.customer_id?.firstName} {order.customer_id?.lastName}</td>
                  <td>{new Date(order.DateOfOrder).toLocaleDateString()}</td>
                  <td>{order.moneyDetails?.timi_Polisis}</td>
                  <td>{order.moneyDetails?.profit}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
                <td colSpan={2}>Total for {groupName}</td>
                <td>{groupData.totalRevenue}</td>
                <td>{groupData.totalProfit}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}

      <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
        <p>Grand Totals:</p>
        <p>Total Revenue: {grandTotalRevenue}</p>
        <p>Total Profit: {grandTotalProfit}</p>
      </div>
    </div>
  );
}

export default StatsTable;

// Helper function remains the same
function groupAndSummarizeOrders(orders, groupBy) {
  const grouped = {};
  orders.forEach(order => {
    let key;
    if (groupBy === 'orderedFromCompany') {
      key = order.orderedFromCompany || 'Unassigned';
    } else if (groupBy === 'salesperson_id' || groupBy === 'contractor_id') {
      const person = order[groupBy];
      key = person ? `${person.firstName || ''} ${person.lastName || person.name || ''}`.trim() : 'Unassigned';
    }
    if (!grouped[key]) grouped[key] = { orders: [], totalRevenue: 0, totalProfit: 0 };
    grouped[key].orders.push(order);
    grouped[key].totalRevenue += order.moneyDetails?.timi_Polisis || 0;
    grouped[key].totalProfit += order.moneyDetails?.profit || 0;
  });
  return grouped;
}
