import { Model } from "sequelize";

export class User extends Model {
    declare public discordId: string;
    declare public audioFile: string;
}