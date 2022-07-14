const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;

const server = app.listen(PORT);
const io = require("socket.io")(server);
app.use("/", express.static("public"));

app.set("view engine", "ejs");
const player1 = {
    name: null,
    id: null,
    default: { id: "p1", hp: 200, top: 185, left: 100, action: "stand", frameNumber: 0, sp: 200 },
};
const player2 = {
    name: null,
    id: null,
    default: { id: "p2", hp: 200, top: 185, left: 400, action: "stand", frameNumber: 0, sp: 200 },
};

let gameLoop;

//Start when client connects
io.on("connection", function (socket) {
    socket.on("enter_room", function (name) {
        console.log(name);
        socket.emit("get_id", socket.id);
        socket.emit("current_players", [player1, player2]);
    });

    socket.on("p1", function (data) {
        if (player2.id == data.id) return;
        player1.name = data.name;
        player1.id = data.id;
        console.log(player1);
        io.emit("current_players", [player1, player2]);
        if (player1.id != null && player2.id != null) {
            startGame();
        }
    });

    socket.on("p2", function (data) {
        if (player1.id == data.id) return;
        player2.name = data.name;
        player2.id = data.id;
        console.log(player2);
        io.emit("current_players", [player1, player2]);
        if (player1.id != null && player2.id != null) {
            io.emit("update_display", player1.default);
            io.emit("update_display", player2.default);
            startGame();
        }
    });

    socket.on("action", function (data) {
        io.emit("action", data);
    });

    socket.on("disconnect", function () {
        if (player1.id == socket.id) {
            player1.name = null;
            player1.id = null;
            startGame(false);
        } else if (player2.id == socket.id) {
            player2.name = null;
            player2.id = null;
            startGame(false);
        }
    });

    socket.on("update_display", function (data) {
        socket.broadcast.emit("update_display", data);
    });

    function startGame(start = true) {
        if (start) {
            gameLoop = setInterval(() => {
                io.emit("game_interval");
            }, 150);
        } else {
            clearInterval(gameLoop);
        }
    }
});

app.get("/", function (request, response) {
    response.render("StreetFighter");
});

console.log("server started at port: ", PORT);
