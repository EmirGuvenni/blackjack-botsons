const {calcHand, renderPlayer, renderDealer} = require('../utility');
const Card = require('../classes/card');
const Embed = require('discord.js').MessageEmbed;

module.exports = async(client, arg) => {
    let game = await client.games.get(arg.channel.id);

    // Deal 'till the dealer is above 17
    while(calcHand(arg.channel.id, "dealer") < 17) {
        game.dealer.push(new Card());
    }

    let dealerPower = calcHand(arg.channel.id, "dealer");

    game.bets.forEach(playerid => {
        let player = game.players.get(playerid);
        let playerPower = calcHand(arg.channel.id, playerid);

        // Set player stats
        if((dealerPower > 21 && 21 >= playerPower) || (dealerPower <= 21 && playerPower > dealerPower) && player.stats !== "Bust" && player.stats !== "Blackjack")
            player.stats = "Win";
        else if(playerPower <= 21 && dealerPower === playerPower && player.stats === "")
            player.stats = "Push";
        else if(dealerPower > playerPower && player.stats === "")
            player.stats = "Lose"
    });

    // Send the embed
    await arg.channel.send(new Embed()
        .setColor(0xFCFCFC)
        .setTitle("Results")
        .setDescription(`**Dealer:**(${calcHand(arg.channel.id, "dealer")})\n${renderDealer(game)}`)
        .addFields(renderPlayer(game)))

    // Reset the game
    game.dealer = [];
    game.bets = [];
    // Reset players
    game.players.forEach((player) => {
        switch(player.stats) {
            case "Win":
                player.cash += (player.bet * 2);
                client.handlers.get("stats")("win");
                break;
            case "Push":
                player.cash += player.bet;
                client.handlers.get("stats")("push");
                break;
            case "Blackjack":
                player.cash += ((player.bet / 2) + (player.bet * 2));
                client.handlers.get("stats")("blackjack");
                break;
            case "Lose":
                client.handlers.get("stats")("lose");
                break;
        }
        player.hand = [];
        player.bet = 0;
        player.stats = "";
        player.isStand = false;
    });
    client.emit("getBets", arg);
}
