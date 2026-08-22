// Budget Calculation Strategy:
// Transport, Accommodation, Meals come from manual Expenses list.
// Activities come from scheduled Itinerary Items + any manual Activities expenses.

export const formatCurrency = (amount, currency = "INR") => {
  const num = parseFloat(amount || 0);
  const symbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "JPY" ? "¥" : "₹";
  return `${symbol}${num.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export const calculateBudgetTotals = (expenses = [], itineraryItems = []) => {
  let transport = 0;
  let accommodation = 0;
  let meals = 0;
  let activitiesExpenses = 0;

  // Process Expenses table items
  expenses.forEach((exp) => {
    const val = parseFloat(exp.amount || 0);
    if (exp.category === "Transport") transport += val;
    else if (exp.category === "Accommodation") accommodation += val;
    else if (exp.category === "Meals") meals += val;
    else if (exp.category === "Activities") activitiesExpenses += val;
  });

  // Calculate Activity costs from scheduled Itinerary Items
  let itineraryActivitiesCost = 0;
  itineraryItems.forEach((item) => {
    if (item.activity && item.activity.cost) {
      itineraryActivitiesCost += parseFloat(item.activity.cost || 0);
    }
  });

  const totalActivities = activitiesExpenses + itineraryActivitiesCost;
  const totalCost = transport + accommodation + totalActivities + meals;

  return {
    transport,
    accommodation,
    activities: totalActivities,
    meals,
    totalCost
  };
};

export const calculateAverageDailyCost = (totalCost, startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  if (days <= 0) return totalCost;
  return Math.round(totalCost / days);
};

export const getBudgetStatus = (totalCost, budgetLimit) => {
  if (!budgetLimit || parseFloat(budgetLimit) <= 0) {
    return {
      status: "within",
      percentage: 0,
      overAmount: 0,
      message: "Your trip is within budget."
    };
  }

  const limit = parseFloat(budgetLimit);
  const percentage = Math.min(100, Math.round((totalCost / limit) * 100));
  const rawPercentage = (totalCost / limit) * 100;

  if (totalCost > limit) {
    const overAmount = totalCost - limit;
    return {
      status: "over",
      percentage,
      rawPercentage,
      overAmount,
      message: `You're over budget! ⚠️`
    };
  }

  if (rawPercentage >= 80) {
    return {
      status: "approaching",
      percentage,
      rawPercentage,
      overAmount: 0,
      message: "You're approaching your budget limit."
    };
  }

  return {
    status: "within",
    percentage,
    rawPercentage,
    overAmount: 0,
    message: "Your trip is within budget."
  };
};
