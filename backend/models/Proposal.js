module.exports = (sequelize, DataTypes) => {
    const Proposal = sequelize.define('Proposal', {
        rawContent: {
            type: DataTypes.TEXT, // The email body or extracted text
        },
        parsedData: {
            type: DataTypes.JSON, // Extracted prices, lead times, etc.
        },
        aiAnalysis: {
            type: DataTypes.JSON, // Summary, score, pros/cons
        },
        receivedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    });
    return Proposal;
};
