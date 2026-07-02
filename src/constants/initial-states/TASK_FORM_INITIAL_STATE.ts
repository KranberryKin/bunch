import TaskCategory from "../interfaces/TaskCategory";
import TaskStatus from "../interfaces/TaskStatus";

interface ITASK_FORM_INITIAL_STATE{
    
}

const TASK_FORM_INITIAL_STATE = {
    formState: {
        id:  0,
        sprintzId: 0,
        creatorUserId: 0,
        title: "",
        description: "",
        status: TaskStatus.StandAlone,
        category: TaskCategory.Task,
        assignedToUserId: undefined,
        startDate: undefined,
        projectedEndDate: undefined,
        completionDate: undefined,
        estimatedStoryPoints: undefined,
        actualStoryPoints: undefined,
    },
    notNeededKeys: ["id", "creatorUserId", "sprintzId", "startDate", "projectedEndDate", "completionDate", "actualStoryPoints", "assignedToUserId"]
}

export default TASK_FORM_INITIAL_STATE;