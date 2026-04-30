// Display one task as a card and shows title description priority due date and status
import React from "react";
import type { TaskItemProps, TaskStatus } from "../../types/index.ts";

// React.FC means React function component; also destructure the props
const TaskItem: React.FC<TaskItemProps> = ({
    task,
    onStatusChange,
    onDelete,
    onEdit,
}) => {
    // IF/ELSE picks background class based on task.status
    let cardBgClass: string;

    if (task.status === "completed") {
        cardBgClass = "bg-[#0d2010]"; // task is done
    } else if (task.status === "in-progress") {
        cardBgClass = "bg-[#0d1a2a]"; // task is being worked on
    } else {
        cardBgClass = "bg-[#141414]"; // task has not started
    }

    // IF/ELSE picks priority badge classes based on task.priority
    let priorityBadgeClass: string;

    if (task.priority === "high") {
        priorityBadgeClass = "bg-[#1a0a00] text-[#FF8000] border border-[#FF8000]"; // orange-on-dark for high urgency
    } else if (task.priority === "medium") {
        priorityBadgeClass = "bg-[#1e1e1e] text-[#888888] border border-[#2a2a2a]"; // muted for medium
    } else {
        priorityBadgeClass = "bg-[#1e1e1e] text-[#555555] border border-[#2a2a2a]"; // most muted for low
    }

    // EVENT HANDLER STATUS DROPDOWN
    // This function runs when user picks a new status from the drop-down menu
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onStatusChange(task.id, e.target.value as TaskStatus);
    };

    // EVENT HANDLER DELETE BUTTON
    // Shows a confirmation popup before removing the task
    const handleDelete = () => {
        const confirmed = window.confirm("Hold Up Are You Sure You Want To Delete This Task?");

        // IF/ELSE only delete if user picked OK
        if (confirmed) {
            onDelete(task.id);
        }
    };

    const handleEdit = () => {
        onEdit(task);
    };

    return (
        <div className={`${cardBgClass} border border-[#2a2a2a] rounded-xl p-6 mb-3`}>

            {/* TOP ROW: priority badge + status dropdown */}
            <div className="flex justify-between items-center mb-3">
                <span className={`${priorityBadgeClass} text-[11px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full`}>
                    {task.priority.toUpperCase()}
                </span>

                <select
                    value={task.status}
                    onChange={handleStatusChange}
                    className="bg-[#1e1e1e] border border-[#2a2a2a] text-white rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer outline-none"
                >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {/* TITLE */}
            <h3 className="m-0 mb-2 text-[17px] font-bold text-white tracking-tight">{task.title}</h3>

            {/* DESCRIPTION */}
            {task.description && (
                <p className="m-0 mb-2.5 text-sm text-[#555555] leading-relaxed">{task.description}</p>
            )}

            {/* DUE DATE */}
            {task.dueDate && (
                <p className="m-0 mb-4 text-xs font-medium text-[#888888]">Due: {task.dueDate}</p>
            )}

            {/* BOTTOM ROW: edit + delete */}
            <div className="flex gap-2.5 mt-4">
                <button
                    className="bg-[#FF8000] text-black border-none rounded-lg px-5 py-2 text-[13px] font-bold cursor-pointer uppercase tracking-wide"
                    onClick={handleEdit}
                >
                    Edit
                </button>
                <button
                    className="bg-[#1e1e1e] text-red-500 border border-red-500 rounded-lg px-5 py-2 text-[13px] font-bold cursor-pointer uppercase tracking-wide"
                    onClick={handleDelete}
                >
                    Delete
                </button>
            </div>

        </div>
    );
};

export default TaskItem;
