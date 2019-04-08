//@ts-check

let resistenze
const tolleranza = 5
fetch("resistenze.json").then(value=>
    value.json().then(value=>{
        resistenze=value
        start()
    })
)
function start(){
    // @ts-ignore
    const socket = io.connect('http://localhost') //connettiti al server
    socket.on("resistenza", resistenza=>{ //quando ottieni la resistenza aggiorna la pagina
        document.getElementById("resistenza").innerHTML=`La resistenza è ${resistenza} Ω; La resistenza nominale è ${getNearest(resistenza)}Ω`
        // @ts-ignore
        draw(resistenza, document.getElementById("canvas"))
    })
}

/**
 * @param {number} number
 * @returns {string[]}
 */
function getColors(number){
    const colors = []
    const nominal = getNearest(number).toString()
    for(let i=0; i<2; i++){
        const char = nominal[i]
        colors.push(resistenze.colors[char])
    }
    colors.push(resistenze.colors[nominal.length-2])
    colors.push("#D4AF37")
    return colors
}
/**
 * @param {number} number
 * @returns {number} 
 */
function getNearest(number){
    const lowest = resistenze[tolleranza].reduce((prev, curr, i)=>{
        const score = Math.abs(number-curr)
        if(score<prev.score){
            return {index:i, score:score}
        }
        return prev
    }, {index:-1, score:Infinity})
    return resistenze[tolleranza][lowest.index]
}
/**
 * @param {number} resistenza
 * @param {HTMLCanvasElement} canvas
 */
function draw(resistenza, canvas){
    const w = canvas.width
    const h = canvas.height
    getColors(resistenza)
    const context = canvas.getContext("2d")
    context.fillStyle="#000000"
    context.fillRect(0,0, w, h)
    getColors(resistenza).forEach((color, i, arr)=>{
        context.fillStyle=color
        const percent=0.8
        context.fillRect(w/arr.length*i,0, w/arr.length, h)
    })
    
}