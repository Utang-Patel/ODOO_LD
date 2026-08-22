import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { formatCurrency } from "../utils/budgetUtils";

ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetChart = ({ totals, currency = "INR" }) => {
  const { transport, accommodation, activities, meals, totalCost } = totals;

  const data = {
    labels: ["Transport", "Accommodation", "Activities", "Meals"],
    datasets: [
      {
        data: [transport, accommodation, activities, meals],
        backgroundColor: [
          "#7C3AED", // Transport - Purple
          "#EC4899", // Accommodation - Pink
          "#F97316", // Activities - Orange
          "#06B6D4"  // Meals - Cyan
        ],
        borderWidth: 3,
        borderColor: "#070B1A",
        hoverOffset: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const val = context.raw || 0;
            const pct = totalCost > 0 ? ((val / totalCost) * 100).toFixed(1) : 0;
            return ` ${context.label}: ${formatCurrency(val, currency)} (${pct}%)`;
          }
        }
      }
    },
    cutout: "70%"
  };

  return (
    <div className="position-relative d-flex flex-column align-items-center justify-content-center h-100 py-3">
      <div style={{ height: "250px", width: "100%", maxWidth: "280px" }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default BudgetChart;
