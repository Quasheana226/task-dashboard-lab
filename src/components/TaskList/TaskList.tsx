// Import React and the types and TaskItem component this file depends on
import React from 'react';
import type { Task, TaskStatus } from '../../types';
import TaskItem from './TaskItem';

// Define the shape of props this component expects
interface TaskListProps {
    tasks: Task[];
    onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
    onDelete: (taskId: string) => void;
    onEdit: (task: Task) => void;
}

// The TaskList component renders either an empty state or a list of TaskItem components
const TaskList: React.FC<TaskListProps> = ({ tasks, onStatusChange, onDelete, onEdit }) => {

    // IF/ELSE — show empty state when there are no tasks, otherwise render the list
    if (tasks.length === 0) {
        // Return a centered empty state message when the task array is empty
        return (
            <div className="text-center py-[60px] px-5">
                <p className="text-lg font-extrabold text-white m-0 mb-2 uppercase tracking-tight">🚫 No tasks yet</p>
                <p className="text-[13px] text-[#555555] m-0 uppercase tracking-[0.5px]"> ➕ Add a task to get started</p>
            </div>
        );
    } else {
        // Return a vertical list of TaskItem components, one per task
        return (
            <div className="flex flex-col">
                {tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onStatusChange={onStatusChange}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />
                ))}
            </div>
        );
    }
};

export default TaskList;
