const cron = require('node-cron');
const moment = require('moment');
const {Task, Notification} = require('./models');
const {Op} = require('sequelize');

const checkDueDateNotifications = async () => {

    const today = moment().startOf('day');
    try {
        const tasks = await Task.findAll({
            where: {
                dueDate: {
                [Op.lte]: moment(today).add(2, 'days').toDate()
            }
        }
    });
        for(const task of tasks) {
            const daysLeft = moment(task.dueDate).startOf('day').diff(today, 'days');
            let message = ``;
            if(daysLeft === 2) message = `⏳ Only 2 days left for task "${task.title}".`;
            else if(daysLeft === 1) message = `⚠️ Task "${task.title}" is due tomorrow`;
            else if(daysLeft === 0) message = `📌 Task "${task.title}" is due today.`;
            else if(daysLeft < 0) message = `❗Task "${task.title}" is overdue`;
            
            if (message) {
                const existing = await Notification.findOne({
                    where: {
                        userId: task.userId,
                        taskId: task.id
                    }
                });
                if(!existing){
                    
                    const newNotification = await Notification.create({
                        userId: task.userId,
                        taskId: task.id,
                        boardId: task.boardId || null,
                        message
                    });
                    if(global.io) {
                        global.io.to(`user-${task.userId}`).emit('notification:new', newNotification);
                    }
                }
                else if(existing.message !== message){
                    existing.message = message;
                    await existing.save();
                    console.log("updated message: ", message);
                    if(global.io) {
                        global.io.to(`user-${task.userId}`).emit('notification:update', existing.toJSON());
                    }
                }

                }
            }
        
        console.log(`found ${tasks.length} tasks`);
        console.log('✅ Due date notification check completed.');
    } catch(error) {
        console.error('❌ Error in due date notifier: ', error);
    }
}

module.exports = {checkDueDateNotifications}