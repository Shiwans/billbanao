const express = require("express");
const router = express.Router();
const Sale = require("../Model/Sale");
const Purchase = require("../Model/Purchase");
const Customer = require("../Model/Customer");
const authenticateToken = require("../middleware/authenticateToken");

// Dashboard route
router.get("/dashboard", authenticateToken, async (req, res) => {
  const userId = req.user.id; // Ensure that `req.user` contains valid data

  try {
    // Total Sales for customers using find and reduce
    let totalSalesAmount = 0;
    try {
      const sales = await Sale.find({ userId, type: "customer" });
      totalSalesAmount = sales.reduce((total, sale) => total + sale.amount, 0);
    } catch (error) {
      console.error("Error fetching total sales:", error);
    }

    // Total Purchase Amount from suppliers using find and reduce
    let totalPurchaseAmount = 0;
    try {
      const purchases = await Purchase.find({ userId });
      totalPurchaseAmount = purchases.reduce((total, purchase) => total + purchase.amount, 0);
    } catch (error) {
      console.error("Error fetching total purchases:", error);
    }

    // Total Receivables using find and reduce
    let totalReceivableAmount = 0;
    try {
      const receivables = await Sale.find({
        userId,
        type: "customer",
        "paymentDetails.dueAmount": { $gt: 0 },
      });
      totalReceivableAmount = receivables.reduce(
        (total, receivable) => total + receivable.paymentDetails.dueAmount,
        0
      );
    } catch (error) {
      console.error("Error fetching total receivables:", error);
    }

    // Total Payable Amount using find and reduce
    let totalPayableAmount = 0;
    try {
      const payables = await Purchase.find({
        userId,
        "paymentDetails.dueAmount": { $gt: 0 },
      });
      totalPayableAmount = payables.reduce(
        (total, payable) => total + payable.paymentDetails.dueAmount,
        0
      );
    } catch (error) {
      console.error("Error fetching total payables:", error);
    }

    // Total Number of Customers
    const customerCount = await Customer.countDocuments({ userId });

    // Total kg sold using find and reduce
    let totalKgSold = 0;
    try {
      const kgSold = await Sale.find({ userId, type: "customer" });
      totalKgSold = kgSold.reduce((total, sale) => total + sale.quantity, 0);
    } catch (error) {
      console.error("Error fetching total kg sold:", error);
    }

    // Response
    const responseData = {
      salesAmount: totalSalesAmount,
      purchaseAmount: totalPurchaseAmount,
      custCount: customerCount,
      receivableAmount: totalReceivableAmount,
      payableAmount: totalPayableAmount,
      totalKg: totalKgSold,
    };

    console.log("Dashboard data:", responseData); // Log response data
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching dashboard data:", { userId, error });
    res
      .status(500)
      .json({ error: "Internal Server Error. Please try again later." });
  }
});

module.exports = router;


