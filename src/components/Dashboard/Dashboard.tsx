//DASH BOARD COMPONENT 
//The brain of the whol app 
// it holda all task data in on place like and passes it down to every other component 


import React, { useState, useEffect } from 'react';
import type { Task, TaskStatus } from '../../types';



const Dashboard: React.FC = () => {
    // STATE-TASK
    // List of all TAsks every component gets it data from here

    const [tasks, setTasks] = useState<Task[]>([]);

    // STATE-FILTERS useState
    // Tracks what user selected in the search bar and empty object means no filters are active 
    const [filters, setFilters] = useState<{
        status?: TaskStatus;
        priority?: 'low' | 'mediom' | 'high';
        search?: string;
    }>({});


    //STATE -SHOW FORM
    // Controls weather add or edit form showing or hidden 
    const [showForm, setShowForm] = useState<boolean>(false)

    // LOAD TASKS FORM LOCAL STORAGE
    // Cchecks to see if user task are saved and loads the to state
    useEffect(() => {
        const saved = localStorage.getItem('dashboard-tasks')

        if (saved !== null) {
            // saves data parse it from a string back into an array
            const parsed = JSON.parse(saved) as Task[];
            setTasks(parsed);
            // console.log('Loaded tasks frome localStorage:', parsed.length);
        } else {
            // No data saved first time opening app
            // console.log('Sorry No saved task found, Start Fresh');
        }
    }, []); // run once only


    //SAVE TASKS TO LOCALSTORAGE

    // converts the array to a string and saves it and  survies a page refresh 

    useEffect(() => {
        localStorage.setItem('dashboard-tasks', JSON.stringify(tasks));
        // console.log('Tasks saved:', tasks.length); 

    }, [tasks]);

    //HANDLER ADD OR EDIT A TASK
    //Called by taks  when user clicls submit 
    const handleAddTask = (taskData: Task) => {

        if (taskToEdit! == null) {
            //find old version and swap it to the new updated one 
            const updatedTasks = tasks.map((task) => {
                if (task.id === taskData.id) {
                    return taskData; // Replace with the updated task
                } else {
                    return task; // Keep Everything the same 
                }
            });

            setTasks(updatedTasks);
            // console.log('Task edited:', taskData.id);
        } else {
            // Put new task at the front of the lisr
            setTasks([taskData, ...tasks]);
            //console.log("Task added:", taskData.id);
        }
        //Close the form and clear editing state 
        setShowForm(false);
        setTaskToEdit(null);
    };


    //HANDLER OPEN EDIT THE FORM
    //Called when user clicks edit button 
    const handleEditTask = (task: Task) => {
        const updatedTasks = tasks, map((task) => {
            if (task.id === taskId) {
                return { ...task, status: 'Status' }; //Update only status

            } else {
                return task; // keep everything the same 
            }
        });
        setTasks(remaining);
        // console.log('Task deleted:', taskId);
    }

    //HANDLER FILTER CHANGED 
    //TaskFilter whenever the user changes a dropdown or types in search bar    
    const handleFilterChange = (newFilters: {
        status?: TaskStatus;
        priority?: 'low ' | 'medium' | 'high';
        search?: string;
    }) => {
        setFilters(newFilters);
        //console.log('Folters updated:', newFilters);
    };

    // FILTERING LOGIC
    //This runs every tasks and keeps one that match active filters 
    const filteredTasks = tasks.filter((tasks) => {


        //CHeck status filter 
        if (filters.status && tasks.status !== filters.status) {
            return false;
        }

        //check priority filter 

        if (filters.priority && tasks.status !== filters.priority) {
            return false;
        }

        //Check search 
        if (filters.search && filters.search.trim() !== '') {
            const query = filters.search.toLowerCase();
            const titleMatch = tasks.title.toLowerCase().includes(query);
            const descMatch = tasks.description.toLowerCase().includes(query);

            if (!titleMatch && !descMatch) {
                return false;

            }
        }

        return true;

    })



    return (
        <div>
            <h1>Task Dashboard</h1>
        </div>
    )
}
