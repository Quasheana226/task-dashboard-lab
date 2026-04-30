// Shows search input and two dropdowns (status and priority); calls onFilterChange on every change

import React, { useState } from "react";
import type { TaskFilterProps, TaskStatus } from "../../types";

const TaskFilter: React.FC<TaskFilterProps> = ({ onFilterChange }) => {
    // LOCAL STATE
    // When you call setValue, React re-renders the component

    const [selectedStatus, setSelectedStatus] = useState<string>(""); // '' means no filter
    const [selectedPriority, setSelectedPriority] = useState<string>(""); // '' means show all
    const [searchText, setSearchText] = useState<string>("");

    // EVENT HANDLER — when status dropdown changes
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setSelectedStatus(newStatus);
        onFilterChange({
            status: newStatus ? (newStatus as TaskStatus) : undefined,
            priority: selectedPriority ? (selectedPriority as "low" | "medium" | "high") : undefined,
            search: searchText || undefined,
        });
    };

    // EVENT HANDLER — when priority dropdown changes
    const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPriority = e.target.value;
        setSelectedPriority(newPriority);
        onFilterChange({
            status: selectedStatus ? (selectedStatus as TaskStatus) : undefined,
            priority: newPriority ? (newPriority as "low" | "medium" | "high") : undefined,
            search: searchText || undefined,
        });
    };

    // EVENT HANDLER — when search input changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearch = e.target.value;
        setSearchText(newSearch);
        onFilterChange({
            search: newSearch || undefined,
            status: selectedStatus ? (selectedStatus as TaskStatus) : undefined,
            priority: selectedPriority ? (selectedPriority as "low" | "medium" | "high") : undefined,
        });
    };

    return (
        <div className="flex items-center gap-5 flex-wrap">

            <h3 className="m-0 text-[13px] font-bold tracking-[0.12em] uppercase text-white/50 whitespace-nowrap">
                Filter Tasks
            </h3>

            {/* Search input */}
            <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-white/50 whitespace-nowrap" htmlFor="search-input">
                    Search:
                </label>
                <input
                    id="search-input"
                    type="text"
                    placeholder="Search tasks..."
                    value={searchText}
                    onChange={handleSearchChange}
                    className="bg-[#1e1e1e] border border-[#2a2a2a] text-white rounded-lg px-3.5 py-2 text-[13px] outline-none w-[180px]"
                />
            </div>

            {/* Status filter dropdown */}
            {/* BUG FIX: this dropdown was showing priority options (low/medium/high) — swapped to actual status values */}
            <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-white/50 whitespace-nowrap" htmlFor="status-filter">
                    Filter by Status:
                </label>
                <select
                    id="status-filter"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    className="bg-[#1e1e1e] border border-[#2a2a2a] text-white rounded-lg px-3.5 py-2 text-[13px] cursor-pointer outline-none"
                >
                    {/* Empty string = "show everything", no filter active */}
                    <option value="">All Status</option>
                    <option value="pending">📋 Pending</option>
                    <option value="in-progress">⚙️ In Progress</option>
                    <option value="completed">✅ Completed</option>
                </select>
            </div>

            {/* Priority filter dropdown */}
            <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-white/50 whitespace-nowrap" htmlFor="priority-filter">
                    Filter by Priority:
                </label>
                <select
                    id="priority-filter"
                    value={selectedPriority}
                    onChange={handlePriorityChange}
                    className="bg-[#1e1e1e] border border-[#2a2a2a] text-white rounded-lg px-3.5 py-2 text-[13px] cursor-pointer outline-none"
                >
                    <option value="">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

        </div>
    );
};

export default TaskFilter;
