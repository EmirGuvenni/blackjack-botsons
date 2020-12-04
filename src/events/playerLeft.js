module.exports = async(client, gameid, userid) => {
    let game = client.games.get(gameid);
    let player = game.players.get(userid);
    let playerTag = player.tag;

    game.players.delete(userid);
    // Remove from bets
    for(let i = 0; i < game.bets.length; i++) {
        if(userid === game.bets[i])
            game.bets.splice(i, 1);
    }
    // Remove from done
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
