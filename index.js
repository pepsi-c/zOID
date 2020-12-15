require("dotenv").config();
const Discord = require('discord.js');
const fs = require('fs');
const got = require('got');
const ytdl = require('ytdl-core');

const prefix = process.env.BOT_PREFIX;
const token = process.env.BOT_TOKEN;

const bot = new Discord.Client();

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

const CommandManager = fs.readdirSync('./src/commands/');

CommandManager.forEach(c => {
    fs.readdir(`./src/commands/${c}/`, (err, files) => {
        if (err) throw err;
        console.log(`[CommandManager] Loaded ${files.length} commands of module ${c}`);

        files.forEach(f => {
            const commands = require(`./src/commands/${c}/${f}`);

            bot.commands.set(commands.name, commands);
            bot.aliases.set(commands.alias, commands);

            console.log(`[CommandManager] Name: ${commands.name} ( ${commands.alias} )`);
        });
        console.log("-----------------------------------------------");
    });
});

var time = new Date();
var timestamp = '[' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + ']';

bot.on('ready', () => {
    // console.log(`${timestamp} Logged in as ${bot.user.tag}!`);
    // console.log(`--------------------------------------------`);
    // console.log(`Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`);
    // console.log(`Bot is up and running`);
    // //console.log(bot.guilds);
    // //bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
    // console.log(`--------------------------------------------`);
    console.log('Your Bot is now Online.')
  let activities = [`Watching what pepsi is doing breh -download`, `-download`   ],i = 0;

  setInterval(() => bot.user.setActivity(`${activities[i++ %  activities.length]}`,  {type:"STREAMING",url:"https://www.twitch.tv/lobanjicaa"  }), 599)
});


bot.on('message', async (message) => {
    // Ignore any bot messages or messages that do not start with the prefix set
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const userCommand = args.shift().toLowerCase();
    const command = bot.commands.get(userCommand) || bot.aliases.get(userCommand);

    switch(userCommand) {
        case "reddit":
        case "fact": {
            const dependencies = [Discord, got];
            command.execute(message, args, dependencies);
            break;
        }
		  case "download": {
			const embed = new Discord.MessageEmbed();  
            embed.setTitle('Zoid ');
            embed.setDescription('download');
            embed.addField('ZOID isnt downloadable at this time :(((');
            embed.setColor('#00ff00');
            message.channel.send(embed);
            break;
        }
        case "music": {
            const dependencies = [ytdl];
            command.execute(message, args, dependencies);
            break;
        }
        case "help": {
            const embed = new Discord.MessageEmbed();
            embed.setTitle(':robot: Things I can do :robot: ')
            embed.addField(':dart:  FUN STUFF', '--------------');
            embed.addField('Music', `Stream music from YouTube: ${prefix}music`, true);
            embed.addField('Fact', `Get useless facts: ${prefix}fact | ${prefix}fact today`, true);
            embed.addField('Reddit', `Get random content from a subreddit: ${prefix}reddit [subreddit]`, true);
            embed.addField(':tools: USEFUL STUFF', '--------------');
            embed.addField('Ping', `View latency to server: ${prefix}ping`, true);
            embed.addField('Bot Status', `View bot info: ${prefix}info`, true);
            embed.setFooter('Note: This bot is a WIP. Expect frequent updates!');
            embed.setAuthor('Zoid Commands Help');
            message.channel.send(embed);
            break;
        }
        case "info": {
            const embed = new Discord.MessageEmbed();
            embed.setTitle(':information_source: Zoid Status');
            embed.setDescription('Here\'s some info about me');
            embed.addField(':white_check_mark: API Status', `ONLINE & bot latency to this server is ${Math.round(bot.ping)}ms`);
            embed.addField('');
            embed.addField('');
            embed.addField('');
            embed.setColor('#00ff00');
            embed.addField(':satellite_orbital: Server dominance', `Found ${bot.guilds.size} server instances with a population of ${bot.users.size} users`);
            message.channel.send(embed);
            break;
        }
        default:
            // If command sent by user is registered with the bot then execute command
            // Else send reply to inform user that command does not exist
            try {
                command.execute(message, args);
            } catch(err) {
                message.channel.send("Zoinks, I cannot understand this command!")
                console.log(`${err.name}: ${err.message}`);
            }
    }



    console.log(`userCommands: ${userCommand}`);
    console.log(`args: ${args}`);
});

bot.login(token);