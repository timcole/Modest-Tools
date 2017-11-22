"use strict";

const WebSocket = require('ws');
const Events = require('events');

var Chat = function (settings) {
	this.username = settings.username;
	this.auth = settings.auth;
	this.channels = settings.channels;

	Events.EventEmitter.call(this);
};

Chat.prototype.__proto__ = Events.EventEmitter.prototype;

Chat.prototype.connect = function () {
	this.ws = new WebSocket(`wss://irc-ws.chat.twitch.tv`, 'irc');
	
	this.ws.onopen = () => {
		if (this.ws.readyState === 1) {
			console.log(`Connected, now authenticating.`);

			this.ws.send("CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership");
			this.ws.send(`PASS ${this.auth}`);
			this.ws.send(`NICK ${this.username}`);

			for (const i of this.channels) {
				var channel = i.toLowerCase().replace("#", "");
				this.ws.send(`JOIN #${channel}`);
			}
		}
	};

	this.ws.onmessage = (message) => {
		if (!message) return;

		message = message.data

		this.parseChat(message)
	};

	this.ws.onerror = (err) => {
		this.emit("error", err);
	};

	this.ws.onclose = (data) => {
		this.emit("close", data);
	};
};

Chat.prototype.parseChat = function (message) {
	var parsed = {
		original: message,
		command: null,
		tags: {},
		channel: null,
		username: null,
		message: null,
	};

	if (message[0] === '@') {
		var i = message.indexOf(' ');
		var ui = message.indexOf(' ', i + 1);
		var comI = message.indexOf(' ', ui + 1);
		var ci = message.indexOf(' ', comI + 1);
		var msgI = message.indexOf(':', ci + 1);

		var tags = message.slice(0, i);
		tags = tags.split(";");
		for (const ti of tags) {
			var tag = ti.split("=");
			if (tag[1]) parsed.tags[tag[0].replace("@", "")] = tag[1];
		}

		parsed.username = message.slice(i + 2, message.indexOf('!'));
		parsed.command = message.slice(ui + 1, comI);
		parsed.channel = message.slice(comI + 1, ci);
		parsed.message = message.slice(msgI + 1).trim();
		
		if (parsed.tags.badges) parsed.tags.badges = parsed.tags.badges.split(",");
		parsed.tags.mod = (parsed.tags.mod == '1' ? true : false);
		parsed.tags.subscriber = (parsed.tags.subscriber == '1' ? true : false);
		parsed.tags.turbo = (parsed.tags.turbo == '1' ? true : false);
		if (parsed.username === parsed.channel.replace("#", "")) parsed.tags.mod = true;
		
		if (parsed.command === 'PRIVMSG') this.emit("message", parsed);
		if (parsed.command === 'USERNOTICE') {
			if (parsed['msg-id'] === "resub") this.emit("resub", parsed);
			if (parsed['msg-id'] === "sub") this.emit("sub", parsed);
			if (parsed['msg-id'] === "subgift") this.emit("subgift", parsed);
			if (parsed['msg-id'] === "raid") this.emit("raid", parsed);
			if (parsed['msg-id'] === "ritual") this.emit("ritual", parsed);
		}
	}
}

module.exports = Chat;