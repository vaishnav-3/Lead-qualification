const db = require('../db/index');
const { leads } = require('../db/schema');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

// Setup file upload
const upload = multer({ dest: 'uploads/' });

// Upload CSV file with leads
const uploadLeads = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        error: "Please upload a CSV file"
      });
    }

    // Check if file is CSV
    if (!req.file.originalname.endsWith('.csv')) {
      return res.status(400).json({
        error: "Only CSV files are allowed"
      });
    }

    const csvData = [];
    const filePath = req.file.path;

    // Read CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Add each row to array
        csvData.push({
          name: row.name || '',
          role: row.role || '',
          company: row.company || '',
          industry: row.industry || '',
          location: row.location || '',
          linkedin_bio: row.linkedin_bio || ''
        });
      })
      .on('end', async () => {
        // Save to database
        if (csvData.length > 0) {
          const savedLeads = await db.insert(leads).values(csvData).returning();
          
          // Delete uploaded file
          fs.unlinkSync(filePath);
          
          res.json({
            message: "CSV uploaded successfully",
            count: savedLeads.length
          });
        } else {
          res.status(400).json({
            error: "CSV file is empty"
          });
        }
      })
      .on('error', (error) => {
        res.status(400).json({
          error: "Error reading CSV file"
        });
      });

  } catch (error) {
    res.status(500).json({
      error: "Something went wrong"
    });
  }
};

// Get all leads
const getLeads = async (req, res) => {
  try {
    const allLeads = await db.select().from(leads);

    res.json({
      message: "Leads fetched successfully",
      count: allLeads.length,
      leads: allLeads
    });

  } catch (error) {
    res.status(500).json({
      error: "Could not get leads"
    });
  }
};

// Add multer middleware
const handleFileUpload = upload.single('file');

module.exports = {
  uploadLeads: [handleFileUpload, uploadLeads],
  getLeads
};