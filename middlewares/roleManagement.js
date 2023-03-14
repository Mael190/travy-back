exports.verifyOrganisation = (req, res, next) => {
    if(req.path === '/api/auth/signin') {
        return next();
    }
    if(!req.organisations.includes(req.params.organisationId)) {
        return res.status(403).send();
    }
    next();
};