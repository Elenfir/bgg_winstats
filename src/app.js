import {GetData} from './net/BGGConnector.js';
import 'dotenv/config'
let users = []
let noGames = 0
let byGame = []

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
    console.log("TOTAL GAMES REGISTERED WITH PLAYERS: " + noGames)
    for (let i=0;i<users.length;i++) {
        let c = users[i].wins / users[i].gamesplayed
        users[i].winPercentage = (c * 100).toFixed(2)
        console.log("NAME: " + users[i].name +  " || WINS: " + users[i].wins + " || GAMES_PLAYED: " + users[i].gamesplayed + " || WIN_PERCENTAGE: " + users[i].winPercentage)
    }
    console.log("")
    for (let i=0;i<byGame.length;i++) {
        console.log("GAME: " + byGame[i].name + " || NUMBER OF PLAYS: " + byGame[i].gamesplayed)
        for (let j = 0; j < byGame[i].players.length; j++) {
            let c = byGame[i].players[j].wins / byGame[i].players[j].gamesplayed
            byGame[i].players[j].winPercentage = (c * 100).toFixed(2)
            console.log("       NAME: " + byGame[i].players[j].name +  " || WINS: " + byGame[i].players[j].wins + " || GAMES_PLAYED: " + byGame[i].players[j].gamesplayed + " || WIN_PERCENTAGE: " + byGame[i].players[j].winPercentage)
        }
    }
})

