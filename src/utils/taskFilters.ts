import type { Task, TaskStatus } from "../types";



export function filterTasks(
    tasks: Task[],
    filters: {
        status?: TaskStatus;
        priority?: 'low' | 'medium' | 'high';
        search?: string;
    }
    ): Task[] {
    return tasks.filter((task) => {


        //STATUS CHECK 

        if (filters.status && task.status !== filters.status) {
            return false;
        }


        //PRIORITY CHECK
        if (filters.priority && task.priority !== filters.priority) {
            return false;
        }

        // SEARCH CHECK
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
}
        


