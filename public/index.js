const socket = io.connect('http://localhost') //connettiti al server
socket.on("resistenza", resistenza=>{ //quando ottieni la resistenza aggiorna la pagina
    document.getElementById("resistenza").innerHTML=`La resistenza è ${resistenza} Ω`
})