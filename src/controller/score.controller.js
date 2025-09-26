const { eq } = require("drizzle-orm");
const db = require("../db/index");
const { leads, offers, results } = require("../db/schema");
const { scoreLeadWithAI } = require("../utils/gemini");

// Score all leads
const scoreLeads = async (req, res) => {
  try {
    // Get current offer
    const currentOffer = await db.select().from(offers).limit(1);
    if (currentOffer.length === 0) {
      return res.status(400).json({
        error: "No offer found. Please create an offer first",
      });
    }

    // Get all leads
    const allLeads = await db.select().from(leads);
    if (allLeads.length === 0) {
      return res.status(400).json({
        error: "No leads found. Please upload leads first",
      });
    }

    const offer = currentOffer[0];
    const scoredResults = [];

    // Score each lead
    for (const lead of allLeads) {
      // Calculate rule score (0-50)
      const ruleScore = calculateRuleScore(lead);

      // Calculate AI score using Gemini (0-50)
      const aiResult = await scoreLeadWithAI(lead, offer);
      const aiScore = aiResult.score;
      const aiIntent = aiResult.intent;
      const aiReasoning = aiResult.reasoning;

      // Calculate final score
      const finalScore = ruleScore + aiScore;

      // Use AI intent as final intent
      const intent = aiIntent;

      // Create reasoning combining rule and AI
      const reasoning = `Rule score: ${ruleScore}/50, AI score: ${aiScore}/50. ${aiReasoning}`;

      // Save result to database
      const result = await db
        .insert(results)
        .values({
          lead_id: lead.id,
          offer_id: offer.id,
          rule_score: ruleScore,
          ai_score: aiScore,
          final_score: finalScore,
          intent: intent,
          reasoning: reasoning,
        })
        .returning();

      scoredResults.push(result[0]);
    }

    res.json({
      message: "Leads scored successfully",
      count: scoredResults.length,
      results: scoredResults,
    });
  } catch (error) {
    console.error("Scoring error:", error);
    res.status(500).json({
      error: "Failed to score leads",
    });
  }
};

// Calculate rule-based score (0-50 points)
function calculateRuleScore(lead) {
  let score = 0;

  // Role relevance (0-20 points)
  const decisionMakers = ["ceo", "cto", "vp", "director", "head", "founder"];
  const influencers = ["manager", "lead", "senior"];

  const role = (lead.role || "").toLowerCase();

  if (decisionMakers.some((title) => role.includes(title))) {
    score += 20;
  } else if (influencers.some((title) => role.includes(title))) {
    score += 10;
  }

  // Industry match (0-20 points) - simple check for now
  const industry = (lead.industry || "").toLowerCase();
  if (
    industry.includes("saas") ||
    industry.includes("software") ||
    industry.includes("tech")
  ) {
    score += 20;
  } else if (industry.includes("business") || industry.includes("sales")) {
    score += 10;
  }

  // Data completeness (0-10 points)
  const fields = [
    lead.name,
    lead.role,
    lead.company,
    lead.industry,
    lead.location,
  ];
  const filledFields = fields.filter(
    (field) => field && field.trim() !== ""
  ).length;

  if (filledFields === 5) {
    score += 10;
  } else if (filledFields >= 3) {
    score += 5;
  }

  return Math.min(score, 50); // Cap at 50
}

// Calculate AI score (0-50 points) - simplified version
function calculateAIScore(lead, offer) {
  let score = 20; // Base score

  // Check if lead matches ideal use cases
  const useCase = offer.ideal_use_cases[0] || "";
  const industry = (lead.industry || "").toLowerCase();

  if (useCase.toLowerCase().includes("saas") && industry.includes("saas")) {
    score += 15;
  }

  if (
    useCase.toLowerCase().includes("b2b") &&
    (industry.includes("business") || industry.includes("software"))
  ) {
    score += 10;
  }

  // LinkedIn bio analysis (simple keyword matching)
  const bio = (lead.linkedin_bio || "").toLowerCase();
  if (
    bio.includes("growth") ||
    bio.includes("sales") ||
    bio.includes("marketing")
  ) {
    score += 5;
  }

  return Math.min(score, 50); // Cap at 50
}

// Generate reasoning text
function getReasoningText(lead, ruleScore, aiScore) {
  const reasons = [];

  if (ruleScore >= 30) {
    reasons.push("Strong role and industry match");
  } else if (ruleScore >= 15) {
    reasons.push("Good profile match");
  } else {
    reasons.push("Basic profile match");
  }

  if (aiScore >= 35) {
    reasons.push("fits ideal customer profile well");
  } else if (aiScore >= 25) {
    reasons.push("partial fit with target market");
  } else {
    reasons.push("limited alignment with offer");
  }

  return reasons.join(", ");
}

// Get scoring results
const getResults = async (req, res) => {
  try {
    // Get all results with lead details
    const allResults = await db
      .select({
        id: results.id,
        name: leads.name,
        role: leads.role,
        company: leads.company,
        intent: results.intent,
        score: results.final_score,
        reasoning: results.reasoning,
      })
      .from(results)
      .leftJoin(leads, leads.id, results.lead_id)
      .orderBy(results.final_score, "desc");

    res.json({
      message: "Results fetched successfully",
      count: allResults.length,
      results: allResults,
    });
  } catch (error) {
    console.error("Get results error:", error);
    res.status(500).json({
      error: "Failed to get results",
    });
  }
};

// Export results as CSV
const exportResults = async (req, res) => {
  try {
    // Get results
    const allResults = await db
      .select({
        name: leads.name,
        role: leads.role,
        company: leads.company,
        intent: results.intent,
        score: results.final_score,
        reasoning: results.reasoning,
      })
      .from(results)
      .leftJoin(leads, eq(leads.id, results.lead_id)) // <-- Fix here
      .orderBy(results.final_score, "desc");

    if (allResults.length === 0) {
      return res.status(404).json({
        error: "No results found",
      });
    }

    // Create CSV content
    const csvHeader = "name,role,company,intent,score,reasoning\n";
    const csvRows = allResults
      .map(
        (row) =>
          `"${row.name}","${row.role}","${row.company}","${row.intent}",${row.score},"${row.reasoning}"`
      )
      .join("\n");

    const csvContent = csvHeader + csvRows;

    // Set response headers for file download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="scoring-results.csv"'
    );
    res.send(csvContent);
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({
      error: "Failed to export results",
    });
  }
};

module.exports = {
  scoreLeads,
  getResults,
  exportResults,
};
