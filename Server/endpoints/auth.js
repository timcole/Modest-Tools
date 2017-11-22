var fetch = require('node-fetch'),
	crypto = require('crypto');

var Authentication = function () {

};

Authentication.prototype.me = async function (req, res, next) {
	if (req.authorization) {
		var user = await fetch('https://api.twitch.tv/helix/users', { headers: { Authorization: `Bearer ${req.authorization.access_token}` }}).then(function (j) { return j.json(); })
		res.send(200, { status: 200, message: "Authorized", data: user.data[0] });
	} else {
		res.send(401, { status: 401, message: "Unauthorized" });
	}
};

Authentication.prototype.invalidate = async function (req, res, next) {
	const redis = req.redis;

	if (req.authorization) {;
		try {
			await redis.delAsync(req.authorization.key)
			res.send(200, { status: 200, message: "OKAY" });
		} catch (err) {
			res.send(500, { status: 500, message: "Internal Server Error" });
		}
	} else {
		res.send(401, { status: 401, message: "Unauthorized" });
	}
};

Authentication.prototype.twitch = async function (req, res, next) {
	const code = req.query.code;
	const redis = req.redis;

	if (!code) {
		res.redirect({
			hostname: 'api.twitch.tv',
			pathname: '/kraken/oauth2/authorize',
			port: 443,
			secure: true,
			permanent: false,
			query: {
				client_id: process.env.TWITCH_CLIENT_ID,
				redirect_uri: process.env.TWITCH_CALLBACK,
				response_type: "code",
				scope: "", // TODO: Add actual scopes
				force_verify: true,
				state: 123 // TODO: 123 isn't good enough pleb
			}
		}, next);
	} else {
		try {
			var queryParams = {
				client_id: process.env.TWITCH_CLIENT_ID,
				client_secret: process.env.TWITCH_CLIENT_SECRET,
				code,
				grant_type: "authorization_code",
				redirect_uri: process.env.TWITCH_CALLBACK
			};

			var getToken = await fetch(`https://api.twitch.tv/kraken/oauth2/token?${Object.keys(queryParams).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`).join('&')}`, { method: 'POST' }).then(function(e) { return e.json(); });
			var authorization = crypto.createHmac('sha256', code).update(getToken.access_token).update(new Date().toString()).digest('hex');

			await redis.setAsync(`Modest::Tools::${authorization}`, JSON.stringify(getToken), 'EX', 86400);

			// res.send(200, { status: 200, authorization });
			// TODO: Change
			res.redirect({
				hostname: 'localhost',
				pathname: '/',
				port: 8080,
				secure: false,
				permanent: false,
				query: {
					authorization,
					state: 123 // TODO: 123 isn't good enough pleb
				}
			}, next);
		} catch (err) {
			console.log(err)
			res.send(500, { status: 500, message: "Internal Server Error" });
		}
	}
};

module.exports = new Authentication();