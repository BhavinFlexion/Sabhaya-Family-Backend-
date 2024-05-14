const routes = require('express').Router();

routes.use('/member', require('./member.routes'));

routes.use('/student', require('./student.routes'));

routes.use('/schedule', require('./schedule.routes'));

routes.use('/gallery', require('./gallery.routes'));

routes.use('/notification', require('./notification.routes'));

routes.use('/advertisement', require('./advertisement.routes'));

routes.use('/sponsors', require('./sponsors.routes'));

routes.use('/sponsorslogo', require('./sponsorslogo.routes'));

routes.use('/expense', require('./expense.routes'));

routes.use('/village', require('./village.routes'));

module.exports = routes;