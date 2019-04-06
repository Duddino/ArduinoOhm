//@ts-check

const express = require("express")
const app = express()
app.use(express.static("public"))
const server = app.listen("80")
const io = require("socket.io")(server)
let resistenza = 0
io.on("connection", (socket)=>{
    const interval = setInterval(()=>{
        socket.emit("resistenza", resistenza)
    }, 1000)
    socket.on("disconnect", ()=>{
        clearInterval(interval)
    })
})


const five = require("johnny-five")

const Pin = five.Pin
const Board = five.Board

const arduino = new Board()
arduino.on("ready", async ()=>{
    const delay = ms=>new Promise(res=>arduino.wait(ms, res))
    const analogRead = pin=>new Promise((res, err)=>pin.read((error, value)=>{
        if(error) err(err)
        else res(value)
    }))
    const resistenzaNota=36000

    const input=new Pin("A0")

    while(true){
        const digitalVolt = await analogRead(input)
        const analogVolt = 5*digitalVolt/1023
        const corrente = (5-analogVolt)/resistenzaNota
        resistenza = analogVolt/corrente
        console.log(resistenza)
        await delay(1000)
    }
})