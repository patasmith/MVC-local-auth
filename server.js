const app = require('./app')
const { NODE_ENV, PORT } = require('./utils/config')
const log = require('./utils/log')
const morgan = require('morgan')

if (NODE_ENV === 'development') app.use(morgan('dev'))

app.listen(PORT, log.info(`Server running in ${NODE_ENV} mode on port ${PORT}`))
