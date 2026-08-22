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
          "#0EA5E9", // Transport - Ocean Blue
          "#06D6C9", // Accommodation - Aqua
          "#FF8A3D", // Activities - Sunset Orange
          "#FFD166"  // Meals - Golden Yellow
        ],
        borderWidth: 2,
        borderColor: "#FFFFFF",
        hoverOffset: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 12,
            weight: "600"
          },
          color: "#071A2B"
        }
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
    <div className="position-relative d-flex flex-column align-items-center justify-content-center h-100 py-2">
      <div style={{ height: "240px", width: "100%", maxWidth: "320px" }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default BudgetChart;
