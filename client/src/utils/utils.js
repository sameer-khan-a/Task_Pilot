export const groupTasksByStatus = (tasks) => {
    return {
        todo: tasks.filter(task => task.status === 'todo'),
        inprogress: tasks.filter(task => task.status === 'inprogress'),
        done: tasks.filter(task => task.status === 'done'),
        onhold: tasks.filter(task => task.status === 'onhold'),
        pinned: tasks.filter(task => task.status === 'pinned'),
    };
};