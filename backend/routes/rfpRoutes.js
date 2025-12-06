const express = require('express');
const router = express.Router();
const { RFP, Vendor, Proposal } = require('../models');
const aiService = require('../services/aiService');
const emailService = require('../services/emailService');

// Create RFP from NL
router.post('/generate', async (req, res) => {
    try {
        const { prompt } = req.body;
        const structuredData = await aiService.generateRFPStructure(prompt);
        res.json(structuredData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Save RFP
router.post('/', async (req, res) => {
    try {
        const rfp = await RFP.create(req.body);
        res.json(rfp);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all RFPs
router.get('/', async (req, res) => {
    try {
        const rfps = await RFP.findAll();
        res.json(rfps);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single RFP
router.get('/:id', async (req, res) => {
    try {
        const rfp = await RFP.findByPk(req.params.id, {
            include: [Proposal]
        });
        res.json(rfp);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send RFP to Vendors
router.post('/:id/send', async (req, res) => {
    try {
        const { vendorIds } = req.body;
        const rfp = await RFP.findByPk(req.params.id);
        const vendors = await Vendor.findAll({
            where: {
                id: vendorIds
            }
        });

        for (const vendor of vendors) {
            await emailService.sendRFP(vendor.email, rfp.structuredData);
        }

        rfp.status = 'sent';
        rfp.sentToVendors = vendorIds;
        await rfp.save();

        res.json({ message: 'RFP sent to vendors' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Compare Proposals
router.get('/:id/compare', async (req, res) => {
    try {
        const rfp = await RFP.findByPk(req.params.id, {
            include: [Proposal]
        });

        if (!rfp.Proposals || rfp.Proposals.length === 0) {
            return res.json({ comparison: null, recommendation: "No proposals received yet." });
        }

        const comparison = await aiService.compareAndRecommend(rfp.structuredData, rfp.Proposals.map(p => p.parsedData));
        res.json(comparison);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
