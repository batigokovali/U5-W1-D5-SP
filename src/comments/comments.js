import express from "express"
import createHttpError from "http-errors"
import { Op } from "sequelize"
import UsersModel from "../users/usersModel.js"
import CommentsModel from "./commentsModel.js"

const commentsRouter = express.Router()

//POST a comment
commentsRouter.post("/:postID/comments", async (req, res, next) => {
    try {
        const { commentID } = await CommentsModel.create({
            ...req.body,
            postID: req.params.postID,
            userID: req.body.userID
        })
        res.status(201).send({ commentID })
    } catch (error) {
        next(error)
    }
})

//GET comments from a post
commentsRouter.get("/:postID/comments", async (req, res, next) => {
    try {
        const url = req.protocol + "://" + req.get("host") + req.originalUrl;
        let links = []
        const { count, rows } = await CommentsModel.findAndCountAll({
            where: { postID: req.params.postID },
            limit: req.query.limit,
            offset: req.query.offset,
            attributes: ["comment", "commentID"],
            include: { model: UsersModel, attributes: ["firstName", "lastName", "title", "image", "userID"] }
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

//GET a comment
commentsRouter.get("/:postID/comments/:commentID", async (req, res, next) => {
    try {
        const { count, rows } = await CommentsModel.findAndCountAll({
            where: { postID: req.params.postID, commentID: req.params.commentID },
            limit: req.query.limit,
            offset: req.query.offset,
            attributes: ["comment", "commentID"],
            include: { model: UsersModel, attributes: ["firstName", "lastName", "title", "image", "userID"] }
        })
        res.send({ count, rows })
    } catch (error) {
        next(error)
    }
})

//PUT a comment
commentsRouter.put("/:postID/comments/:commentID", async (req, res, next) => {
    try {
        const [numberOfUpdatedRows, updatedRecords] = await CommentsModel.update(req.body, { where: { postID: req.params.postID, commentID: req.params.commentID }, returning: true })
        if (numberOfUpdatedRows === 1) {
            res.send(updatedRecords[0])
        } else {
            next(createHttpError(404, `Comment with id ${req.params.commentID} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

//DELETE a comment
commentsRouter.delete("/:postID/comments/:commentID", async (req, res, next) => {
    try {
        const numberOfDeletedRows = await CommentsModel.destroy({ where: { commentID: req.params.commentID } })
        if (numberOfDeletedRows === 1) {
            res.status(204).send()
        } else {
            next(createHttpError(404, `Comment with id ${req.params.commentID} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

export default commentsRouter