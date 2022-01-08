const sgMail = require("@sendgrid/mail")


sgMail.setApiKey(process.env.API_KEY_SENDGRID)


const sendWelcomeEmail = (email,name) => {
    sgMail.send({
        to: email,
        from: "007harryjutt@gmail.com",
        subject: "Thanks for joining in!",
        text: `Welcome to the app, name ${name}. Let me know how you get along with the app.`
    })
}   


const sendLeaveEmail= (email,name) => {

    sgMail.send({
        to: email,
        from: "007harryjutt@gmail.com",
        subject: "Why are you leave app ?",
        text: `Can you explain why are you leave our app because we want your feedback and correct it for future ...`

    })

}

module.exports = {
    sendWelcomeEmail,
    sendLeaveEmail,
}