const { ReactionRole } = require("reaction-role");
const { bargs } = require("bargs");
const { config } = require("dotenv");

config();

const client = new ReactionRole(process.env.BOT_TOKEN, process.env.MONGODB_URI);
const prefix = "!";

client.on("message", async (message) => {
	if (
		message.author.bot ||
		!message.guild ||
		!message.content.startsWith(prefix)
	)
		return;

	const [command, ...split] = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);

	if (command === "rr") {
		const args = bargs(
			[
				{
					name: "emoji",
					type: String,
					aliases: ["e"],
				},
				{
					name: "role",
					type: String,
					aliases: ["r"],
				},
				{
					name: "channel",
					type: String,
					aliases: ["c"],
				},
				{
					name: "msg",
					type: String,
					aliases: ["m"],
				},
				{
					name: "add",
					type: String,
					aliases: ["a"],
				},
				{
					name: "remove",
					type: String,
					aliases: ["rm"],
				},
			],
			split,
		);
		const { emoji, role, channel, msg, add, remove } = args;
		if (!emoji || !role || !channel || !msg)
			return message.reply(
				"!rr -e <emoji> -r <role_id> -c <channel_id> -m <message_id> -a <add_message> -rm <remove_message>",
			);
		const c = await client.channels.fetch(channel);
		const m = await c.messages.fetch(msg);
		await m.react(emoji);
		const option = client.createOption(emoji, [role], add, remove);
		await client.createMessage(channel, msg, 1, option);
		message.reply("created!");
	}
});

client.init();
