import {GetData} from '../net/BGGConnector.js';
import {table} from 'table';
let users = []
let noGames = 0
let byGame = []
let tableTemplate = {
    border: {
        topBody: `─`,
        topJoin: `┬`,
        topLeft: `┌`,
        topRight: `┐`,

        bottomBody: `─`,
        bottomJoin: `┴`,
        bottomLeft: `└`,
        bottomRight: `┘`,

        bodyLeft: `│`,
        bodyRight: `│`,
        bodyJoin: `│`,

        joinBody: `─`,
        joinLeft: `├`,
        joinRight: `┤`,
        joinJoin: `┼`
    },
    singleLine: true,
    columns: {
        0: { width: 50 },
        1: { width: 30 },
        2: { width: 30 },
        3: { width: 30 },
    }
}

const Run = () => {
    return new Promise((resolve, reject) => {
        GetData().then(data => {
            data.plays.play.forEach(play => {
                let game = byGame.findIndex(a => a.name === play.item._attributes.name)
                if (game < 0) {
                    byGame.push({name:play.item._attributes.name, gamesplayed: 1, players:[]})
                    game = byGame.findIndex(a => a.name === play.item._attributes.name)
                } else {
                    byGame[game].gamesplayed++
                }

                if (play.players && play.players.player && Array.isArray(play.players.player)) {
                    noGames++
                    play.players.player.forEach(player => {
                        let win = false
                        if (parseInt(player._attributes.win) === 1) {
                            win = true
                        }
                        if (player._attributes.name) {
                            let p = users.findIndex(p => p.name === player._attributes.name)
                            let gp = byGame[game].players.findIndex(p => p.name === player._attributes.name)

                            if (p > -1) {
                                if (win) {
                                    users[p].wins ++
                                }
                                users[p].gamesplayed++
                            } else {
                                let wins = 0
                                if (win) {
                                    wins = 1
                                }
                                users.push({name:player._attributes.name, wins:wins, gamesplayed:1})
                            }

                            if (gp > -1) {
                                if (win) {
                                    byGame[game].players[gp].wins++
                                }
                                byGame[game].players[gp].gamesplayed++
                            } else {
                                let wins = 0
                                if (win) {
                                    wins = 1
                                }
                                byGame[game].players.push({name:player._attributes.name, wins:wins, gamesplayed:1})
                            }
                        }
                    })
                } else {
                    // SOLO GAME DO NOT COUNT
                }
            })
        }).then((r) => {
            byGame.sort((a, b) => {
                const nameA = a.name.toUpperCase(); // ignore upper and lowercase
                const nameB = b.name.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                // names must be equal
                return 0;;
            })
            let response = ""
            tableTemplate.header = {
                alignment: 'center',
                    content: 'Total games: ' + noGames,
            }
            let userTableData = []
            userTableData.push(["NAME", "WINS", "GAMES PLAYED", "WIN PERCENTAGE"]);
            for (let i=0;i<users.length;i++) {
                let wr = users[i].wins / users[i].gamesplayed
                users[i].winPercentage = (wr * 100).toFixed(2)
                userTableData.push([users[i].name, users[i].wins, users[i].gamesplayed, users[i].winPercentage + "%"])
            }
            let UserTable = table(userTableData, tableTemplate)
            response += UserTable + "\n\n"
            for (let i=0;i<byGame.length;i++) {
                let gameTableData = []
                tableTemplate.header = {
                    alignment: 'center',
                    content: byGame[i].name + ", Total plays: " + byGame[i].gamesplayed,
                }
                gameTableData.push(["NAME", "WINS", "GAMES PLAYED", "WIN PERCENTAGE"]);
                for (let j = 0; j < byGame[i].players.length; j++) {
                    let wr = byGame[i].players[j].wins / byGame[i].players[j].gamesplayed
                    byGame[i].players[j].winPercentage = (wr * 100).toFixed(2)
                    gameTableData.push([byGame[i].players[j].name, byGame[i].players[j].wins, byGame[i].players[j].gamesplayed, byGame[i].players[j].winPercentage])
                }
                gameTableData.push(["TOTAL GAMES", "", byGame[i].gamesplayed, ""]);
                let GameTable = table(gameTableData,tableTemplate)
                response += GameTable + "\n"
            }
            resolve(response)
        })
    })
}

export {Run};