import { useState } from "react";
import "./currentsprintform.css"
import { useNotify } from "../../../contextProvider/notifyContext.tsx";
import LocalStorageManager from "../../../services/LocalStorageManager.ts";
import ICurrentSprint from "../../../constants/interfaces/ICurrentSprint";
import { DataBase_Strings } from "../../../constants/initial-states/Database.ts";
import ISprintz from "../../../constants/interfaces/Sprintz";
import CustomDatePicker from "../../customdatepicker/CustomDatePicker.tsx";
import Button from "../../button/button.tsx";


interface ISprintForm{
  name:string;
  startDate: string;
  endDate:string;
}

interface ICurrentSprintFormProps {
  Sprintz: ISprintz | undefined;
  callbackFunc?: () => void;
}


const CurrentSprintForm = (props: ICurrentSprintFormProps) => {

  const currentSprintRepo = new LocalStorageManager<ICurrentSprint>(DataBase_Strings.Current_Sprints_DB);
  const [currentSprintForm, setCurrentSprintForm] = useState<ISprintForm>({
    name: "",
    startDate: "",
    endDate: ""
  });
  const formDetails = Object.keys(currentSprintForm);
  const { sendNotify } = useNotify();

  const validateForm = () => {
    let isValid = true;

    if(currentSprintForm.name.length < 3 || currentSprintForm.name === "") {
      sendNotify("Sprint name must be at least 3 characters long.");
      isValid = false;
    }

    if(currentSprintForm.startDate === "") {
      sendNotify("Start date is required. If date is present, please re-submit date-picker.");
      isValid = false;
    }

    if(currentSprintForm.endDate === "") {
      sendNotify("End date is required. If date is present, please re-submit date-picker.");
      isValid = false;
    }

    if(currentSprintForm.startDate && currentSprintForm.endDate) {
      const startDate = new Date(currentSprintForm.startDate);
      const endDate = new Date(currentSprintForm.endDate);

      if(startDate >= endDate) {
        sendNotify("Start date must be before end date.");
        isValid = false;
      }
    }

    if(currentSprintForm.startDate && currentSprintForm.endDate) {
      const startDate = new Date(currentSprintForm.startDate);
      const endDate = new Date(currentSprintForm.endDate);
      const dateDiff: number = Math.abs(endDate.getTime() - startDate.getTime());
      const daysDiff: number = Math.ceil(dateDiff / (1000 * 60 * 60 * 24));

      if(daysDiff !== 7 && daysDiff !== 14 && (daysDiff !== 30 && daysDiff !== 28 && daysDiff !== 31 && daysDiff !== 29)) {
        sendNotify("Date ranges must be either 1 week, 2 weeks, or 1 month.");
        isValid = false;
      }
    }

    if(currentSprintRepo.values.filter(s => s.name === currentSprintForm.name).length > 0) {
      sendNotify("A sprint with this name already exists.");
      isValid = false;
    }
    
    return isValid;
  }

  const handleDatePicked = (formDetail: string, selectedDate: string) => {
    const updatedForm = { ...currentSprintForm, [formDetail]: selectedDate };
    setCurrentSprintForm(updatedForm);
  };

  const handleFormButtonClicked = (whichButton: "Submit" | "Clear") => {
    if(whichButton === "Submit"){
      if(validateForm()){
        if(props.Sprintz){
          const newCurrentSprint:ICurrentSprint = {
            id: currentSprintRepo.generateId(),
            sprintzId: props.Sprintz.id,
            name: currentSprintForm.name,
            startDate: new Date(currentSprintForm.startDate),
            endDate: new Date(currentSprintForm.endDate)
          }
          currentSprintRepo.add(newCurrentSprint);
          if(props.callbackFunc) {
            props.callbackFunc();
          }
        }
      }
    }else{
      setCurrentSprintForm({
        name: "",
        startDate: "",
        endDate: ""
      })
      if(props.callbackFunc){
        props.callbackFunc();
      }
    }
  }


  return <div className="current-sprint-form-main-container">
    <div className="current-sprint-form-title">
      {"Current Sprint Form"}
    </div>
    <div className="current-sprint-form-body">
      {formDetails.map((formDetails, index) => (
        <div key={formDetails + index}>
          {formDetails.includes("Date") ?
            <div> {formDetails + " : "}<CustomDatePicker callbackFunction={(selectedDate) => handleDatePicked(formDetails, selectedDate)}/></div> 
            : <div>{formDetails + " : "}<input type="text" value={currentSprintForm[formDetails as keyof ISprintForm]} onChange={(e) => setCurrentSprintForm({ ...currentSprintForm, [formDetails]: e.target.value })} /></div>}
        </div>
      ))}
      <div className="current-sprint-form-buttons">
        <Button buttonLabel="Submit" clicked={() => handleFormButtonClicked("Submit")} />
        <Button buttonLabel="Clear" clicked={() => handleFormButtonClicked("Clear")} />
      </div>
    </div>
  </div>
}

export default CurrentSprintForm;