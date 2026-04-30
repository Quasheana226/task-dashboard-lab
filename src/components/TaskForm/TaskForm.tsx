// ============================================================
// TaskForm.tsx — Add / Edit task modal form
//
// This is a "controlled form" — React controls every input.
// Every keystroke updates state, and state drives the input value.
//
// It handles two cases:
//   1. Adding a new task  (taskToEdit is null)
//   2. Editing an existing task (taskToEdit has the task data)
//
// Validation runs when the user clicks Submit.
// Errors are shown below the field that failed.
// ============================================================

import React, { useState, useEffect } from 'react';
import type { Task, TaskFormProps, TaskStatus } from '../../types';

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, taskToEdit, onCancel }) => {

    // ============================================================
    // STATE — one piece of state for each form field
    // ============================================================

    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [status, setStatus] = useState<TaskStatus>('pending');
    const [dueDate, setDueDate] = useState<string>('');

    // ERROR STATE — holds validation messages; '' means no error for that field
    const [titleError, setTitleError] = useState<string>('');
    const [descriptionError, setDescriptionError] = useState<string>('');
    const [dueDateError, setDueDateError] = useState<string>('');

    // isSubmitting — gives visual feedback while the form processes
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


    // ============================================================
    // useEffect — PRE-FILL THE FORM WHEN EDITING
    //
    // If taskToEdit is a Task object → pre-fill all fields with its data.
    // If taskToEdit is null → reset to blank (we are adding a new task).
    // ============================================================
    useEffect(() => {
        if (taskToEdit !== null) {
            // EDITING — fill in the existing task's values
            setTitle(taskToEdit.title);
            setDescription(taskToEdit.description);
            setPriority(taskToEdit.priority);
            setStatus(taskToEdit.status);
            setDueDate(taskToEdit.dueDate);
            console.log('[TaskForm] Pre-filled form for editing task:', taskToEdit.id);
        } else {
            // ADDING — reset everything to blank/default
            setTitle('');
            setDescription('');
            setPriority('medium');
            setStatus('pending');
            setDueDate('');
            console.log('[TaskForm] Blank form ready for new task.');
        }

        // Always clear errors when the modal opens
        setTitleError('');
        setDescriptionError('');
        setDueDateError('');
        setIsSubmitting(false);
    }, [taskToEdit]);


    // ============================================================
    // VALIDATE FORM
    // Returns true if valid, false if there are errors.
    // ============================================================
    function validateForm(): boolean {
        let isValid = true;

        // TITLE VALIDATION
        if (!title.trim()) {
            setTitleError('Title is required');
            isValid = false;
        } else if (title.trim().length < 3) {
            setTitleError('Title must be at least 3 characters');
            isValid = false;
        } else if (title.trim().length > 100) {
            setTitleError('Title must be 100 characters or less');
            isValid = false;
        } else {
            setTitleError('');
        }

        // DESCRIPTION VALIDATION (optional field — only check length)
        if (description.length > 500) {
            setDescriptionError('Description must be 500 characters or less');
            isValid = false;
        } else {
            setDescriptionError('');
        }

        // DUE DATE VALIDATION (optional field — only check if something was entered)
        if (dueDate) {
            const parsedDate = new Date(dueDate);
            if (isNaN(parsedDate.getTime())) {
                setDueDateError('Please enter a valid date');
                isValid = false;
            } else {
                setDueDateError('');
            }
        } else {
            setDueDateError('');
        }

        return isValid;
    }


    // ============================================================
    // HANDLE SUBMIT
    // ============================================================
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        console.log('[TaskForm] Submit clicked. Editing?', taskToEdit !== null);

        const valid = validateForm();
        if (!valid) {
            console.log('[TaskForm] Validation failed — not submitting.');
            return;
        }

        setIsSubmitting(true);

        await new Promise((resolve) => setTimeout(resolve, 300));

        // IF/ELSE — are we editing or adding?
        if (taskToEdit !== null) {
            // EDITING — keep the same ID, just update the fields
            const updatedTask: Task = {
                id: taskToEdit.id,
                title: title.trim(),
                description: description.trim(),
                priority,
                status,
                dueDate,
            };
            console.log('[TaskForm] Submitting edited task:', updatedTask.id);
            onAddTask(updatedTask);

        } else {
            // ADDING — generate a new unique ID
            const newTask: Task = {
                id: `task-${Date.now()}`,
                title: title.trim(),
                description: description.trim(),
                priority,
                status,
                dueDate,
            };
            console.log('[TaskForm] Submitting new task:', newTask.id);
            onAddTask(newTask);
        }
    }


    // ============================================================
    // RENDER
    // ============================================================

    // Shared class strings reused across multiple inputs
    const inputBase = "w-full rounded-lg px-3.5 py-2.5 text-sm text-white outline-none box-border bg-[#1e1e1e] border";
    const selectBase = "w-full rounded-lg px-3.5 py-2.5 text-sm text-white outline-none bg-[#1e1e1e] border border-[#2a2a2a] cursor-pointer";

    return (
        <div className="bg-[#141414] rounded-[14px] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.8)] border border-[#2a2a2a]">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-extrabold text-white m-0 uppercase tracking-tight">
                    {/* Show different title depending on add vs edit */}
                    {taskToEdit !== null ? '✏️ Edit Task' : '➕ Add New Task'}
                </h2>
                {/* X button to close the modal without saving */}
                <button
                    className="bg-transparent border-none text-lg text-[#555555] cursor-pointer px-2 py-1 rounded-lg leading-none"
                    onClick={onCancel}
                    aria-label="Close form"
                >
                    ✕
                </button>
            </div>

            {/* FORM — noValidate disables browser built-in validation so ours takes over */}
            <form onSubmit={handleSubmit} noValidate>

                {/* TITLE FIELD */}
                <div className="mb-[18px] flex-1">
                    <label className="block text-[11px] font-bold text-[#888888] mb-1.5 uppercase tracking-[0.8px]">
                        Title <span className="text-[#FF8000]">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="What needs to be done?"
                        maxLength={100}
                        disabled={isSubmitting}
                        className={`${inputBase} ${titleError ? 'border-red-500' : 'border-[#2a2a2a]'}`}
                    />
                    {/* Only show error message if there is one */}
                    {titleError && <p className="text-xs text-[#FF8000] mt-1 m-0">{titleError}</p>}
                    {/* Character count */}
                    <p className="text-[11px] text-[#333333] text-right mt-1 m-0">{title.length}/100</p>
                </div>

                {/* DESCRIPTION FIELD */}
                <div className="mb-[18px] flex-1">
                    <label className="block text-[11px] font-bold text-[#888888] mb-1.5 uppercase tracking-[0.8px]">
                        Description <span className="text-[#444444] font-normal normal-case">(optional)</span>
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add more details..."
                        rows={3}
                        maxLength={500}
                        disabled={isSubmitting}
                        className={`${inputBase} resize-none ${descriptionError ? 'border-red-500' : 'border-[#2a2a2a]'}`}
                    />
                    {descriptionError && <p className="text-xs text-[#FF8000] mt-1 m-0">{descriptionError}</p>}
                    <p className="text-[11px] text-[#333333] text-right mt-1 m-0">{description.length}/500</p>
                </div>

                {/* PRIORITY + STATUS — side by side using flex */}
                <div className="flex gap-4">

                    {/* PRIORITY DROPDOWN */}
                    <div className="mb-[18px] flex-1">
                        <label className="block text-[11px] font-bold text-[#888888] mb-1.5 uppercase tracking-[0.8px]">
                            Priority
                        </label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                            disabled={isSubmitting}
                            className={selectBase}
                        >
                            <option value="low">🟢 Low</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="high">🔴 High</option>
                        </select>
                    </div>

                    {/* STATUS DROPDOWN */}
                    <div className="mb-[18px] flex-1">
                        <label className="block text-[11px] font-bold text-[#888888] mb-1.5 uppercase tracking-[0.8px]">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as TaskStatus)}
                            disabled={isSubmitting}
                            className={selectBase}
                        >
                            <option value="pending">📋 Pending</option>
                            <option value="in-progress">⚙️ In Progress</option>
                            <option value="completed">✅ Completed</option>
                        </select>
                    </div>
                </div>

                {/* DUE DATE FIELD */}
                <div className="mb-[18px] flex-1">
                    <label className="block text-[11px] font-bold text-[#888888] mb-1.5 uppercase tracking-[0.8px]">
                        Due Date <span className="text-[#444444] font-normal normal-case">(optional)</span>
                    </label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        disabled={isSubmitting}
                        className={`${inputBase} ${dueDateError ? 'border-red-500' : 'border-[#2a2a2a]'}`}
                    />
                    {dueDateError && <p className="text-xs text-[#FF8000] mt-1 m-0">{dueDateError}</p>}
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex justify-end gap-3 mt-2 pt-5 border-t border-[#2a2a2a]">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="bg-[#1e1e1e] text-[#888888] border border-[#2a2a2a] rounded-lg px-5 py-2.5 text-[13px] font-semibold cursor-pointer uppercase tracking-[0.5px]"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#FF8000] text-black border-none rounded-lg px-6 py-2.5 text-[13px] font-extrabold cursor-pointer uppercase tracking-[0.5px]"
                    >
                        {/* Show "Saving..." while submitting, normal label otherwise */}
                        {isSubmitting
                            ? 'Saving...'
                            : taskToEdit !== null ? 'Save Changes' : 'Add Task'
                        }
                    </button>
                </div>

            </form>
        </div>
    );
};

export default TaskForm;
