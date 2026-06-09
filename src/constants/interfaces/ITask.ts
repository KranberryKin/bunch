import TaskCategory from "./TaskCategory.ts";
import TaskStatus from "./TaskStatus.ts";

interface ITask {
    id: number;
    sprintzId: number;
    creatorUserId: number;
    assignedToUserId?: number;
    currentSprintId?: number;
    title: string;
    description: string;
    startDate?: string;
    completionDate?: string;
    status: TaskStatus;
    category: TaskCategory;
    estimatedStoryPoints?: number;
    actualStoryPoints?: number;
}
export default ITask;