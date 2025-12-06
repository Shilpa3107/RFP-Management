const { sequelize, Vendor } = require('./models');

async function seed() {
    await sequelize.sync({ force: false });

    const vendors = [
        { name: "TechGiant Corp", email: "sales@techgiant.com", contactPerson: "John Doe" },
        { name: "Office Supplies Co", email: "orders@officesupplies.com", contactPerson: "Jane Smith" },
        { name: "Global Electronics", email: "b2b@globalelectronics.com", contactPerson: "Mike Johnson" }
    ];

    for (const v of vendors) {
        const exists = await Vendor.findOne({ where: { email: v.email } });
        if (!exists) {
            await Vendor.create(v);
            console.log(`Created vendor: ${v.name}`);
        }
    }

    console.log("Seeding complete.");
    process.exit(0);
}

seed().catch(err => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
