import { DataBase_Strings } from "../constants/initial-states/Database.ts";
import ICurrentSprint from "../constants/interfaces/ICurrentSprint.ts";
import ICurrentSprintTasks from "../constants/interfaces/ICurrentSprintTaks.ts";
import ISprintStats from "../constants/interfaces/ISprintStats.ts";
import ITask from "../constants/interfaces/ITask";
import ISprintz from "../constants/interfaces/Sprintz.ts";
import TaskStatus from "../constants/interfaces/TaskStatus.ts";
import LocalStorageManager from "./LocalStorageManager.ts";

class StatisticsService {
  private _tasksRepo: LocalStorageManager<ITask>;
  private _statisticsRepo: LocalStorageManager<ISprintStats>;

  constructor() {
    this._tasksRepo = new LocalStorageManager<ITask>(DataBase_Strings.Tasks_DB);
    this._statisticsRepo = new LocalStorageManager<ISprintStats>(DataBase_Strings.Sprint_Statistics);
  }

  private _createStat = (sprintz: ISprintz, selectedSprint: ICurrentSprint) => {
    const allTasks: ITask[] = this._tasksRepo.values.filter((task) => task.currentSprintId === selectedSprint.id);
    let totalTasks = allTasks.length;
    let totalStoryPoints:number = 0;
    let completedStoryPoints:number = 0;
    for(let i = 0; i < allTasks.length; i++){
        if(allTasks[i].estimatedStoryPoints !== undefined){
            totalStoryPoints += parseInt(allTasks[i].estimatedStoryPoints?.toString()!);
            if(allTasks[i].status === TaskStatus.Complete){
                completedStoryPoints += parseInt(allTasks[i].estimatedStoryPoints?.toString()!);
            }
        }
    }
    let completedTasks = allTasks.filter((task) => task.status === TaskStatus.Complete).length;
    let percentTasks = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    let percentPoints = totalStoryPoints > 0 ? (completedStoryPoints / totalStoryPoints) * 100 : 0;
    const SprintStats: ISprintStats = {
        id: 0,
        sprintId: selectedSprint.id,
        sprintzId: sprintz.id,
        projectedPoints: totalStoryPoints,
        completedPoints: completedStoryPoints,
        percentPoints: percentPoints,
        totalTasks: totalTasks,
        completedTasks: completedTasks,
        percentTasks: percentTasks
    }
    this._statisticsRepo.add(SprintStats);
  }

  private removeStat = (stat: ISprintStats) => {
    this._statisticsRepo.deleteData(stat);
  }

      public generateSprintStats = (sprintz: ISprintz | undefined, selectedSprint: ICurrentSprint | null) => {
        try{
            const doesStatExsist = this._statisticsRepo.values.some((stat) => stat.sprintId === selectedSprint?.id);
            if(sprintz && selectedSprint){
                if(!doesStatExsist){
                    this._createStat(sprintz, selectedSprint)
                }else{
                    this.removeStat(this._statisticsRepo.values.find((stat) => stat.sprintId === selectedSprint.id)!)
                    this._createStat(sprintz, selectedSprint)
                }
            }
        }
        catch (ex) {
          console.warn("Error generating sprint statistics:", ex);
        }
    };
}

export default StatisticsService;