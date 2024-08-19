// Crud.js
const { sequelize } = require('./Sequelize');
const { DataTypes } = require('sequelize');

class Database {
    constructor() {
        this.sequelize = sequelize;
    }

    async createTable(modelName, attributes) {
        const model = this.sequelize.define(modelName, attributes, {
            freezeTableName: true,
            timestamps: false,
        });
        await model.sync();
        console.log(`Table ${modelName} is ready.`);
        return model;
    }

    async insertData(model, data) {
        const instance = await model.create(data);
        console.log('Data inserted successfully:', instance.toJSON());
        return instance;
    }

    async readBy(model, conditions, logic = 'AND') {
        const results = await model.findAll({
            where: conditions,
            logging: console.log, // Remove this line to disable logging of raw queries
        });
        return results;
    }

    async updateBy(model, updateValues, conditions) {
        const result = await model.update(updateValues, {
            where: conditions,
            logging: console.log,
        });
        console.log('Rows updated:', result);
        return result;
    }

    async countRowsBy(model, conditions, logic = 'AND', returns = 'number') {
        const count = await model.count({
            where: conditions,
            logging: console.log,
        });
        return returns === 'boolean' ? count > 0 : count;
    }

    async deleteRowsBy(model, conditions) {
        const result = await model.destroy({
            where: conditions,
            logging: console.log,
        });
        console.log('Rows deleted:', result);
        return result;
    }
}

module.exports = Database;
