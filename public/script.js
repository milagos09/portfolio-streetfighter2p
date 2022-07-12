const p1 = {
    id: "p1",
    doc: document.getElementById("character1"),
    hp: 200,
    top: 185,
    left: 100,
    action: "stand",
    frameNumber: 0,
    frameEnd: 4,
    direction: 1,
    special: function () {
        //create hadouken (create logic for hadouken cooldown)
        const node = document.createElement("div");
        const hadouken = document.getElementById("background").appendChild(node);
        hadouken.id = this.id;
        hadouken.className = "special-" + this.id;
        hadouken.style.top = this.top + 20 + "px";
        hadouken.style.left = this.left + 70 + "px";
    },
    sp: 100,
};

const p2 = {
    id: "p2",
    doc: document.getElementById("character2"),
    hp: 200,
    top: 185,
    left: 400,
    action: "stand",
    frameNumber: 0,
    frameEnd: 4,
    direction: -1,
    special: function () {
        //create hadouken
        const node = document.createElement("div");
        const hadouken = document.getElementById("background").appendChild(node);
        hadouken.id = this.id;
        hadouken.className = "special-" + this.id;
        hadouken.style.top = this.top + "px";
        hadouken.style.left = this.left - 30 + "px";
    },
    sp: 100,
};

const players = { p1, p2 };

function gameOver() {
    document.getElementById("gameover").style.display = "block";
    document.getElementById("background").innerHTML = "";
}

function sound(s) {
    new Audio(`./assets/${s}`).play();
}

function updateDisplay() {
    p1.doc.style.top = p1.top + "px";
    p1.doc.style.left = p1.left + "px";
    p2.doc.style.top = p2.top + "px";
    p2.doc.style.left = p2.left + "px";

    document.getElementById("healthbar1").style.width = p1.hp + "px";
    document.getElementById("healthbar2").style.width = p2.hp + "px";
    document.getElementById("special-bar1").style.width = p1.sp + "px";
    document.getElementById("special-bar2").style.width = p2.sp + "px";
    if (p1.sp < 100) p1.sp += 0.5;
    if (p2.sp < 100) p2.sp += 0.5;

    if (p1.hp <= 0) {
        document.getElementById("healthbar1").style.width = "0px";
        alert("Player 2 won!");
        gameOver();
    }
    if (p2.hp <= 0) {
        document.getElementById("healthbar2").style.width = "0px";
        alert("Player 1 won!");
        gameOver();
    }
}

function projectiles(p) {
    const specials1 = document.getElementsByClassName(`special-${p.id}`);
    let direction = p.direction;
    let y;
    for (let i = 0; i < specials1.length; i++) {
        y = Number(specials1[i].style.left.replace("px", "")) + 20 * direction;
        specials1[i].style.left = y + "px";
        if (y >= 800 || y <= 0) {
            specials1[i].remove();
        } else if (detectCollision(specials1[i], 15 * direction)) {
            hitPlayer(20, p);
            specials1[i].remove();
        }
    }
}

function detectCollision(obj1, offset = 0) {
    const x1 = Number(obj1.style.left.replace("px", ""));
    const y1 = Number(obj1.style.top.replace("px", ""));

    let obj2;
    if (obj1.id == "character1" || obj1.id == "p1") {
        obj2 = p2.doc;
    } else if (obj1.id == "character2" || obj1.id == "p2") {
        obj2 = p1.doc;
    }

    const x2 = Number(obj2.style.left.replace("px", ""));
    const y2 = Number(obj2.style.top.replace("px", ""));

    if (x1 + offset >= x2 && (obj1.id == "character1" || obj1.id == "p1")) {
        return true;
    } else if (x1 + offset <= x2 && p2.action != "right" && (obj1.id == "character2" || obj1.id == "p2")) {
        return true;
    } else if (obj1.id == "character2" && x1 - offset <= x2) {
        return true;
    } else return false;
}

function hitPlayer(damage = 0, p) {
    const impact = document.getElementById("impact");
    const block = document.getElementById("block");
    const damageBg = document.getElementById("damage");

    let enemy;

    if (p.id == "p1") {
        enemy = p2;
    } else if (p.id == "p2") {
        enemy = p1;
    } else alert("who's the enemy?");

    const hitBox = [enemy.top + "px", enemy.left + 5 + "px"];

    if (enemy.action == "block") {
        damage = 1;
        enemy.hp -= damage;
        block.style.display = "block";
        block.style.top = hitBox[0];
        block.style.left = hitBox[1];
        sound("block.ogg");
        setTimeout(() => {
            block.style.display = "none";
        }, 140);
    } else {
        enemy.hp -= damage;
        sound("hit.mp3");
        if (enemy == players[pos]) damageBg.style.display = "block";
        impact.style.display = "block";
        impact.style.top = hitBox[0];
        impact.style.left = hitBox[1];
        setTimeout(() => {
            impact.style.display = "none";
            damageBg.style.display = "none";
        }, 100);
    }
}

function action(p) {
    switch (p.action) {
        case "jump":
            {
                if (p.frameNumber < 4) {
                    p.top -= 20;
                } else {
                    p.top += 40;
                }

                if (p.top > 185) {
                    p.top = 185;
                }
                p.doc.style.top = p.top + "px";

                p.doc.style.backgroundPosition = `${p.frameNumber * -70}px -640px`;
                p.frameNumber++;
            }
            break;
        case "punch":
            {
                p.doc.style.backgroundPosition = `${p.frameNumber * -70}px -160px`;
                p.frameNumber++;
            }
            if (p.frameNumber == 2) {
                if (detectCollision(p.doc, 45)) hitPlayer(5, p);
            }
            break;
        case "kick":
            {
                p.doc.style.backgroundPosition = `${p.frameNumber * -70}px -480px`;
                p.frameNumber++;
                if (p.frameNumber == 3) {
                    if (detectCollision(p.doc, 50)) hitPlayer(5, p);
                }
            }
            break;
        case "kick2":
            {
                p.doc.style.backgroundPosition = `${p.frameNumber * -70}px -560px`;
                p.frameNumber++;
                if (p.frameNumber == 3) {
                    if (detectCollision(p.doc, 50)) hitPlayer(10, p);
                }
            }
            break;
        case "special":
            {
                if (p.frameNumber == 0) sound("hadouken.mp3");
                p.doc.style.backgroundPosition = `${p.frameNumber * -70}px -0px`;
                p.frameNumber++;
                if (p.frameEnd == p.frameNumber) p.special();
                p.sp -= 5;
                if (p.sp < 0) p.sp = 0;
            }
            break;
        case "duck":
            {
                p.doc.style.backgroundPosition = `0px -720px`;
                p.frameNumber++;
            }
            break;
        case "left":
            {
                p.doc.style.backgroundPosition = `${p.frameNumber * -70}px -240px`;
                p.frameNumber++;
                if (!detectCollision(p.doc, 35 * p.direction) || p.id == "p1") {
                    p.left -= 10;
                    p.doc.style.left = p.left + "px";
                }
            }
            break;
        case "right":
            {
                p.doc.style.backgroundPosition = `${p.frameNumber * -70}px -240px`;
                p.frameNumber++;
                if (!detectCollision(p.doc, 35) || p.id == "p2") {
                    p.left += 10;
                    p.doc.style.left = p.left + "px";
                }
            }
            break;
        case "block":
            {
                p.doc.style.backgroundPosition = `-220px -480px`;
                p.frameNumber++;
            }
            break;

        case "stand":
            {
                p.doc.style.backgroundPosition = `${p.frameNumber * -70}px -80px`;
                p.frameNumber++;
            }
            break;
        default:
            alert("No action");
    }
    if (p.frameNumber >= p.frameEnd && p.action != "stand" && p.action) {
        p.frameEnd = 3;
    }
    if (p.frameNumber >= p.frameEnd) {
        p.frameNumber = 0;
        p.action = "stand";
    }
}
