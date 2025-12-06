const express = require('express');
const router = express.Router();
const { Vendor } = require('../models');

router.get('/', async (req, res) => {
    try {
        const vendors = await Vendor.findAll();
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const vendor = await Vendor.create(req.body);
        res.json(vendor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
