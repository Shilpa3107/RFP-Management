module.exports = (sequelize, DataTypes) => {
    const Vendor = sequelize.define('Vendor', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        contactPerson: {
            type: DataTypes.STRING,
        },
        categories: {
            type: DataTypes.JSON, // e.g., ['electronics', 'furniture']
            defaultValue: [],
        },
    });
    return Vendor;
};
