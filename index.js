import express from 'express'
import * as http from "http";
import { Server } from 'socket.io'
import watcher from "./watcher.js";
import * as fs from "fs";
import wkhtmltopdf from 'wkhtmltopdf'

let args = process.argv

let pathToWatch = args[2];

if(!pathToWatch)
    throw new Error('favor de especificar el archivo')

const app = express()
const server = http.createServer(app)
const io = new Server(server)
const port = 3000

app.use(express.static('public'))


server.listen(port,()=> {
    console.log("server running in " + port)
})

io.on('connection', socket => {
    watcher(pathToWatch,()=>{
        wkhtmltopdf(
            fs.createReadStream(pathToWatch),
            {
                output: 'public/document.pdf',
                'enable-local-file-access': true
            },
            async (err,stream) => {
                socket.emit('reload','reload')
            }
        )
    }) // iniciamos a vigilar el archivo de manera asyncrona
})