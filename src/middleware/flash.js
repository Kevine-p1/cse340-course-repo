const flash = (req, res, next) => {
    req.flash = (type, message) => {
        if (!req.session.flash) {
            req.session.flash = {
                success: [],
                error: [],
                warning: [],
                info: []
            };
        }

        // Store a new message
        if (type && message !== undefined) {
            if (!req.session.flash[type]) {
                req.session.flash[type] = [];
            }

            req.session.flash[type].push(message);
            return;
        }

        // Retrieve and clear one message type
        if (type) {
            const messages = req.session.flash[type] || [];
            req.session.flash[type] = [];
            return messages;
        }

        // Retrieve and clear all messages
        const messages = req.session.flash;

        req.session.flash = {
            success: [],
            error: [],
            warning: [],
            info: []
        };

        return messages;
    };

    // Make flash messages accessible to EJS templates
    res.locals.flash = req.flash;

    next();
};

export default flash;