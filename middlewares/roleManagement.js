exports.verifyOrganisation = (req, res, next) => {
    if(req.path === '/auth/signin' || req.path === '/socket.io/') {
        return next();
    }
    if(!req.organisations.includes(req.params.organisationId)) {
        return res.status(403).send();
    }
    next();
};