import { useEffect, useState } from "react";
import { DataBase_Strings } from "../../../../../constants/initial-states/Database.ts";
import ICurrentSprint from "../../../../../constants/interfaces/ICurrentSprint.ts";
import ITask from "../../../../../constants/interfaces/ITask.ts";
import LocalStorageManager from "../../../../../services/LocalStorageManager.ts";
import Button from "../../../../../components/button/button.tsx";
import "./calendar.css"
import ISprintz from "../../../../../constants/interfaces/Sprintz.ts";

interface IDatePickerForm {
    selectedDate: string;
}

interface ICalanderFilter {
    selectedYear: number;
    selectedMonth: number;
}

interface ICalandarProps {
    Sprintz: ISprintz | undefined;
    selectedSprint: ICurrentSprint | undefined;
    setSelectedSprint: (sprint: ICurrentSprint | undefined) => void
}

const Calendar = (props: ICalandarProps) => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentSprintRepo = new LocalStorageManager<ICurrentSprint>(DataBase_Strings.Current_Sprints_DB);
  const tasksRepo = new LocalStorageManager<ITask>(DataBase_Strings.Tasks_DB);
  const todaysDate = new Date();
  //TODO display number of completed tasks

    const [datePickerForm, setDatePickerForm] =  useState<IDatePickerForm>({
        selectedDate: todaysDate.toISOString().split('T')[0],
    });

    
    const [prevState, setPrevState] = useState<string | null>(null);

    const [calanderFilter, setCalanderFilter] = useState<ICalanderFilter>({
        selectedYear: todaysDate.getFullYear(),
        selectedMonth: todaysDate.getMonth()
    });

    const [calanderTitle, setCalanderTitle] = useState<string>("");

    const DaysInMonth = (month: number, year: number) => {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      return daysInMonth;
    }

      useEffect(() => {
          handleCalanderTitleDisplay(true);
      }, [calanderFilter.selectedMonth, calanderFilter.selectedYear]);

      const handlePrevState = () => {
      if(prevState === null){
          setPrevState(datePickerForm.selectedDate);
      }
    }

      const handleChangeSelectedDate = (day: number) => () => {
      handlePrevState();
      const month = (calanderFilter.selectedMonth + 1).toString().padStart(2, '0');
      const dayString = day.toString().padStart(2, '0');
      const selectedDateString = `${calanderFilter.selectedYear}-${month}-${dayString}`;
      setDatePickerForm({ ...datePickerForm, selectedDate: selectedDateString });
    }

        const handleCalanderTitleDisplay = (needsUpdate: boolean = false) => {
        if(needsUpdate){
            if(calanderTitle.includes("/")){
                setCalanderTitle(`${calanderFilter.selectedMonth + 1} / ${calanderFilter.selectedYear}`);
            } else {
                setCalanderTitle(`${monthsOfYear[calanderFilter.selectedMonth]} ${calanderFilter.selectedYear}`);
            }
        }else{
            if(calanderTitle.includes("/")){
                setCalanderTitle(`${calanderFilter.selectedMonth + 1} / ${calanderFilter.selectedYear}`);
            } else {
                setCalanderTitle(`${monthsOfYear[calanderFilter.selectedMonth]} ${calanderFilter.selectedYear}`);
            }

        }
    }

    const generateCalanderHeader = () => {
    return <div className="calandar-header">
        {daysOfWeek.map((day) => (<div className="calendar-day">{day}</div>))}
    </div>;
    }

    const removeDatesZeros = (str:string) => {
        let retNum = 0;
            if(str.charAt(0) === "0"){
                retNum = JSON.parse(str.slice(1));
            }else{
                retNum = JSON.parse(str);
            }
            return retNum;
    }

    const isDayInSprint = (day: number) => {
        let isIncluded = true;

        if(props.selectedSprint){
            const sprintsSDdateStrings: string[] = props.selectedSprint.startDate.toString().split("-");
            const SDYear = JSON.parse(sprintsSDdateStrings[0]);
            let SDMonth = removeDatesZeros(sprintsSDdateStrings[1]);
            const SDDay = removeDatesZeros(sprintsSDdateStrings[2]);

            const sprintsEDdateStrings: string[] = props.selectedSprint.endDate.toString().split("-");
            const EDYear = JSON.parse(sprintsEDdateStrings[0]);
            let EDMonth = removeDatesZeros(sprintsSDdateStrings[1]);
            const EDDay = removeDatesZeros(sprintsEDdateStrings[2]);

            const sprintsSD = new Date(SDYear, SDMonth - 1, SDDay, 0, 0, 0, 0);
            const sprintsED = new Date(EDYear, EDMonth - 1, EDDay, 0, 0, 0, 0);
            const daysDate = new Date(calanderFilter.selectedYear, calanderFilter.selectedMonth, day, 0, 0, 0, 0);
            if(daysDate < sprintsSD){
                isIncluded = false;
            }
            if(daysDate > sprintsED){
                isIncluded = false;
            }
        }else{
            isIncluded = false;
        }

        return isIncluded;
    }


      const generateCalanderDays = () => {
        const daysInMonth = DaysInMonth(calanderFilter.selectedMonth, calanderFilter.selectedYear);
        const daysInPrevMonth = calanderFilter.selectedMonth === 0 ? DaysInMonth(11, calanderFilter.selectedYear -1) : DaysInMonth(calanderFilter.selectedMonth -1, calanderFilter.selectedYear);
        const dayElements = [];
        const firstDayOfMonth = new Date(calanderFilter.selectedYear, calanderFilter.selectedMonth, 1).getDay();
        const blankDays = daysOfWeek.findIndex(day => day === daysOfWeek[firstDayOfMonth]) || 0;
        for (let i = 0; i < blankDays; i++) {
            dayElements.push(<div className="calendar-day-body empty-day">{daysInPrevMonth - blankDays + i + 1}</div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            if(isDayInSprint(i)){
                dayElements.push(<div onClick={handleChangeSelectedDate(i)} className={"calendar-day-body sprint-day"}>{i}</div>)
            }else{
                dayElements.push(<div onClick={handleChangeSelectedDate(i)} className={"calendar-day-body"}>{i}</div>);
            }
        }

        const totalCells = blankDays + daysInMonth;
        const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        for (let i = 1; i <= remainingCells; i++) {
            dayElements.push(<div className="calendar-day-body empty-day">{i}</div>);
        }
        return dayElements;
    }

        const handleCanlanderNavigation = (direction: "prev" | "next") => () => {
        if(direction === "prev"){
            if(calanderFilter.selectedMonth === 0){
                setCalanderFilter({
                    selectedMonth: 11,
                    selectedYear: calanderFilter.selectedYear - 1
                });
            }else{
                setCalanderFilter({
                    ...calanderFilter,
                    selectedMonth: calanderFilter.selectedMonth - 1
                });
            }
        }else{
            if(calanderFilter.selectedMonth === 11){
                setCalanderFilter({
                    selectedMonth: 0,
                    selectedYear: calanderFilter.selectedYear + 1
                });
            }else{
                setCalanderFilter({
                    ...calanderFilter,
                    selectedMonth: calanderFilter.selectedMonth + 1
                });
            }
        }
        handleCalanderTitleDisplay(true);
    }

  return <div className="calendar-main-container">
    <div className="calender-filter-container">
        <Button buttonLabel={"<"} clicked={handleCanlanderNavigation("prev")} />
        <span onClick={() => handleCalanderTitleDisplay()}>{calanderTitle || `${calanderFilter.selectedMonth + 1} / ${calanderFilter.selectedYear}`}</span>
        <Button buttonLabel={">"} clicked={handleCanlanderNavigation("next")} />
    </div>
    {generateCalanderHeader()}
    <div className="calendar-body">
        {generateCalanderDays()}
    </div>
  </div>
}

export default Calendar;