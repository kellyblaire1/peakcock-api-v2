// models/User.js
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../Config/Sequelize');

class User extends Model {}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true
    },
    name: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    avatar: { type: DataTypes.STRING },
    banner: { type: DataTypes.STRING },
    badge: { type: DataTypes.STRING },
    gender: { type: DataTypes.STRING },
    bio: { type: DataTypes.TEXT },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING },
    date_of_birth: { type: DataTypes.DATEONLY },
    account: { type: DataTypes.TINYINT },
    signupType: { type: DataTypes.ENUM('email','social'), defaultValue: 'email' },
    socialId: { type: DataTypes.STRING },  // Store social login ID
    socialProvider: { type: DataTypes.STRING },  // Store social login provider
    city: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
    latitude: { type: DataTypes.DECIMAL(10,7) },
    longitude: { type: DataTypes.DECIMAL(10,7) },
    chat_permission: { type: DataTypes.ENUM('everyone','followers','following','none'), defaultValue: 'everyone' },
    isOnline: { type: DataTypes.BOOLEAN, defaultValue: false },
    password: { type: DataTypes.STRING, allowNull: true },  // Password may be null for social login
    role: { type: DataTypes.ENUM('regular', 'admin', 'superadmin'), defaultValue: 'regular'},
    account_status: { type: DataTypes.ENUM('active', 'inactive', 'suspended'), defaultValue: 'inactive'},
    identity_verification_status: { type: DataTypes.ENUM('unverified', 'verified'), defaultValue: 'unverified'},
    email_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    phone_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    ip: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING, defaultValue: 0 },
}, {
    sequelize,
    modelName: 'pk_app_users',
    timestamps: true,
    indexes: [
        { unique: true, fields: ['id', 'username'] }
    ]
});

module.exports = User;
