import { DataTypes } from "sequelize"
import sequelize from "../db.js"

const ExperiencesModel = sequelize.define(
    "experience",
    {
        expID: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        role: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        company: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        area: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }
)

export default ExperiencesModel