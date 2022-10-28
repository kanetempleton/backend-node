const name = new Promise(function(resolve, reject) {
        clockwork.sendSms({ To: number.toString(), Content: message }, (err, res) => {
            // Running the Promise resolve or reject.
            err ? reject(err) : resolve(res)

            // Logging the text message response.
            err ? micro.error(err) : micro.log(JSON.stringify(res))
        })
})



const Util = function() {
    this.testvalue = 'cheese'
}
Util.prototype.testfunction = function() {
    console.log(this.testvalue)
}

// [EXPORTS]
module.exports = new Util()