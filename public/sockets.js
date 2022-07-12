const socket = io();
const gameSpeed = 120;
let name = prompt("Name: ");
let id;
let pos = null;

socket.emit("enter_room", name);

socket.on("get_id", function (socket_id) {
    id = socket_id;
});

socket.on("current_players", function (data) {
    if (data[0].name != null) {
        $("#join1").prop("disabled", true);
        $("#join1").text(data[0].name);
    } else {
        $("#join1").prop("disabled", false);
        $("#join1").text(`Join as Player1`);
    }
    if (data[1].name != null) {
        $("#join2").prop("disabled", true);
        $("#join2").text(data[1].name);
    } else {
        $("#join2").prop("disabled", false);
        $("#join2").text(`Join as Player2`);
    }
});

socket.on("action", function (data) {
    players[data.pos].action = data.action;
    players[data.pos].frameEnd = data.frameEnd;
});

socket.on("game_interval", function () {
    updateDisplay();
    action(p1);
    action(p2);
    projectiles(p1);
    projectiles(p2);
    if (pos != null) socket.emit("update_display", pos == "p1" ? p1 : p2);
});

socket.on("update_display", function (data) {
    const p = players[data.id];

    p.hp = data.hp;
    p.left = data.left;
    p.top = data.top;
    p.frameNumber = data.frameNumber;
    p.sp = data.sp;
    p.action = data.action;
});

$(".join").click(function () {
    if (pos != null) return;
    $(this).prop("disabled", true);
    $(this).text(name);
    pos = $(this).val();
    socket.emit($(this).val(), { name: name, id: id });

    ////////////////// CONTROLS:

    document.onkeydown = function (e) {
        if (pos == null) return;
        if (players[pos].action != "stand") return;

        switch (e.key) {
            case " ":
                {
                    socket.emit("action", { pos: pos, action: "jump", frameEnd: 6 });
                }
                break;
            case "q":
                {
                    socket.emit("action", { pos: pos, action: "punch", frameEnd: 2 });
                }
                break;
            case "w":
                {
                    socket.emit("action", { pos: pos, action: "kick", frameEnd: 4 });
                }
                break;
            case "e":
                {
                    socket.emit("action", { pos: pos, action: "kick2", frameEnd: 5 });
                }
                break;
            case "r":
                {
                    if (players[pos].sp > 5) {
                        socket.emit("action", { pos: pos, action: "special", frameEnd: 4 });
                    }
                }
                break;
            case "ArrowUp":
                {
                    socket.emit("action", { pos: pos, action: "jump", frameEnd: 6 });
                }
                break;
            case "ArrowDown":
                socket.emit("action", { pos: pos, action: "duck", frameEnd: 0 });

                break;
            case "ArrowLeft":
                {
                    socket.emit("action", { pos: pos, action: "left", frameEnd: 5 });
                }
                break;
            case "ArrowRight":
                {
                    socket.emit("action", { pos: pos, action: "right", frameEnd: 5 });
                }
                break;
            case "a":
                {
                    socket.emit("action", { pos: pos, action: "block", frameEnd: 5 });
                }
                break;

            default:
                {
                    socket.emit("action", { pos: pos, action: "stand", frameEnd: 3 });
                }
                break;
        }
        if (players[pos].action != "stand") players[pos].frameNumber = 0;
    };
});
