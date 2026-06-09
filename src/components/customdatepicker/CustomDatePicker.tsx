import { useEffect, useState } from "react";
import "./customdatepicker.css"
import Button from "../button/button.tsx";

interface ICustomDatePickerProps {
    callbackFunction?: (selectedDate: string) => void;
}

interface IDatePickerForm {
    selectedDate: string;
}

interface ICalanderFilter {
    selectedYear: number;
    selectedMonth: number;
}

const CustomDatePicker = (props: ICustomDatePickerProps) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const todaysDate = new Date();
    const [datePickerForm, setDatePickerForm] =  useState<IDatePickerForm>({
        selectedDate: todaysDate.toISOString().split('T')[0],
    });

    const [calanderFilter, setCalanderFilter] = useState<ICalanderFilter>({
        selectedYear: todaysDate.getFullYear(),
        selectedMonth: todaysDate.getMonth()
    });

    const [calanderTitle, setCalanderTitle] = useState<string>("");
    const [prevState, setPrevState] = useState<string | null>(null);

    const handleCalanderTitleDisplay = (needsUpdate: boolean = false) => {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        if(needsUpdate){
            if(calanderTitle.includes("/")){
                setCalanderTitle(`${calanderFilter.selectedMonth + 1} / ${calanderFilter.selectedYear}`);
            } else {
                setCalanderTitle(`${monthNames[calanderFilter.selectedMonth]} ${calanderFilter.selectedYear}`);
            }
        }else{
            if(calanderTitle.includes("/")){
                setCalanderTitle(`${monthNames[calanderFilter.selectedMonth]} ${calanderFilter.selectedYear}`);
            } else {
                setCalanderTitle(`${calanderFilter.selectedMonth + 1} / ${calanderFilter.selectedYear}`);
            }

        }
    }

    const handlePrevState = () => {
        if(prevState === null){
            setPrevState(datePickerForm.selectedDate);
        }
    }

    useEffect(() => {
        handleCalanderTitleDisplay(true);
    }, [calanderFilter.selectedMonth, calanderFilter.selectedYear]);

    const [isHidden, setIsHidden] = useState<boolean>(true);

    const handleChangeSelectedDate = (day: number) => () => {
        handlePrevState();
        const month = (calanderFilter.selectedMonth + 1).toString().padStart(2, '0');
        const dayString = day.toString().padStart(2, '0');
        const selectedDateString = `${calanderFilter.selectedYear}-${month}-${dayString}`;
        setDatePickerForm({ ...datePickerForm, selectedDate: selectedDateString });
    }

    const DaysInMonth = (month: number, year: number) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return daysInMonth;
    }

    const generateCalanderHeader = () => {
        return <div className="custom-date-picker-calandar-header">
            {days.map((day) => (<div className="custom-date-picker-day">{day}</div>))}
        </div>;
    }

    const handleCalanderButtonClick = (action: string) => () => {
        if(action === "cancel" && prevState){
            setDatePickerForm({ ...datePickerForm, selectedDate: prevState });
            setPrevState(null);
        } else {
            setPrevState(null);
            setIsHidden(true);
            if(props.callbackFunction){
                props.callbackFunction(datePickerForm.selectedDate);
            }
        }
    }

    const generateCalanderDays = () => {
        const daysInMonth = DaysInMonth(calanderFilter.selectedMonth, calanderFilter.selectedYear);
        const daysInPrevMonth = calanderFilter.selectedMonth === 0 ? DaysInMonth(11, calanderFilter.selectedYear -1) : DaysInMonth(calanderFilter.selectedMonth -1, calanderFilter.selectedYear);
        const dayElements = [];
        const firstDayOfMonth = new Date(calanderFilter.selectedYear, calanderFilter.selectedMonth, 1).getDay();
        const blankDays = days.findIndex(day => day === days[firstDayOfMonth]) || 0;
        for (let i = 0; i < blankDays; i++) {
            dayElements.push(<div className="custom-date-picker-day empty-day">{daysInPrevMonth - blankDays + i + 1}</div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            dayElements.push(<div onClick={handleChangeSelectedDate(i)} className={"custom-date-picker-day date-pickable " + (i === parseInt(datePickerForm.selectedDate.split('-')[2]) && calanderFilter.selectedMonth === parseInt(datePickerForm.selectedDate.split('-')[1]) - 1 && calanderFilter.selectedYear === parseInt(datePickerForm.selectedDate.split('-')[0]) ? "today" : "")} >{i}</div>);
        }

        const totalCells = blankDays + daysInMonth;
        const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        for (let i = 1; i <= remainingCells; i++) {
            dayElements.push(<div className="custom-date-picker-day empty-day">{i}</div>);
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

    return (
    <div className="custom-date-picker-main-container">
        <div className="custom-date-picker-header">
            <div onClick={() => setIsHidden(!isHidden)} className="custom-date-picker-selected-date-display">
                {datePickerForm.selectedDate}
            </div>
        </div>
        <div hidden={isHidden} className="custom-date-picker-calandar-container">
            <div className="custom-date-picker-calandar-navigation-container">
                <Button buttonLabel={"<"} clicked={handleCanlanderNavigation("prev")} />
                <span onClick={() => handleCalanderTitleDisplay()}>{calanderTitle || `${calanderFilter.selectedMonth + 1} / ${calanderFilter.selectedYear}`}</span>
                <Button buttonLabel={">"} clicked={handleCanlanderNavigation("next")} />
            </div>
            {generateCalanderHeader()}
            <div className="custom-date-picker-calandar-days-container">
                {generateCalanderDays()}
            </div>
            <div className="custom-date-picker-button-container">
                <div>
                    <Button buttonLabel={"Confirm"} clicked={handleCalanderButtonClick("confirm")} />
                </div>
                <div>
                    <Button buttonLabel={"Cancel"} clicked={handleCalanderButtonClick("cancel")} />
                </div>
            </div>
        </div>
    </div>);
}
export default CustomDatePicker;