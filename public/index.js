const socket = io.connect('http://localhost')
socket.on("resistenza", resistenza=>{
    document.getElementById("resistenza").innerHTML=`La resistenza è ${resistenza} Ω`
})