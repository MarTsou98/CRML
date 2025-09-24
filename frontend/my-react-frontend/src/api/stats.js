// src/api/stats.js
import axios from "axios";

const api = axios.create({
   baseURL: "http://localhost:5000/api" // adjust if different
});

export const fetchStats = async (start, end, groupBy) => {
  const res = await api.get("/orders/stats", {
    params: { start, end, groupBy },
  });
  return res.data;
};
