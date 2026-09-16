import React, { useState } from "react";
import "./incomestreamform.css";
import "../../../decalrations.ts";
import LocalStorageManager from "../../../services/LocalStorageManager.ts";
import IIncomeStream from "../../../constants/interfaces/IIncomeStream.ts";
import { DataBase_Strings } from "../../../constants/initial-states/Database.ts";
import IncomeStream from "../../../constants/interfaces/IncomeStream.ts";
import Button from "../../button/button.tsx"
import { useNotify } from "../../../contextProvider/notifyContext.tsx";

const IncomeStreamForm = ({budgetId, callbackFunc}:{budgetId:number, callbackFunc: () => any}) => {
    const incomeStreamRepo = new LocalStorageManager<IIncomeStream>(DataBase_Strings.Income_Stream_DB);
    const notify = useNotify();
    const [newIncomeStream, setNewIncomeStream] = useState<IIncomeStream>({
        id: incomeStreamRepo.generateId(),
        budget_id: budgetId,
        income_stream: IncomeStream.Hourly,
    });

    const updateForm = (inputName:string, e: string) => {
        if(inputName === "salary_amount"){
            setNewIncomeStream({...newIncomeStream, salary_amount: Number(e), hourly_amount: undefined});
        }
        if(inputName === "hourly_amount"){
            setNewIncomeStream({...newIncomeStream, hourly_amount: Number(e), salary_amount: undefined});
        }
        if(inputName === "income_stream"){
            setNewIncomeStream({...newIncomeStream, income_stream: e as IncomeStream});
        }
    };

    const validateForm = () => {
        let isValid = true;

        if((newIncomeStream?.hourly_amount && newIncomeStream.hourly_amount === 0 || newIncomeStream?.salary_amount && newIncomeStream.salary_amount === 0) || (!newIncomeStream?.hourly_amount && !newIncomeStream?.salary_amount)){
            isValid = false;
            notify.sendNotify("Please enter a valid income amount for the income stream.");
        }

        return isValid;
    }

    const buttonsClicked = (clickedButton: string) => {
        if(clickedButton === "Save" && validateForm()){
            incomeStreamRepo.add(newIncomeStream);
            if(callbackFunc){
                callbackFunc();
            }
        }
        if(clickedButton === "Cancel"){
            setNewIncomeStream({
                id: incomeStreamRepo.generateId(),
                budget_id: budgetId,
                hourly_amount: undefined,
                salary_amount: undefined,
                income_stream: IncomeStream.Hourly,
            });
            if(callbackFunc){
                callbackFunc();
            }
        }
    }
    
    return (
        <div className="income-stream-form-main-container">
            <div>
                Income Stream Form
            </div>
            <div className="income-stream-parent-container">
                <div className="income-stream-form-container">
                    <div>
                        <label htmlFor="income_stream">Income Stream: </label>
                        <select id="income_stream" name="income_stream" value={newIncomeStream.income_stream} onChange={(e) => updateForm(e.target.name, e.target.value)}>
                            <option value={IncomeStream.Hourly}>{IncomeStream.Hourly}</option>
                            <option value={IncomeStream.Salary}>{IncomeStream.Salary}</option>
                        </select>
                    </div>
                    {newIncomeStream.income_stream === IncomeStream.Salary ? (
                        <div>
                            <label htmlFor="salary_amount">Salary Amount: </label>
                            <input type="number" id="salary_amount" name="salary_amount" value={newIncomeStream.salary_amount} onChange={(e) => updateForm(e.target.name, e.target.value)} />
                        </div>
                    ) : newIncomeStream.income_stream === IncomeStream.Hourly && (
                        <div>
                            <label htmlFor="hourly_amount">Hourly Amount: </label>
                            <input type="number" id="hourly_amount" name="hourly_amount" value={newIncomeStream.hourly_amount} onChange={(e) => updateForm(e.target.name, e.target.value)} />
                        </div>
                    )}
                </div>
                <div className="income-stream-button-container">
                    <Button buttonLabel={"Save"} clicked={() => buttonsClicked("Save")} />
                    <Button buttonLabel={"Cancel"} clicked={() => buttonsClicked("Cancel")} />
                </div>
            </div>
        </div>
    )
}
export default IncomeStreamForm;