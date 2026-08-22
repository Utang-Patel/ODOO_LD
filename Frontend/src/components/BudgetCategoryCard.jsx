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
          color: "#0EA5E9",
          badgeBg: "rgba(14, 165, 233, 0.15)",
          barGradient: "linear-gradient(90deg, #0EA5E9 0%, #06D6C9 100%)"
        };
      case "Accommodation":
        return {
          icon: "bi-building-fill",
          color: "#06D6C9",
          badgeBg: "rgba(6, 214, 201, 0.15)",
          barGradient: "linear-gradient(90deg, #06D6C9 0%, #22C55E 100%)"
        };
      case "Activities":
        return {
          icon: "bi-ticket-perforated-fill",
          color: "#FF8A3D",
          badgeBg: "rgba(255, 138, 61, 0.15)",
          barGradient: "linear-gradient(90deg, #FF8A3D 0%, #FFD166 100%)"
        };
      case "Meals":
      default:
        return {
          icon: "bi-cup-hot-fill",
          color: "#FFD166",
          badgeBg: "rgba(255, 209, 102, 0.2)",
          barGradient: "linear-gradient(90deg, #FFD166 0%, #FF8A3D 100%)"
        };
    }
  };

  const theme = getCategoryTheme(category);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="gt-card p-3.5 h-100 d-flex flex-column justify-content-between"
    >
      <div>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div
            className="p-2.5 rounded-3 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: theme.badgeBg, color: theme.color, width: "42px", height: "42px" }}
          >
            <i className={`bi ${theme.icon} fs-5`}></i>
          </div>
          <span className="badge rounded-pill bg-light text-navy-deep border fw-bold px-2.5 py-1">
            {percentage}%
          </span>
        </div>

        <span className="text-muted small fw-semibold uppercase tracking-wider">{category}</span>
        <h4 className="font-heading fw-extrabold text-navy-deep mb-2">
          {formatCurrency(amount, currency)}
        </h4>
      </div>

      <div className="mt-2">
        <div className="progress rounded-pill bg-light overflow-hidden" style={{ height: "6px" }}>
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
