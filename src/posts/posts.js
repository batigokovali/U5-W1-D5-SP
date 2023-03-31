import express from "express"
import createHttpError from "http-errors"
import { Op } from "sequelize"
import PostsModel from "./postsModel.js"
import UsersModel from "../users/usersModel.js"
import CommentsModel from "../comments/commentsModel.js"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { v2 as cloudinary } from "cloudinary"
import multer from "multer"

const postsRouter = express.Router()

const cloudinaryUploader = multer({
    storage: new CloudinaryStorage({
        cloudinary,
        params: {
            folder: "U5-W1-D5-SP/posts",
        },
    }),
}).single("post")

//POST a post with userID
postsRouter.post("/", async (req, res, next) => {
    try {
        const { postID } = await PostsModel.create({
            ...req.body,
            userID: req.body.userID
        })
        res.status(201).send({ postID })
    } catch (error) {
        next(error)
    }
})

//GET all posts
postsRouter.get("/", async (req, res, next) => {
    try {
        const query = {}
        const url = req.protocol + "://" + req.get("host") + req.originalUrl;
        let links = []
        const { count, rows } = await PostsModel.findAndCountAll({
            where: { ...query },
            limit: req.query.limit,
            offset: req.query.offset,
            attributes: ["text", "image", "postID"],
            include: [
                { model: UsersModel, attributes: ["firstName", "lastName", "title", "image", "userID"] },
                {
                    model: CommentsModel, attributes: ["comment", "commentID"],
                    include: { model: UsersModel, attributes: ["firstName", "lastName", "title", "image", "userID"] }
                }
            ],
        })
        if (req.query.offset && req.query.limit) {
            let prevlinkAsNumber = parseInt(req.query.offset) - parseInt(req.query.limit)
            let prevLink = url.replace(`offset=${req.query.offset}`, `offset=${prevlinkAsNumber.toString()}`)

            let nextLinkAsNumber = parseInt(req.query.limit) + parseInt(req.query.offset)
            let nextLink = url.replace(`offset=${req.query.offset}`, `offset=${nextLinkAsNumber.toString()}`)
            links = [{ prev: prevLink }, { next: nextLink }]
        }
        res.send({ count, rows, links })
    } catch (error) {
        next(error)
    }

})

//GET all posts with userID
postsRouter.get("/:userID", async (req, res, next) => {
    try {
        const url = req.protocol + "://" + req.get("host") + req.originalUrl;
        let links = []
        const { count, rows } = await PostsModel.findAndCountAll({
            where: { userID: req.params.userID },
            limit: req.query.limit,
            offset: req.query.offset,
            attributes: ["text", "image", "postID"],
            include: [
                { model: UsersModel, attributes: ["firstName", "lastName", "title", "image", "userID"] },
                {
                    model: CommentsModel, attributes: ["comment", "commentID"],
                    include: { model: UsersModel, attributes: ["firstName", "lastName", "title", "image", "userID"] }
                }
            ],
        })
        if (req.query.offset && req.query.limit) {
            let prevlinkAsNumber = parseInt(req.query.offset) - parseInt(req.query.limit)
            let prevLink = url.replace(`offset=${req.query.offset}`, `offset=${prevlinkAsNumber.toString()}`)

            let nextLinkAsNumber = parseInt(req.query.limit) + parseInt(req.query.offset)
            let nextLink = url.replace(`offset=${req.query.offset}`, `offset=${nextLinkAsNumber.toString()}`)
            links = [{ prev: prevLink }, { next: nextLink }]
        }
        res.send({ count, rows, links })
    } catch (error) {
        next(error)
    }
})

//PUT a post
postsRouter.put("/:postID", async (req, res, next) => {
    try {
        const [numberOfUpdatedRows, updatedRecords] = await PostsModel.update(req.body, { where: { postID: req.params.postID }, returning: true })
        if (numberOfUpdatedRows === 1) {
            res.send(updatedRecords[0])
        } else {
            next(createHttpError(404, `Post with id ${req.params.postID} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

//POST a picture to a post
postsRouter.post("/:postID/picture", cloudinaryUploader, async (req, res, next) => {
    try {
        const [numberOfUpdatedRows, updatedRecords] = await PostsModel.update({ image: req.file.path }, { where: { postID: req.params.postID }, returning: true })
        if (numberOfUpdatedRows === 1) {
            res.send(updatedRecords[0])
        } else {
            next(createHttpError(404, `Post with id ${req.params.postID} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

//DELETE a post
postsRouter.delete("/:postID", async (req, res, next) => {
    try {
        const numberOfDeletedRows = await PostsModel.destroy({ where: { postID: req.params.postID } })
        if (numberOfDeletedRows === 1) {
            res.status(204).send()
        } else {
            next(createHttpError(404, `Post with id ${req.params.postID} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

export default postsRouter