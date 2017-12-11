var webPush = require('web-push');
var bodyParser = require('body-parser');

var applicationServerKey = "AAAAubDixho:APA91bEj-xxm6mRGWdUmlrVtiGMzZeGUp7WmqSaLPyzciHrTAXlRySq75xNZeK_Zt5w2HM1FUof3Hdam2TdhoIXtYt79LoxXGTAc_l6sCcrtt4VAqybJwwdpcCMef2JpceDg5lrIJWfO";
// var applicationServerKey = "BLmFM22_-BBmNGLBkh0Qq8DpWb97cvK9kI9vQnyu0vTWZdiNiN7d4dDpwxH7ttEE3t94_wcsLI4QY_wMQS3O4SA";
webPush.setVapidDetails(
  'mailto:example@natur.group',
  'BLmFM22_-BBmNGLBkh0Qq8DpWb97cvK9kI9vQnyu0vTWZdiNiN7d4dDpwxH7ttEE3t94_wcsLI4QY_wMQS3O4SA',
  'nKKqxo5ePkofbAd_7rrmI4r2zcx0Pv7KNb2Bh3EbzBE'
);

webPush.setGCMAPIKey(applicationServerKey);

// Private Key:
// nKKqxo5ePkofbAd_7rrmI4r2zcx0Pv7KNb2Bh3EbzBE

var cacheSubscription = {};

module.exports = function(app, route) {
	app.use(bodyParser.json()); // to support JSON-encoded bodies
	app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	    extended: true
	}));

    app.post(route + 'register', function(req, res) {
    	console.log('req.body', req.body);

    	cacheSubscription = req.body;
        res.sendStatus(201);
    });

    // app.post(route + 'sendNotification', function(req, res) {
    //     setTimeout(function() {
    //         webPush.sendNotification({
    //                 endpoint: req.query.endpoint,
    //                 TTL: req.query.ttl,
    //             })
    //             .then(function() {
    //                 res.sendStatus(201);
    //             })
    //             .catch(function(error) {
    //                 res.sendStatus(500);
    //                 console.log(error);
    //             });
    //     }, req.query.delay * 1000);
    // });

	app.post(route + 'sendCachedNotification', function(req, res) {
    	console.log('req.body', req.body);

        setTimeout(function() {
            webPush.sendNotification({
                    endpoint: cacheSubscription.endpoint,
                    TTL: 23000,
                    keys: {
                        p256dh: cacheSubscription.key,
                        auth: cacheSubscription.authSecret
                    }
                }, 'fixo!!! payload')
                .then(function() {
                    res.sendStatus(201);
                })
                .catch(function(error) {
                    console.log(error);
                    res.sendStatus(500);
                });
        }, 1000);
    });

    app.post(route + 'sendNotification', function(req, res) {
    	console.log('req.body', req.body);
    	console.log('req;params', req.params);
    	// console.log('req', req.body);

        setTimeout(function() {
            webPush.sendNotification({
                    endpoint: req.body.endpoint,
                    TTL: req.body.ttl,
                    keys: {
                        p256dh: req.body.key,
                        auth: req.body.authSecret
                    }
                }, req.body.payload)
                .then(function() {
                    res.sendStatus(201);
                })
                .catch(function(error) {
                    console.log(error);
                    res.sendStatus(500);
                });
        }, req.body.delay * 1000);
    });

};