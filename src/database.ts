import { DataTypes, Sequelize } from "sequelize";
import { User } from "./models/User";
// import * as fs from "fs";

export default async () => {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: 'database/db.sqlite',
    });

    await sequelize.authenticate();

    User.init({
        discordId: {
            type     : DataTypes.STRING,
            allowNull: false,
            unique   : true,
        },
        audioFile: {
            type     : DataTypes.STRING,
            allowNull: true,
        }
    }, { sequelize });

    await sequelize.sync();
}