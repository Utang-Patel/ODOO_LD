import React from "react";
import { motion } from "framer-motion";
import { formatCurrency } from "../utils/budgetUtils";

const BudgetCategoryCard = ({ category, amount, totalCost, currency = "INR" }) => {
  const percentage = totalCost > 0 ? Math.round((amount / totalCost) * 100) : 0;

  const getCategoryTheme = (cat) => {
    switch (cat) {
      case "Transport":
        return {
          icon: "bi-airplane-fill",
          color: "#7C3AED",
          badgeBg: "rgba(124, 58, 237, 0.2)",
          barGradient: "linear-gradient(90deg, #7C3AED 0%, #EC4899 100%)"
        };
      case "Accommodation":
        return {
          icon: "bi-building-fill",
          color: "#EC4899",
          badgeBg: "rgba(236, 72, 153, 0.2)",
          barGradient: "linear-gradient(90deg, #EC4899 0%, #F97316 100%)"
        };
      case "Activities":
        return {
          icon: "bi-ticket-perforated-fill",
          color: "#F97316",
          badgeBg: "rgba(249, 115, 22, 0.2)",
          barGradient: "linear-gradient(90deg, #F97316 0%, #06B6D4 100%)"
        };
      case "Meals":
      default:
        return {
          icon: "bi-cup-hot-fill",
          color: "#06B6D4",
          badgeBg: "rgba(6, 182, 212, 0.2)",
          barGradient: "linear-gradient(90deg, #06B6D4 0%, #7C3AED 100%)"
        };
    }
  };

  const theme = getCategoryTheme(category);

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="gt-glass-card p-4 h-100 d-flex flex-column justify-content-between shadow-lg"
    >
      <div>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div
            className="p-2.5 rounded-3 d-flex align-items-center justify-content-center border border-white border-opacity-10"
            style={{ backgroundColor: theme.badgeBg, color: theme.color, width: "46px", height: "46px" }}
          >
            <i className={`bi ${theme.icon} fs-5`}></i>
          </div>
          <span className="badge rounded-pill bg-dark text-white border border-white border-opacity-20 fw-bold px-3 py-1.5 font-heading">
            {percentage}%
          </span>
        </div>

        <span className="text-white-50 small fw-semibold uppercase tracking-wider d-block mb-1 font-heading">{category}</span>
        <h4 className="font-heading fw-extrabold text-white mb-3">
          {formatCurrency(amount, currency)}
        </h4>
      </div>

      <div className="mt-2">
        <div className="progress rounded-pill bg-dark overflow-hidden" style={{ height: "6px" }}>
          <div
            className="progress-bar rounded-pill transition-all"
            role="progressbar"
            style={{ width: `${percentage}%`, background: theme.barGradient }}
            aria-valuenow={percentage}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
    </motion.div>
  );
};

export default BudgetCategoryCard;
