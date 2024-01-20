module.exports = async function smsSender() {
    await axios.post(`https://secure.h3techs.com/sms/api/send?email=abdurrehman825@gmail.com&key=02760a2ab2a613810cc4e3150d576f2620&mask=AR Services&to=923400576761&message=This is a Test Message`)
}