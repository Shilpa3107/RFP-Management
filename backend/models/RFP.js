module.exports = (sequelize, DataTypes) => {
    const RFP = sequelize.define('RFP', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        originalPrompt: {
            type: DataTypes.TEXT,
        },
        structuredData: {
            type: DataTypes.JSON, // Stores the full parsed JSON (items, budget, etc.)
        },
        status: {
            type: DataTypes.ENUM('draft', 'sent', 'closed'),
            defaultValue: 'draft',
        },
        sentToVendors: {
            type: DataTypes.JSON, // Array of Vendor IDs
            defaultValue: [],
        },
    });
    return RFP;
};
