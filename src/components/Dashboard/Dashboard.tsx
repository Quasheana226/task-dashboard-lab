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

    return (
        <div>
            <h1>Task Dashboard</h1>
        </div>
    )
}
