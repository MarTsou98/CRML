const Order = require('../models/Order');
const Salesperson = require('../models/Salesperson');
const Contractor = require('../models/Contractor');
const mongoose = require('mongoose');
exports.getOrdersByType = async (req, res) => {
  try {
    const companies = ['Lube', 'Decopan', 'Sovet', 'Doors', 'Appliances', 'CounterTop'];

    const data = await Order.aggregate([
      {
        $group: {
          _id: "$orderedFromCompany",
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {};
    let total = 0;

    // Initialize all companies with 0
    companies.forEach(company => {
      result[company] = 0;
    });

    // Populate with actual counts and calculate total
    data.forEach(entry => {
      if (result.hasOwnProperty(entry._id)) {
        result[entry._id] = entry.count;
        total += entry.count;
      }
    });

    // Add total to the result
    result.total = total;

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.getTypeOfOrdersBySalesperson = async (req, res) => {
  try {
    const { salesperson_id } = req.params;

    if (!salesperson_id) {
      return res.status(400).json({ message: 'salesperson_id is required' });
    }

    const companies = ['Lube', 'Decopan', 'Sovet', 'Doors', 'Appliances', 'CounterTop'];

    const data = await Order.aggregate([
      {
        $match: {
          salesperson_id: new mongoose.Types.ObjectId(salesperson_id)
        }
      },
      {
        $group: {
          _id: "$orderedFromCompany",
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {};
    let total = 0;

    companies.forEach(company => {
      result[company] = 0;
    });

    data.forEach(entry => {
      if (result.hasOwnProperty(entry._id)) {
        result[entry._id] = entry.count;
        total += entry.count;
      }
    });

    result.total = total;

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.getTypeOfOrdersByContractor = async (req, res) => {
  try {
    const { contractor_id } = req.params;

    if (!contractor_id) {
      return res.status(400).json({ message: 'contractor_id is required' });
    }

    const companies = ['Lube', 'Decopan', 'Sovet', 'Doors', 'Appliances', 'CounterTop'];

    const data = await Order.aggregate([
      {
        $match: {
          contractor_id: new mongoose.Types.ObjectId(contractor_id)
        }
      },
      {
        $group: {
          _id: "$orderedFromCompany",
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {};
    let total = 0;

    companies.forEach(company => {
      result[company] = 0;
    });

    data.forEach(entry => {
      if (result.hasOwnProperty(entry._id)) {
        result[entry._id] = entry.count;
        total += entry.count;
      }
    });

    result.total = total;

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.getProfitBySalesperson = async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: "$salesperson_id",
          totalProfit: { $sum: "$moneyDetails.profit" },
          totalRevenue: { $sum: "$moneyDetails.timi_Polisis" },
          orderCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "salespeople", // collection name in MongoDB (lowercase plural)
          localField: "_id",
          foreignField: "_id",
          as: "salesperson"
        }
      },
      {
        $unwind: "$salesperson"
      },
      {
        $project: {
          _id: 0,
          salespersonId: "$_id",
          name: "$salesperson.name",
          totalProfit: 1,
          totalRevenue: 1,
          orderCount: 1
        }
      }
    ]);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.getProfitByContractor = async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: "$contractor_id",
          totalProfit: { $sum: "$moneyDetails.profit" },
          totalRevenue: { $sum: "$moneyDetails.timi_Polisis" },
          orderCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "contractors",
          localField: "_id",
          foreignField: "_id",
          as: "contractor"
        }
      },
      {
        $unwind: "$contractor"
      },
      {
        $project: {
          _id: 0,
          contractorId: "$_id",
          name: "$contractor.name",
          totalProfit: 1,
          totalRevenue: 1,
          orderCount: 1
        }
      }
    ]);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};



exports.getSummaryStats = async (req, res) => {
  try {
    const [totalOrders, totalRevenue, totalProfit] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: "$moneyDetails.timi_Polisis" } } }]),
      Order.aggregate([{ $group: { _id: null, profit: { $sum: "$moneyDetails.profit" } } }])
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalProfit: totalProfit[0]?.profit || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getStatsForOneSalesperson = async (req, res) => {
  const { id } = req.params;

  try {
    const salesperson = await Salesperson.findById(id);
    if (!salesperson) {
      return res.status(404).json({ message: 'Salesperson not found' });
    }

    const stats = await Order.aggregate([
  {
    $match: {
      salesperson_id: new mongoose.Types.ObjectId(id)
    }
  },
  {
    $group: {
      _id: "$salesperson_id",
      totalOrders: { $sum: 1 },
      totalRevenue: { $sum: "$moneyDetails.timi_Polisis" },
      totalProfit: { $sum: "$moneyDetails.profit" }
    }
  },
  {
    $lookup: {
      from: "salespeople",             // **collection name** in MongoDB (check yours!)
      localField: "_id",
      foreignField: "_id",
      as: "salespersonDetails"
    }
  },
  {
    $unwind: "$salespersonDetails"
  },
  {
    $project: {
      _id: 0,
      salespersonId: "$_id",
      totalOrders: 1,
      totalRevenue: 1,
      totalProfit: 1,
      salespersonDetails: 1            // <-- full salesperson document here
    }
  }
]);

    const result = stats[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      totalProfit: 0
    };

    res.json({
      salespersonId: id,
      name: salesperson.name,
      email: salesperson.email,
      ...result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getStatsForOneContractor = async (req, res) => {
  const { id } = req.params;

  try {
    const contractor = await Contractor.findById(id);
    if (!contractor) {
      return res.status(404).json({ message: 'Contractor not found' });
    }

    const stats = await Order.aggregate([
      {
        $match: {
          contractor_id: new mongoose.Types.ObjectId(id)
        }
      },
      {
        $group: {
          _id: "$contractor_id",
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$moneyDetails.timi_Polisis" },
          totalProfit: { $sum: "$moneyDetails.profit" }
        }
      }
    ]);

    const result = stats[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      totalProfit: 0
    };

    res.json({
      contractorId: id,
      name: contractor.name,
      email: contractor.email,
      ...result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};