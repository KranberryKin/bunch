import ICurrentSprint from "../constants/interfaces/ICurrentSprint.ts";
import { DataBase_Strings } from "../constants/initial-states/Database.ts";
import ICurrentSprintTasks from "../constants/interfaces/ICurrentSprintTasks.ts";
import ITask from "../constants/interfaces/ITask.ts";
import ISprintz from "../constants/interfaces/Sprintz.ts";
import LocalStorageManager from "./LocalStorageManager.ts";

class SprintzCascadeService {
  private _SprintzRepo;
  private _TasksRepo;
  private _CurrentSprintRepo;
  private _CurrentSprintTasksRepo;

  constructor () {
    this._SprintzRepo = new LocalStorageManager<ISprintz>(DataBase_Strings.Sprintz_DB);
    this._TasksRepo = new LocalStorageManager<ITask>(DataBase_Strings.Tasks_DB);
    this._CurrentSprintTasksRepo = new LocalStorageManager<ICurrentSprintTasks>(DataBase_Strings.Current_Sprints_Tasks_DB);
    this._CurrentSprintRepo = new LocalStorageManager<ICurrentSprint>(DataBase_Strings.Current_Sprints_DB);
  }

  private deleteSprintzCurrentSprintTasks (allCurrentSprintsTasks: ICurrentSprintTasks[]) {
    let currentSprintTask: ICurrentSprintTasks | undefined = undefined;
      //Delete All Task Relationships to CurrentSprints
      try{
        for(let i = 0; i < allCurrentSprintsTasks.length; i++){
          currentSprintTask = allCurrentSprintsTasks[i];
          if(currentSprintTask){
            this._CurrentSprintTasksRepo.deleteData(currentSprintTask);
          }
        }
      }catch(ex){
        console.log("Error occurred while deleting current sprint tasks:", ex, "Current Sprint Task:", currentSprintTask);
        throw(new Error("Failed to delete current sprint tasks"));
      }
  }

  private deleteSprintzCurrentSprints (allSprintzCurrentSprints: ICurrentSprint[]) {
      // Delete All Current Sprints accosiated with Sprintz
      let currentSprint: ICurrentSprint | undefined = undefined;
      try{
        for(let i = 0; i < allSprintzCurrentSprints.length; i++){
          currentSprint = allSprintzCurrentSprints[i];
          this._CurrentSprintRepo.deleteData(currentSprint);
        }
      } catch (ex) {
        console.log("Error occurred while deleting current sprints:", ex, "Current Sprint:", currentSprint);
        throw(new Error("Failed to delete current sprints"));
      }
  }

  private deleteAllSprintzTasks (allSprintzTasks: ITask[]) {
      // Delete All Tasks accosiated with Sprintz
      let currentTask: ITask | undefined = undefined;
      try{
        for(let i = 0; i < allSprintzTasks.length; i++){
          currentTask = allSprintzTasks[i];
          this._TasksRepo.deleteData(currentTask);
        }
      } catch (ex) {
        console.log("Error occurred while deleting tasks:", ex, "Current Task:", currentTask);
        throw(new Error("Failed to delete tasks"));
      }
  }

  deleteSprintz(sprintz: ISprintz) {
    try{
      const allSprintzTasks: ITask[] = this._TasksRepo.values.filter(task => task.sprintzId === sprintz.id);
      const allSprintzCurrentSprints: ICurrentSprint[] = this._CurrentSprintRepo.values.filter(sprint => sprint.sprintzId === sprintz.id);
      const allCurrentSprintsTasks: ICurrentSprintTasks[] = [];
      for(let i = 0; i < allSprintzTasks.length; i++){
        const currentTask = allSprintzTasks[i];
        const sprintTask = this._CurrentSprintTasksRepo.values.find((t) => t.taskId === currentTask.id);
        if(sprintTask){
          allCurrentSprintsTasks.push(sprintTask);
        }
      }

      this.deleteSprintzCurrentSprintTasks(allCurrentSprintsTasks);

      this.deleteSprintzCurrentSprints(allSprintzCurrentSprints)

      this.deleteAllSprintzTasks(allSprintzTasks)

      this._SprintzRepo.deleteData(sprintz);
    }catch(ex){
      console.error("Error occurred while deleting Sprintz:", ex);
    }
  }


}

export default SprintzCascadeService;