import { DataTypes } from "sequelize"
import sequelize from "../db.js"

const CommentsModel = sequelize.define(
    "comment",
    {
        commentID: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }
)

export default CommentsModel