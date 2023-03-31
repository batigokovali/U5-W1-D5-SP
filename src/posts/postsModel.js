import { DataTypes } from "sequelize"
import sequelize from "../db.js"
import CommentsModel from "../comments/commentsModel.js"

const PostsModel = sequelize.define(
    "post",
    {
        postID: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        text: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
    }
)

//ONE post to MANY comments
PostsModel.hasMany(CommentsModel, { foreignKey: { name: "postID", allowNull: false } })
CommentsModel.belongsTo(PostsModel, { foreignKey: { name: "postID", allowNull: false } })

export default PostsModel