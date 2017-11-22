require('dotenv').config();

var restify = require('restify'),
	Redis = require('redis'),
	bluebird = require('bluebird'),
	Cors = require('restify-cors-middleware')
	port = process.env.PORT || 9001;

// <Endpoint Modules>
var auth = require('./modules/auth');
// </Endpoint Modules>

bluebird.promisifyAll(Redis.RedisClient.prototype);
bluebird.promisifyAll(Redis.Multi.prototype);
var redis = Redis.createClient();

var server = restify.createServer({
	name: "Modest"
});

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
const cors = Cors({
	origins: [ '*' ],
	allowHeaders: ['Authorization']
});
server.pre(cors.preflight)
server.use(cors.actual)

server.use(function (req, res, next) {
	console.log(`${req.method} ${req.url}`);
	return next();
});

// Authorization
server.use(async function (req, res, next) {
	const authorization = req.headers.authorization;
	const key = `Modest::Tools::${authorization}`;

	try {
		req.authorization = (typeof authorization != 'undefined' ? JSON.parse(await redis.getAsync(key)) : null);
	} catch (err) {
		req.authorization = null;
	}

	if (req.authorization !== null) req.authorization.key = key;
	if (req.authorization === null) delete req.authorization;
	req.redis = redis;
	return next();
});

server.get('/test', function (req, res, next) {
	res.send(200, { status: 200, message: "Go away" });
});

server.get('/me', auth.me);
server.get('/auth/twitch', auth.twitch);
server.del('/auth/token', auth.invalidate);

server.get(/\/?.*/, function (req, res, next) {
	res.send(404, { status: 404, message: "Endpoint Not Found" });
});

server.listen(port, () => {
	console.log(`API is running on port ${port}`);
});