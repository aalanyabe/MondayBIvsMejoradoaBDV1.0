const { Command } = require('commander');

const commander = new Command()
commander
    .option('--mode <mode>', 'execution mode')
    .parse()

module.exports = { commander }