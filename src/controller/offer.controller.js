const db = require('../db/index');
const { offers } = require('../db/schema');

// Create or update offer
const createOffer = async (req, res) => {
  try {
    const { name, value_props, ideal_use_cases } = req.body;

    // Basic validation
    if (!name || !value_props || !ideal_use_cases) {
      return res.status(400).json({
        error: "Missing required fields: name, value_props, ideal_use_cases"
      });
    }

    // Check if arrays are provided
    if (!Array.isArray(value_props) || !Array.isArray(ideal_use_cases)) {
      return res.status(400).json({
        error: "value_props and ideal_use_cases must be arrays"
      });
    }

    // Insert new offer
    const newOffer = await db.insert(offers).values({
      name,
      value_props,
      ideal_use_cases,
      updated_at: new Date()
    }).returning();

    res.status(201).json({
      message: "Offer created successfully",
      offer: newOffer[0]
    });

  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({
      error: "Failed to create offer"
    });
  }
};

// Get current offer
const getOffer = async (req, res) => {
  try {
    // Get the most recent offer
    const offer = await db.select().from(offers).orderBy(offers.created_at).limit(1);

    if (offer.length === 0) {
      return res.status(404).json({
        error: "No offer found"
      });
    }

    res.json({
      offer: offer[0]
    });

  } catch (error) {
    console.error('Error fetching offer:', error);
    res.status(500).json({
      error: "Failed to fetch offer"
    });
  }
};

module.exports = {
  createOffer,
  getOffer
};