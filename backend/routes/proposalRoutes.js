const express = require('express');
const router = express.Router();
const { Proposal, RFP, Vendor } = require('../models');
const aiService = require('../services/aiService');

// Simulate receiving an email (Webhook or Manual Trigger)
router.post('/ingest', async (req, res) => {
    try {
        const { rfpId, vendorId, emailContent } = req.body;

        // Parse the content
        const parsedData = await aiService.parseVendorResponse(emailContent);

        const proposal = await Proposal.create({
            rfpId,
            vendorId,
            rawContent: emailContent,
            parsedData: parsedData
        });

        res.json(proposal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const proposals = await Proposal.findAll({ include: [Vendor, RFP] });
        res.json(proposals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
