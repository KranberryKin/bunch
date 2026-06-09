import "../../../../decalrations.ts"
import "./statistics.css";
import { useEffect, useMemo, useState } from "react";
import { DataBase_Strings } from "../../../../constants/initial-states/Database.ts";
import ISprintStats from "../../../../constants/interfaces/ISprintStats.ts";
import ISprintz from "../../../../constants/interfaces/Sprintz.ts";
import LocalStorageManager from "../../../../services/LocalStorageManager.ts";
import CustomDropdown from "../../../../components/customDropdown/CustomDropdown.tsx";
import ICurrentSprint from "../../../../constants/interfaces/ICurrentSprint.ts";
import Button from "../../../../components/button/button.tsx";
import StatisticsService from "../../../../services/StatisticsService.ts";

interface IStatisticsProps {
    sprintz: ISprintz | undefined;
    selectedSprint: ICurrentSprint | undefined;
    setSelectedSprint: (sprint: ICurrentSprint | undefined) => void;
}

const Statistics = (props: IStatisticsProps) => {
    const { sprintz, selectedSprint, setSelectedSprint } = props;
    const sprintRepo = new LocalStorageManager<ICurrentSprint>(DataBase_Strings.Current_Sprints_DB);
    const statisticsRepo = new LocalStorageManager<ISprintStats>(DataBase_Strings.Sprint_Statistics);
    const statsService = new StatisticsService();
    const [allSprints, setAllSprints] = useState<ICurrentSprint[]>([]);
    const [statistics, setStatistics] = useState<ISprintStats | null>(null);
    const [isSelectingSprint, setIsSelectingSprint] = useState(false);

    const setChosenSprint = (sprintname: string) => {
        const sprint = allSprints.filter(s => s.name === sprintname)[0];
        setSelectedSprint(sprint);
        setIsSelectingSprint(!isSelectingSprint);
    }

    const setState = () => {
        if (selectedSprint) {
            statisticsRepo.get();
            let stats: ISprintStats | null = null;
            const statsIndex = statisticsRepo.values.findIndex((stat) => stat.sprintId === selectedSprint.id);
            if (statsIndex !== -1) {
                stats = statisticsRepo.values[statsIndex];
            }
            setStatistics(stats);
        };
    };

    const setAllSprintzSprints = () => {
        if(sprintz){
            sprintRepo.get();
            if(sprintRepo.values && sprintRepo.values.length > 0){
                const thisSprintzSprints = sprintRepo.values.filter((sprint) => sprint.sprintzId === sprintz.id);
                setAllSprints(thisSprintzSprints);
            };
        };
    };

    const generateStats = () => {
        if(sprintz && selectedSprint){
            statsService.generateSprintStats(sprintz, selectedSprint);
            setState();
        }
    }

    useEffect(() => {
        setState();
    }, [selectedSprint]);

    useEffect(() => {
        setAllSprintzSprints();
    },[sprintz]);

    return (
        <div className="sprint-details-stats-main-container">
            <div className="sprint-details-stats-header">
                <h3>Sprint Statistics</h3>
                <div>
                    <label>Select Sprint:</label>
                    {isSelectingSprint ? (
                        <CustomDropdown listOptions={allSprints?.map((sprint) => sprint.name)} callback={(selectedSprint) => setChosenSprint(selectedSprint)} />
                    ) : (
                        <p onClick={() => setIsSelectingSprint(!isSelectingSprint)}>{selectedSprint?.name || "No Sprint Selected"}</p>
                    )}
                </div>
            </div>
            <div className="sprint-details-stats-body">
                <div className="sprint-details-stats-header-content">
                    <h4>Statistics</h4>
                    { selectedSprint && <Button buttonLabel={"Generate Stats"} clicked={() => generateStats()} /> }
                </div>
                {!statistics ? <div>No Stats to display.</div> : (
                    <div>
                        <div>
                            <p>Total Tasks: {statistics.totalTasks}</p>
                            <p>Completed Tasks: {statistics.completedTasks}</p>
                            <p>Completion Percentage: {statistics.percentTasks}%</p>
                        </div>
                        <div>
                            <p>Projected Points: {statistics.projectedPoints}</p>
                            <p>Actual Points: {statistics.completedPoints}</p>
                            <p>Points Completion Percentage: {statistics.percentPoints}%</p>
                        </div>
                    </div>
                )}
                
            </div>
        </div>
    );
}
export default Statistics;