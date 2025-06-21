const {Notification} = require('../models');

exports.getNotifications = async (req, res) => {
    try{
        const notifications = await Notification.findAll({
            where: {userId: req.user.id},
            order: [['createdAt', 'DESC']]
        });
        const now = new Date();
        const enhancedNotifications = notifications.map(n=> {
            const isRead = n.readAt && (now - new Date(n.readAt)) < 24 * 60 * 60 * 1000;
            return {
                ...n.toJSON(),
                isRead,
            }
        });

        res.json(enhancedNotifications);
    } catch(error){
        console.error("Error fetching notifications: ", error);
        res.status(500).json({message: 'Internal server error'});
    }
};

exports.markAsRead = async (req, res) => {
    const {id} = req.params;

    try {
        const notification = await Notification.findOne({
            where: {id, userId: req.user.id}
        });

        if(!notification){
            return res.status(404).json({message: 'Notification not found'});
        }

        notification.readAt = new Date();
        await notification.save();

        res.json({message: "Notification marked as read"});
    } catch(error) {
        console.error('Error marking notification as read: ', error);
        res.status(500).json({message: 'Internal server error'});
    }
};

exports.deleteNotification = async(req, res) => {
    const {id} = req.params;

    try {
        const deleted = await Notification.destroy({
            where: {id, userId: req.user.id}
        });
        if(!deleted) {
            return res.status(404).json({message: "Notification not found"})
        }
        res.json({message: 'Notification deleted successfully'});
    } catch(error){
        console.error("Error deleting notification: ", error);
        res.status(500).json({message: 'Internal server error'});
    }
};
