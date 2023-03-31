import Express from "express"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import { pgConnect } from "./db.js"
import { badRequestErrorHandler, genericErrorHandler, notFoundErrorHandler } from "./errorHandlers.js"
import usersRouter from "./users/users.js"
import experiencesRouter from "./experiences/experiences.js"
import postsRouter from "./posts/posts.js"
import commentsRouter from "./comments/comments.js"

const server = Express()
const port = process.env.PORT || 3001

//Middlewares
server.use(cors())
server.use(Express.json())

//Endpoints
server.use("/users", usersRouter)
server.use("/users", experiencesRouter)
server.use("/posts", postsRouter)
server.use("/posts", commentsRouter)

//Error Handlers
server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(genericErrorHandler)

await pgConnect()

server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server is running on port ${port}`)
})