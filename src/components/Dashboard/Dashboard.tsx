//DASHBOARD COMPONENT
//The brain of the whole app
// it holds all task data in one place and passes it down to every other component


import React, { useState, useEffect } from 'react';
import type { Task, TaskStatus } from '../../types';
import TaskFilter from '../TaskFilter/TaskFilter';
import TaskList from '../TaskList/TaskList';
import TaskForm from '../TaskForm/TaskForm';



const Dashboard: React.FC = () => {
    // STATE-TASK
    // List of all tasks — every component gets its data from here
    const [tasks, setTasks] = useState<Task[]>([]);

    // STATE-TASK-TO-EDIT
    // Holds the task being edited, or null when adding a new task
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

    // STATE-FILTERS
    // Tracks what the user selected in the search bar; empty object means no filters are active
    const [filters, setFilters] = useState<{
        status?: TaskStatus;
        priority?: 'low' | 'medium' | 'high';
        search?: string;
    }>({});


    // STATE-SHOW-FORM
    // Controls whether the add/edit form is showing or hidden
    const [showForm, setShowForm] = useState<boolean>(false);

    // LOAD TASKS FROM LOCAL STORAGE
    // Checks if user tasks are saved and loads them into state
    useEffect(() => {
        const saved = localStorage.getItem('dashboard-tasks');

        if (saved !== null) {
            // parse it from a string back into an array
            const parsed = JSON.parse(saved) as Task[];
            setTasks(parsed);
            // console.log('Loaded tasks from localStorage:', parsed.length);
        } else {
            // No data saved — first time opening app
            // console.log('Sorry No saved task found, Start Fresh');
        }
    }, []); // run once only


    // SAVE TASKS TO LOCAL STORAGE
    // Converts the array to a string and saves it — survives a page refresh
    useEffect(() => {
        localStorage.setItem('dashboard-tasks', JSON.stringify(tasks));
        // console.log('Tasks saved:', tasks.length);
    }, [tasks]);

    // HANDLER: ADD OR EDIT A TASK
    // Called by the form when the user clicks submit
    const handleAddTask = (taskData: Task) => {

        if (taskToEdit !== null) {
            // Find the old version and swap it with the updated one
            const updatedTasks = tasks.map((task) => {
                if (task.id === taskData.id) {
                    return taskData; // Replace with the updated task
                } else {
                    return task; // Keep everything the same
                }
            });

            setTasks(updatedTasks);
            // console.log('Task edited:', taskData.id);
        } else {
            // Put new task at the front of the list
            setTasks([taskData, ...tasks]);
            // console.log('Task added:', taskData.id);
        }
        // Close the form and clear editing state
        setShowForm(false);
        setTaskToEdit(null);
    };


    // HANDLER: OPEN EDIT FORM
    // Called when the user clicks the edit button on a task
    const handleEditTask = (task: Task) => {
        setTaskToEdit(task);
        setShowForm(true);
    };

    // HANDLER: FILTER CHANGED
    // Called by TaskFilter whenever the user changes a dropdown or types in the search bar
    const handleFilterChange = (newFilters: {
        status?: TaskStatus;
        priority?: 'low' | 'medium' | 'high';
        search?: string;
    }) => {
        setFilters(newFilters);
        // console.log('Filters updated:', newFilters);
    };

    // FILTERING LOGIC
    // Runs through every task and keeps ones that match active filters
    const filteredTasks = tasks.filter((task) => {

        // Check status filter
        if (filters.status && task.status !== filters.status) {
            return false;
        }

        // Check priority filter
        if (filters.priority && task.priority !== filters.priority) {
            return false;
        }

        // Check search
        if (filters.search && filters.search.trim() !== '') {
            const query = filters.search.toLowerCase();
            const titleMatch = task.title.toLowerCase().includes(query);
            const descMatch = task.description?.toLowerCase().includes(query) ?? false;

            if (!titleMatch && !descMatch) {
                return false;
            }
        }

        return true;
    });

    // STATS directly from the tasks array
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === 'completed').length;
    const pendingTasks = tasks.filter((task) => task.status === 'pending').length;
    const inProgressTasks = tasks.filter((task) => task.status === 'in-progress').length;



    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

                .td-root * { box-sizing: border-box; }

                .td-btn-add {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .td-btn-add:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 32px rgba(249, 115, 22, 0.6);
                }
                .td-btn-add:active {
                    transform: scale(0.97);
                }

                .td-stat-card {
                    transition: transform 0.25s ease, box-shadow 0.25s ease;
                }
                .td-stat-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 20px 48px rgba(0, 0, 0, 0.55);
                }

                .td-close-btn {
                    transition: color 0.15s ease, background 0.15s ease;
                }
                .td-close-btn:hover {
                    color: #ffffff;
                    background: rgba(255, 255, 255, 0.12);
                }

                .td-stats-row::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            <div
                className="td-root"
                style={{
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    background: '#0a0a0a',
                    minHeight: '100vh',
                    paddingBottom: '80px',
                }}
            >
                {/* MAX-WIDTH CONTAINER */}
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 28px' }}>

                    {/* ─── HEADER ──────────────────────────────────────────── */}
                    <header style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        padding: '64px 0 48px',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        gap: '24px',
                        flexWrap: 'wrap',
                    }}>
                        <div>
                            <p style={{
                                margin: '0 0 10px',
                                fontSize: '11px',
                                fontWeight: 700,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: '#f97316',
                            }}>
                                Workflow Manager
                            </p>
                            <h1 style={{
                                margin: 0,
                                fontSize: 'clamp(40px, 6vw, 76px)',
                                fontWeight: 900,
                                lineHeight: 1,
                                letterSpacing: '-0.03em',
                                color: '#ffffff',
                            }}>
                                Task Dashboard
                            </h1>
                            <p style={{
                                margin: '14px 0 0',
                                fontSize: '15px',
                                fontWeight: 400,
                                color: 'rgba(255,255,255,0.38)',
                                letterSpacing: '0.01em',
                            }}>
                                {filteredTasks.length} of {totalTasks} task{totalTasks !== 1 ? 's' : ''} shown
                            </p>
                        </div>

                        <button
                            className="td-btn-add"
                            onClick={() => { setTaskToEdit(null); setShowForm(true); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '9px',
                                padding: '15px 30px',
                                background: '#f97316',
                                color: '#ffffff',
                                fontSize: '13px',
                                fontWeight: 800,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                            }}
                        >
                            <span style={{ fontSize: '20px', lineHeight: 1, marginTop: '-1px' }}>+</span>
                            Add Task
                        </button>
                    </header>

                    {/* ─── STATS ROW ───────────────────────────────────────── */}
                    <div
                        className="td-stats-row"
                        style={{
                            display: 'flex',
                            gap: '16px',
                            margin: '44px 0',
                            overflowX: 'auto',
                            paddingBottom: '8px',
                            scrollbarWidth: 'none',
                        }}
                    >
                        {([
                            { label: 'Total Tasks',  value: totalTasks,      accent: '#3b82f6', glow: 'rgba(59,130,246,0.45)'  },
                            { label: 'Completed',    value: completedTasks,  accent: '#22c55e', glow: 'rgba(34,197,94,0.45)'   },
                            { label: 'In Progress',  value: inProgressTasks, accent: '#f97316', glow: 'rgba(249,115,22,0.45)'  },
                            { label: 'Pending',      value: pendingTasks,    accent: '#a855f7', glow: 'rgba(168,85,247,0.45)'  },
                        ] as const).map(({ label, value, accent, glow }) => (
                            <div
                                key={label}
                                className="td-stat-card"
                                style={{
                                    flex: '0 0 210px',
                                    padding: '28px 24px 24px',
                                    background: 'rgba(255,255,255,0.04)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    borderTop: `3px solid ${accent}`,
                                    borderRadius: '16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                }}
                            >
                                <span style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    letterSpacing: '0.16em',
                                    textTransform: 'uppercase',
                                    color: 'rgba(255,255,255,0.4)',
                                }}>
                                    {label}
                                </span>
                                <span style={{
                                    fontSize: '52px',
                                    fontWeight: 900,
                                    lineHeight: 1,
                                    color: '#ffffff',
                                    letterSpacing: '-0.03em',
                                    textShadow: `0 0 40px ${glow}`,
                                }}>
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* ─── FILTERS ─────────────────────────────────────────── */}
                    <div style={{
                        padding: '20px 24px',
                        background: 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '16px',
                        marginBottom: '32px',
                    }}>
                        <TaskFilter filters={filters} onFilterChange={handleFilterChange} />
                    </div>

                    {/* ─── ADD / EDIT FORM ─────────────────────────────────── */}
                    {showForm && (
                        <div style={{
                            position: 'relative',
                            padding: '32px',
                            background: 'rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(24px)',
                            WebkitBackdropFilter: 'blur(24px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderTop: '3px solid #f97316',
                            borderRadius: '20px',
                            marginBottom: '36px',
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '28px',
                            }}>
                                <div>
                                    <p style={{
                                        margin: '0 0 4px',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        letterSpacing: '0.18em',
                                        textTransform: 'uppercase',
                                        color: '#f97316',
                                    }}>
                                        {taskToEdit ? 'Editing' : 'New'}
                                    </p>
                                    <h2 style={{
                                        margin: 0,
                                        fontSize: '22px',
                                        fontWeight: 800,
                                        color: '#ffffff',
                                        letterSpacing: '-0.02em',
                                    }}>
                                        {taskToEdit ? 'Update Task' : 'Create Task'}
                                    </h2>
                                </div>
                                <button
                                    className="td-close-btn"
                                    onClick={() => { setShowForm(false); setTaskToEdit(null); }}
                                    aria-label="Close form"
                                    style={{
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '10px',
                                        color: 'rgba(255,255,255,0.45)',
                                        cursor: 'pointer',
                                        fontSize: '20px',
                                        lineHeight: 1,
                                        padding: '7px 11px',
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                            <TaskForm
                                onSubmit={handleAddTask}
                                taskToEdit={taskToEdit}
                                onClose={() => { setShowForm(false); setTaskToEdit(null); }}
                            />
                        </div>
                    )}

                    {/* ─── TASK LIST ───────────────────────────────────────── */}
                    <section>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '20px',
                        }}>
                            <h2 style={{
                                margin: 0,
                                fontSize: '11px',
                                fontWeight: 700,
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                color: 'rgba(255,255,255,0.35)',
                            }}>
                                Your Tasks
                            </h2>
                            {filteredTasks.length > 0 && (
                                <span style={{
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    color: 'rgba(255,255,255,0.28)',
                                    letterSpacing: '0.05em',
                                }}>
                                    {filteredTasks.length} result{filteredTasks.length !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                        <TaskList tasks={filteredTasks} onEdit={handleEditTask} />
                    </section>

                </div>
            </div>
        </>
    );
};

export default Dashboard;
