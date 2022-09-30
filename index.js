require('dotenv').config()

const axios = require('axios')

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'status') {
        const response = await axios.get(`http://${process.env.SERVER_IP}:1212/status`);
        
        const name = response.data.name;
        const players = response.data.players.toString();
        let status = ''
        let time = ''

        if (response && response.data.run_level == 0) {
            status = 'Lobby';
        } else if(response && response.data.run_level == 1) {
            status = 'Em jogo';
        } else if(response && response.data.run_level == 2) {
            status = 'Fim do jogo';
        }

        if (response && response.data.round_start_time) {
            const dataRoundStart = new Date(response.data.round_start_time);
            const dataAgora = new Date();
            const diff = dataAgora.getTime() - dataRoundStart.getTime(); // this is a time in milliseconds
            const diff_as_date = new Date(diff);
            time = `${diff_as_date.getUTCHours()} horas, ${diff_as_date.getUTCMinutes()} minutos`
        }

        
        const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(name)
        .addFields({ name: 'Online', value: players, inline: true })
        .addFields({ name: 'Status', value: status, inline: true })
        .addFields({ name: 'Tempo', value: time, inline: true })
        .setTimestamp()
        .setFooter({ text: 'Vem jogar com a gente!' });

      	await interaction.reply({ embeds: [ exampleEmbed ] });
    }
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
