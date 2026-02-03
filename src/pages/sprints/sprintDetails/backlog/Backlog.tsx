import Button from "../../../../components/button/button.tsx";
import { DataBase_Strings } from "../../../../constants/initial-states/Database.ts";
import ISprintz from "../../../../constants/interfaces/Sprintz.ts";
import LocalStorageManager from "../../../../services/LocalStorageManager.ts";
import "./backlog.css";

interface IBacklogProps {
    currentSprint: ISprintz | undefined;
}

interface ITask {
    id: number;
    sprintId: number;
    title: string;
    description: string;
    status: string;
}

const Backlog = (props: IBacklogProps) => {

    const tasksRepository = new LocalStorageManager<ITask>(DataBase_Strings.Tasks_DB);
    const addTaskToBacklog = () => {
        
    };

    return (
        <div className="backlog-page-main-container">
            <div className="backlog-page-header">
                <div>
                    <h3>Backlog Items</h3>
                </div>
                <div>
                    <Button buttonLabel={"Add Backlog Item"} clicked={() => {}} />
                </div>
            </div>
            <div>
                <p>List of backlog items will be displayed here.</p>
            </div>
        </div>
    );
}
export default Backlog;