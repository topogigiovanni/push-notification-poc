var endpoint;
var key;
var authSecret;

// const applicationServerKey = "BCmti7ScwxxVAlB7WAyxoOXtV7J8vVCXwEDIFXjKvD-ma-yJx_eHJLdADyyzzTKRGb395bSAtxlh4wuDycO3Ih4";
const applicationServerKey = "BLmFM22_-BBmNGLBkh0Qq8DpWb97cvK9kI9vQnyu0vTWZdiNiN7d4dDpwxH7ttEE3t94_wcsLI4QY_wMQS3O4SA";

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
        return registration.pushManager.getSubscription()
            .then(function(subscription) {
                if (subscription) {
                    return subscription;
                }
                return registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(applicationServerKey),

                });
            });
    }).then(function(subscription) {
        console.log('subscription', subscription);

        var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
        key = rawKey ?
            btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) :
            '';
        var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
        authSecret = rawAuthSecret ?
            btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) :
            '';

        endpoint = subscription.endpoint;
        fetch('./register', {
            method: 'post',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                endpoint: subscription.endpoint,
                key: key,
                authSecret: authSecret,
            }),
        });
    });

document.getElementById('doIt').onclick = function() {
    console.log('endpoint', endpoint);
    var payload = document.getElementById('notification-payload').value;
    var delay = 1;//document.getElementById('notification-delay').value;
    var ttl = 10000;//document.getElementById('notification-ttl').value;
    fetch('./sendNotification', {
        method: 'post',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            endpoint: endpoint,
            key: key,
            authSecret: authSecret,
            payload: payload,
            delay: delay,
            ttl: ttl,
        }),
    });
};