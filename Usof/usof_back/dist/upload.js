import { Sequelize } from "sequelize";
import mysql from "mysql2/promise";
import data from './config.json' assert { type: "json" };
const initializeSequelize = async () => {
    try {
        const connection = await mysql.createConnection({
            user: data.database.user,
            password: data.database.password,
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${data.database.database};`);
        const sequelize = new Sequelize(data.database.database, data.database.user, data.database.password, {
            dialect: "mysql",
            host: data.database.host,
        });
        return sequelize;
    }
    catch (error) {
        console.error("Error initializing Sequelize:", error);
        throw error;
    }
};
const sequelize = await initializeSequelize();
export default sequelize;
