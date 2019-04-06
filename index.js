//importazione librerie e settaggio del server
const express = require("express")
const app = express()
app.use(express.static("public"))
const server = app.listen("80")
const io = require("socket.io")(server)

let resistenza = 0 //variabile resistenza
io.on("connection", socket=>{ //quando un client si connette
    const interval = setInterval(()=>{ //ogni secondo manda un evento chiamato "resistenza" con il valore della resistenza
        socket.emit("resistenza", resistenza)
    }, 1000)
    socket.on("disconnect", ()=>{ //quando il client si disconnette togli l'intervallo
        clearInterval(interval)
    })
})


const five = require("johnny-five") //importa la libreria "johnny-five"

const Pin = five.Pin //classe Pin
const Board = five.Board //classe Board

const arduino = new Board()
arduino.on("ready", async ()=>{ //quando l'arduino è pronto, esegui la funzione asincrona
    //helper functions per con le promesse
    const delay = ms=>new Promise(res=>arduino.wait(ms, res))
    const analogRead = pin=>new Promise((res, err)=>pin.read((error, value)=>{
        if(error) err(err)
        else res(value)
    }))
    const resistenzaNota=36000 //il valore della resistenza nota

    const input=new Pin("A0") //il pin di input

    while(true){ //equivalente a void loop()
        //calcola la resistenza
        const digitalVolt = await analogRead(input)
        const analogVolt = 5*digitalVolt/1023
        const corrente = (5-analogVolt)/resistenzaNota
        resistenza = analogVolt/corrente //aggiorna la variabile resistenza
        await delay(1000) //delay di 1 secondo
    }
})