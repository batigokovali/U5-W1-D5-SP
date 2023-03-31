import { DataTypes } from "sequelize"
import sequelize from "../db.js"
import ExperiencesModel from "../experiences/experiencesModel.js";
import PostsModel from "../posts/postsModel.js";
import CommentsModel from "../comments/commentsModel.js";

const UsersModel = sequelize.define(
    "user",
    {
        userID: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bio: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        title: {
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

//ONE user to MANY experiences
UsersModel.hasMany(ExperiencesModel, { foreignKey: { name: "userID", allowNull: false } })
ExperiencesModel.belongsTo(UsersModel, { foreignKey: { name: "userID", allowNull: false } })

//ONE user to MANY posts
UsersModel.hasMany(PostsModel, { foreignKey: { name: "userID", allowNull: false } })
PostsModel.belongsTo(UsersModel, { foreignKey: { name: "userID", allowNull: false } })

//ONE user to MANY comments
UsersModel.hasMany(CommentsModel, { foreignKey: { name: "userID", allowNull: false } })
CommentsModel.belongsTo(UsersModel, { foreignKey: { name: "userID", allowNull: false } })

export default UsersModel