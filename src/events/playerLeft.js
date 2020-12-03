module.exports = async(client, gameid, userid) => {
    let game = client.games.get(gameid);
    let player = game.players.get(userid);
    let playerTag = player.tag;

    game.players.delete(userid);
    for(let i = 0; i < game.bets.length; i++) {
        if(userid === game.bets[i])
            game.bets.splice(i, 1);
    }
    for(let i = 0; i < game.expected.length; i++){
        if(userid === game.expected[i])
            game.expected.splice(i, 1);
    }
    for(let i = 0; i < game.done.length; i++){
        if(userid === game.done[i])
            game.done.splice(i, 1);
    }

    let channel = client.channels.cache.get(gameid);
    await channel.send(`**${playerTag}** left the game.`);

    // Remove the game if it's empty
    if(client.games.get(gameid).players.size === 0) {
        client.games.delete(gameid);
        channel.send("Game closed.");
    }
}
