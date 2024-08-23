const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const { v4: uuidv4 } = require('uuid');
uuidv4();

const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

//setting ejs
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    const customId = uuidv4();
    socket.on("send-location", (data) => { //socket se backend meh accept kiya
        io.emit("receive-location", {id: customId, ...data}) // ab yaha pe backend se sare frontend ke bando ko bhej rha hu ...kya kya bhej rha is us bande ki id aur jobhi hai latitude longitude sab kuch kaise ...data ke through
    });
    // console.log("a user connected");
    socket.on("disconnect", () => {
        io.emit("user-disconnected", customId)
    });
});

app.get("/", (req, res) => {
    res.render("index");
})


const PORT = 8001;
server.listen(PORT, () => {
    console.log(`Server is running at Port no ${PORT}`)
})