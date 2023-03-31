import express from "express"
import createHttpError from "http-errors"
import { Op } from "sequelize"
import ExperiencesModel from "../experiences/experiencesModel.js"
import UsersModel from "./usersModel.js"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { v2 as cloudinary } from "cloudinary"
import multer from "multer"

const usersRouter = express.Router()

const cloudinaryUploader = multer({
    storage: new CloudinaryStorage({
        cloudinary,
        params: {
            folder: "U5-W1-D5-SP/avatars",
        },
    }),
}).single("avatar")

//POST a picture to user
usersRouter.post("/:userID/picture", cloudinaryUploader, async (req, res, next) => {
    try {
        const [numberOfUpdatedRows, updatedRecords] = await UsersModel.update({ image: req.file.path }, { where: { userID: req.params.userID }, returning: true })
        if (numberOfUpdatedRows === 1) {
            res.send(updatedRecords[0])
        } else {
            next(createHttpError(404, `Post with id ${req.params.userID} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

//POST a user
usersRouter.post("/", async (req, res, next) => {
    try {
        const { userID } = await UsersModel.create(req.body)
        res.status(201).send({ userID })
    } catch (error) {
        next(error)
    }
})

//GET users
usersRouter.get("/", async (req, res, next) => {
    try {
        const query = {}
        const url = req.protocol + "://" + req.get("host") + req.originalUrl;
        let links = []
        const { count, rows } = await UsersModel.findAndCountAll({
            where: { ...query },
            limit: req.query.limit,
            offset: req.query.offset,
            attributes: ["firstName", "lastName", "email", "bio", "title", "area", "image", "userID"],
            include: [
                { model: ExperiencesModel, attributes: ["role", "company", "startDate", "endDate", "description", "area", "image", "expID"] }
            ]
        })
        res.send({ count, rows, links })
    } catch (error) {
        next(error)
    }
})

//GET a user
usersRouter.get("/:userID", async (req, res, next) => {
    try {
        const { count, rows } = await UsersModel.findAndCountAll({
            where: { userID: req.params.userID },
            attributes: ["firstName", "lastName", "email", "bio", "title", "area", "image", "userID"],
            include: [
                { model: ExperiencesModel, attributes: ["role", "company", "startDate", "endDate", "description", "area", "image", "expID"] }
            ]

        })
        res.send({ count, rows })
    } catch (error) {
        next(error)
    }
})

//PUT a user
usersRouter.put("/:userID", async (req, res, next) => {
    try {
        const [numberOfUpdatedRows, updatedRecords] = await UsersModel.update(req.body, { where: { userID: req.params.userID }, returning: true })
        if (numberOfUpdatedRows === 1) {
            res.send(updatedRecords[0])
        } else {
            next(createHttpError(404, `User with id ${req.params.userID} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

//DELETE a user
usersRouter.delete("/:userID", async (req, res, next) => {
    try {
        const numberOfDeletedRows = await UsersModel.destroy({ where: { userID: req.params.userID } })
        if (numberOfDeletedRows === 1) {
            res.status(204).send()
        } else {
            next(createHttpError(404, `User with id ${req.params.userID} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

export default usersRouter