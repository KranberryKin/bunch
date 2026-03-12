import IUser from "../constants/interfaces/user.ts";
import LocalStorageManager from "./LocalStorageManager.ts";
import ISprintz from "../constants/interfaces/Sprintz.ts";
import ICurrentSprint from "../constants/interfaces/ICurrentSprint.ts"
import ITask from "../constants/interfaces/ITask.ts"
import { DataBase_Strings } from "../constants/initial-states/Database.ts";
import IUserThemePref from "../constants/interfaces/userThemePref.ts";
import IComment from "../constants/interfaces/IComments.ts"
import IBudget from "../constants/interfaces/budget.ts"
import IIncomeStream from "../constants/interfaces/IIncomeStream.ts"
import IBills from "../constants/interfaces/IBills.ts"
import { promises as fs } from 'fs';

interface IDatabaseState {
  Users: IUser[],
  UserPreferences: IUserThemePref[],
  Budgets: IBudget[],
  IncomeStreams: IIncomeStream[],
  Bills: IBills[],
  Sprintz: ISprintz[],
  CurrentSprints: ICurrentSprint[],
  Tasks: ITask[],
  TaskComments: IComment[]
}

class DatabaseManager {
  private _usersRepo: LocalStorageManager<IUser>;
  private _UserPrefRepo: LocalStorageManager<IUserThemePref>;
  private _budgetsRepo: LocalStorageManager<IBudget>;
  private _incomeStreamsRepo: LocalStorageManager<IIncomeStream>;
  private _billsRepo: LocalStorageManager<IBills>
  private _sprintzRepo: LocalStorageManager<ISprintz>;
  private _currentSprintsRepo: LocalStorageManager<ICurrentSprint>;
  private _tasksRepo: LocalStorageManager<ITask>;
  private _taskCommentsRepo:LocalStorageManager<IComment>;
  private DatabaseState: IDatabaseState;


  constructor () {
    this._usersRepo = new LocalStorageManager<IUser>(DataBase_Strings.Users_DB);
    this._UserPrefRepo = new LocalStorageManager<IUserThemePref>(DataBase_Strings.UserPref_DB);
    this._budgetsRepo = new LocalStorageManager<IBudget>(DataBase_Strings.Budget_DB);
    this._incomeStreamsRepo = new LocalStorageManager<IIncomeStream>(DataBase_Strings.Income_Stream_DB);
    this._billsRepo = new LocalStorageManager<IBills>(DataBase_Strings.Bills_DB);
    this._sprintzRepo = new LocalStorageManager<ISprintz>(DataBase_Strings.Sprintz_DB);
    this._currentSprintsRepo = new LocalStorageManager<ICurrentSprint>(DataBase_Strings.Current_Sprints_DB);
    this._tasksRepo = new LocalStorageManager<ITask>(DataBase_Strings.Tasks_DB);
    this._taskCommentsRepo = new LocalStorageManager<IComment>(DataBase_Strings.Task_Comments_DB);
    this.DatabaseState = this.getDatabaseState();
  }

  private getDatabaseState = (): IDatabaseState => {
    const DatabaseState: IDatabaseState = {
      Users: this._usersRepo.values,
      UserPreferences: this._UserPrefRepo.values,
      Budgets: this._budgetsRepo.values,
      IncomeStreams: this._incomeStreamsRepo.values,
      Bills: this._billsRepo.values,
      Sprintz: this._sprintzRepo.values,
      CurrentSprints: this._currentSprintsRepo.values,
      Tasks: this._tasksRepo.values,
      TaskComments: this._taskCommentsRepo.values
    }
    return DatabaseState;
  }

  private InternalStateUpdate() {
    this._usersRepo.get();
    this._UserPrefRepo.get();
    this._budgetsRepo.get();
    this._incomeStreamsRepo.get();
    this._billsRepo.get();
    this._sprintzRepo.get();
    this._currentSprintsRepo.get();
    this._tasksRepo.get();
    this._taskCommentsRepo.get();
    this.DatabaseState = this.getDatabaseState();
  }

  public ReturnDatabaseState() {
    this.InternalStateUpdate()
    return this.DatabaseState;
  }

  public async ExportFullDatabaseState() {
    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0].replaceAll('/', '-');
    const fileName = `bunch-database-export-${todayDateString}.txt`;
    const data = JSON.stringify(this.DatabaseState);
    try{
      await fs.writeFile(fileName, data);
      console.log(`Text successfully written to ${fileName}`);
    }catch (ex) {
      console.error("Error exporting database state:", ex);
    }
  }



}