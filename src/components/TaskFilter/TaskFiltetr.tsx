// Shows two dropdowns by status and priority  when changes

import React, { useState } from "react";

import type { TaskFilterProps, TaskStatus } from "../../types";

const TaskFilter: React.FC<TaskFilterProps> = ({ onFilterChange }) => {
    //LOCAL STATE
    // When you call setvalue react re renders component

    const [selectedStatus, setSelectedStatus] = useState<string>(""); // Tracks whish status filter is selected '' means no filter

    const [selectedPriority, setSelectedPriority] = useState<string>(""); // Tracks which status priority is selected '' means show all

    const [searchText, setSearchText] = useState<string>("");

    //EVENT HANDLER  When status dropdown changes

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value; //get the chosen value from drop down
        // console.log('Status Filter:', newStatus || 'all');
        setSelectedStatus(newStatus); // Update local state show choice selected

        onFilterChange({
            status: newStatus ? (newStatus as TaskStatus) : undefined,
            priority: selectedPriority
                ? (selectedPriority as "low" | "medium" | "high")
                : undefined,
            search: searchText || undefined,
        });
    };

    //EVENT HANDLER When Priority dropdown changes

    const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPriority = e.target.value;
        // console.log('Priority Filter:', newPriority || 'all');
        setSelectedPriority(newPriority); // Update local state with chosen priority

        //Tell parent what filter is active
        onFilterChange({
            status: selectedStatus ? (selectedStatus as TaskStatus) : undefined,
            priority: newPriority ? (newPriority as "low" | "medium" | "high") : undefined, // send priority to parent
            search: searchText || undefined,
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearch = e.target.value;
        // console.log('Search text changed:', newSearch); // ← comment out when done
        setSearchText(newSearch);
        onFilterChange({
            search: newSearch || undefined,
            status: selectedStatus ? (selectedStatus as TaskStatus) : undefined,
            priority: selectedPriority ? (selectedPriority as "low" | "medium" | "high") : undefined,
        });
    };

    // JSX return

    return (
        <div style={styles.container}>
            <h3 style={styles.title}> Filter Tasks </h3>

            {/* search input */}
            <div style={styles.filterGroup}>
                <label style={styles.label} htmlFor="search-input">Search:</label>
                <input
                    id="search-input"
                    type="text"
                    placeholder="Search tasks..."
                    value={searchText}
                    onChange={handleSearchChange}
                    style={styles.searchInput}
                />
            </div>

            {/* status filter Dropdown */}
            <div style={styles.filterGroup}>
                {/* label describes the drop down */}
                <label style={styles.label} htmlFor="status-filter">
                    Filter by Status:
                </label>

                <select
                    id="status-filter"
                    value={selectedStatus} // value comes from state
                    onChange={handleStatusChange} // run this function whatever user picks
                    style={styles.select}
                >
                    {/* The first option no filter shows everything  */}
                    <option value="">ALL Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            {/* Priority filter dropdown */}
            <div style={styles.filterGroup}>
                {/* label describes the dropdown */}
                <label style={styles.label} htmlFor="priority-filter">
                    Filter by Priority:
                </label>

                <select
                    id="priority-filter"
                    value={selectedPriority} // value comes from state
                    onChange={handlePriorityChange} // run this function whenever user picks
                    style={styles.select}
                >
                    {/* The first option shows all tasks with no priority filter */}
                    <option value="">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap",
    },
    title: {
        margin: "0",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.5)",
        whiteSpace: "nowrap",
    },
    filterGroup: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    label: {
        fontSize: "12px",
        fontWeight: "600",
        color: "rgba(255,255,255,0.5)",
        whiteSpace: "nowrap",
    },
    select: {
        backgroundColor: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "10px",
        padding: "8px 14px",
        fontSize: "13px",
        color: "#ffffff",
        cursor: "pointer",
        outline: "none",
    },
    searchInput: {
        backgroundColor: "#ffffff",
        border: "1px solid #d1d5db",
        borderRadius: "10px",
        padding: "8px 14px",
        fontSize: "13px",
        color: "#111827",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        outline: "none",
        width: "180px",
    },
};

export default TaskFilter;
