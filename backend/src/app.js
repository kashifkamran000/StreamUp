import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "50mb"}))
app.use(express.urlencoded({extended: true, limit: "50mb"}))
app.use(express.static("public"))
app.use(cookieParser())


import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
import playlistRouter from './routes/playlist.routes.js'
import commentRouter from './routes/comment.routes.js'
import likeRouter from './routes/like.routes.js'
import dashboardRouter from './routes/dashboard.routes.js'

app.use('/api/v1/user', userRouter)

app.use('/api/v1/video', videoRouter)

app.use('/api/v1/subscription', subscriptionRouter)

app.use('/api/v1/playlist', playlistRouter)

app.use('/api/v1/comment', commentRouter)

app.use('/api/v1/like', likeRouter)

app.use('/api/v1/dashboard', dashboardRouter)


export default app; 