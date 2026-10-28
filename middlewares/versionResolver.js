const versionResolver = (req, res, next) => {req.apiVersion = req.headers['api-version'] || 'v1';
    next();
};

module.exports = versionResolver;