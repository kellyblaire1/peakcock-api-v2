// otpModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/Sequelize');

const OTP = sequelize.define('OTP', {
    otp: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true,
        },
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(Date.now() + 15 * 60 * 1000)
    },
    verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    timestamps: false, // Disable automatic createdAt and updatedAt fields
    tableName: 'pk_app_otps',
    hooks: {
        beforeCreate(otp) {
            otp.expires_at = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes in milliseconds
            console.error(`Your OTP is ${otp}`);
        }
    }
});

// Automatically set expires_at to 15 minutes from the time of creation
// OTP.beforeCreate((otp) => {
//     console.error(`Your OTP is ${otp}`);
// });

module.exports = OTP;
