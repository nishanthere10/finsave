import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { supabase } from '@/lib/supabase';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "dummy",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { raw_input, filename, stipend, goal, userId } = body;

    if (!raw_input) {
      return NextResponse.json({ error: "Missing raw input" }, { status: 400 });
    }

    const payload_id = `prod_${Date.now()}`;

    const prompt = `You are a strict financial analysis AI.
Analyze the following bank statement or transaction text.
Extract the spending breakdown, calculate monthly waste, savings score (0-100), 5 year loss, future invested value, and provide a harsh emotional message about their habits.
Return ONLY valid JSON matching this schema:
{
  "highest_spend_category": "string",
  "monthly_waste": number,
  "raw_5_year_loss": number,
  "future_invested_value": number,
  "savings_score": number,
  "emotional_message": "string",
  "spending_breakdown": { "CategoryName": number },
  "expenses": [
     { "amount": number, "category": "string", "description": "string" }
  ]
}

Monthly Stipend/Income: ${stipend}
Financial Goal: ${goal}

Transactions:
${raw_input.substring(0, 10000)}
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || "{}");

    if (userId && result.expenses && Array.isArray(result.expenses)) {
      try {
        const expensesToSave = result.expenses.map((e: any) => ({
          amount: e.amount,
          category: e.category,
          description: e.description,
          opportunity_cost_5yr: e.amount * 12 * 5,
          source: filename || "manual",
          payload_id,
          user_id: userId
        }));
        
        const { error } = await supabase.from('expenses').insert(expensesToSave);
        if (error) console.error("Failed to save expenses to DB:", error);
      } catch (dbError) {
        console.error("Database save error:", dbError);
      }
    }

    return NextResponse.json({
      status: "completed",
      payload_id,
      agent_analysis: {
        savings_score: result.savings_score || 0,
        monthly_waste: result.monthly_waste || 0,
        raw_5_year_loss: result.raw_5_year_loss || 0,
        future_invested_value: result.future_invested_value || 0,
        highest_spend_category: result.highest_spend_category || "Unknown",
        emotional_message: result.emotional_message || "We analyzed your spending.",
        spending_breakdown: result.spending_breakdown || {}
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process analysis" }, { status: 500 });
  }
}
