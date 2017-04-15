exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                           'mongodb://Alex:pr0gramming@ds161640.mlab.com:61640/heroku_qwcdj1hk' :
                            'mongodb://Alex:pr0gramming@ds161640.mlab.com:61640/heroku_qwcdj1hk');
exports.PORT = process.env.PORT || 8080;