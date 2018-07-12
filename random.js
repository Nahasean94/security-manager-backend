// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
const accountSid = 'AC7eea5ad0c0793fd647c6d7a596740fbc';
const authToken = '055e40e06dda72b7d70b343f0fb0d133\n';
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        body: 'Oya man man',
        from: '+14159095176',
        to: '+25476490708'
    })
    .then(message => console.log(message.sid))
    .done()
