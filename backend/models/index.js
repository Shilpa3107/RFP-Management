const { Sequelize } = require('sequelize');
require('dotenv').config();

let dbUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/rfp_db';

// Validation for supported protocols
if (dbUrl.startsWith('mongodb')) {
    console.error("\n❌ CRITICAL ERROR: You have provided a MongoDB connection string.");
    console.error("   This backend is built with Sequelize and requires a SQL database (PostgreSQL or MySQL).");
    console.error("   Please update your .env file with a PostgreSQL or MySQL connection string.");
    console.error("   Example (Postgres): postgres://user:password@localhost:5432/rfp_db");
    console.error("   Example (MySQL): mysql://user:password@localhost:3306/rfp_db\n");
    process.exit(1);
}

const dialect = dbUrl.startsWith('postgres') ? 'postgres' : 'mysql';

const sequelize = new Sequelize(dbUrl, {
    dialect: dialect,
    logging: false,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Vendor = require('./Vendor')(sequelize, Sequelize);
db.RFP = require('./RFP')(sequelize, Sequelize);
db.Proposal = require('./Proposal')(sequelize, Sequelize);

// Associations
db.RFP.hasMany(db.Proposal, { foreignKey: 'rfpId' });
db.Proposal.belongsTo(db.RFP, { foreignKey: 'rfpId' });

db.Vendor.hasMany(db.Proposal, { foreignKey: 'vendorId' });
db.Proposal.belongsTo(db.Vendor, { foreignKey: 'vendorId' });

module.exports = db;
