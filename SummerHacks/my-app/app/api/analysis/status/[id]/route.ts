import { NextRequest, NextResponse } from 'next/server';

// Realistic mock analysis data that populates the entire dashboard
const MOCK_ANALYSIS = {
  status: "completed",
  savings_score: 62,
  monthly_waste: 4850,
  raw_5_year_loss: 291000,
  future_invested_value: 422580,
  highest_spend_category: "Food Delivery",
  emotional_message:
    "You spent ₹4,850 on food delivery alone this month. That's ₹58,200/year — enough for a round-trip flight to Bali. Your future self is watching.",
  good_habits: [
    "No impulse purchases above ₹2,000 detected",
    "Consistent UPI payments suggest budgeting discipline",
    "Subscription costs are under the 5% threshold",
  ],
  money_mirror_prediction:
    "If you continue this pattern, you'll lose ₹2.91L in 5 years. But redirecting just 40% of food delivery spend into a SIP would grow to ₹4.22L.",
  trigger_genome: "Late-night ordering between 10 PM – 1 AM accounts for 68% of food delivery spend.",
  trend_detection: "Food delivery spending increased 23% month-over-month. Weekend splurges are the primary driver.",
  spending_breakdown: {
    "Food Delivery": 4850,
    "Entertainment": 1200,
    "Transport": 950,
    "Shopping": 2300,
    "Subscriptions": 799,
    "Groceries": 3200,
  },
  before_after_projection: {
    waste_before: [15000, 14500, 14800, 15200, 14900, 15500],
    waste_after: [15000, 13200, 11800, 10500, 9400, 8600],
  },
  agent_analysis: {
    savings_score: 62,
    monthly_waste: 4850,
    compounded_five_year_cost: 291000,
    future_invested_value: 422580,
    highest_spend_category: "Food Delivery",
    future_self_message:
      "You spent ₹4,850 on food delivery alone this month. That's ₹58,200/year — enough for a round-trip flight to Bali. Your future self is watching.",
    spending_breakdown: {
      "Food Delivery": 4850,
      "Entertainment": 1200,
      "Transport": 950,
      "Shopping": 2300,
      "Subscriptions": 799,
      "Groceries": 3200,
    },
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Return mock completed analysis data immediately
  return NextResponse.json(MOCK_ANALYSIS, { status: 200 });
}
