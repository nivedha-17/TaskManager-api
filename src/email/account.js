const sgMail = require('@sendgrid/mail')
//const sendgridAPIkey = xxx
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomEmail = (email,name) => {
    sgMail.send({
        to: email,
        from: 'nivedhasurendran@gmail.com',
        subject:'Thanks for joning',
        text:`Welcome to app,${name}.Let me know how you get along with the app`
    })
}

const sendCancelEmail = (email,name) => {
    sgMail.send({
        to:email,
        from:'nivedhasurendran@gmail.com',
        subject:'Thanks for using the service',
        text:`May we Know why,${name} cancelled the account`
    })
}
 module.exports = {
    sendWelcomEmail,
    sendCancelEmail
 }