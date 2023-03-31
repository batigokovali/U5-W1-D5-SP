import express from "express"
import createHttpError from "http-errors"
import { Op } from "sequelize"
import ExperiencesModel from "./experiencesModel.js"
import UsersModel from "../users/usersModel.js"

const experiencesRouter = express.Router()

//POST an experience
experiencesRouter.post("/:userID/experiences", async (req, res, next) => {
    try {
        const { expID } = await ExperiencesModel.create({
            ...req.body,
            userID: req.params.userID
        })
        res.status(201).send({ expID })
    } catch (error) {
        next(error)
    }
})


//GET experiences from single user
experiencesRouter.get("/:userID/experiences", async (req, res, next) => {
    try {
        const experiences = await ExperiencesModel.findAll({ where: { userID: req.params.userID } })
        if (experiences) {
            res.send(experiences)
        } else {
            next(createHttpError(404, `User with id ${req.params.userID} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

//GET an experiences from single user
experiencesRouter.get("/:userID/experiences/:expID", async (req, res, next) => {
    try {
        const experiences = await ExperiencesModel.findAll({ where: { userID: req.params.userID, expID: req.params.expID } })
        if (experiences) {
            res.send(experiences)
        } else {
            next(createHttpError(404, `Experience with id ${req.params.expID} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

//PUT an experience
experiencesRouter.put("/:userID/experiences/:expID", async (req, res, next) => {
    try {
        const [numberOfUpdatedRows, updatedRecords] = await ExperiencesModel.update(req.body, { where: { userID: req.params.userID, expID: req.params.expID }, returning: true })
        if (numberOfUpdatedRows === 1) {
            res.send(updatedRecords[0])
        } else {
            next(createHttpError(404, `Experience with id ${req.params.expID} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

//DELETE an experience
experiencesRouter.delete("/:userID/experiences/:expID", async (req, res, next) => {
    try {
        const numberOfDeletedRows = await ExperiencesModel.destroy({ where: { userID: req.params.userID, expID: req.params.expID } })
        if (numberOfDeletedRows === 1) {
            res.status(204).send()
        } else {
            next(createHttpError(404, `Experience with id ${req.params.expID} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

export default experiencesRouter