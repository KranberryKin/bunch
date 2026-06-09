import React, { useState } from "react";
import "./incomestreamform.css";
import LocalStorageManager from "../../../services/LocalStorageManager.ts";
import IIncomeStream from "../../../constants/interfaces/IIncomeStream.ts";
import { DataBase_Strings } from "../../../constants/initial-states/Database.ts";

const IncomeStreamForm = ({budgetId}:{budgetId:number}) => {
    const incomeStreamRepo = new LocalStorageManager<IIncomeStream>(DataBase_Strings.Income_Stream_DB);
    const [newIncomeStream, setNewIncomeStream] = useState<IIncomeStream>({
        id: incomeStreamRepo.generateId(),
        buget_id: budgetId,
        pay: 0,
        income_stream: 0,
    });

    const updateForm = (inputName:string, e: string) => {
        if(inputName === "pay"){
            setNewIncomeStream({...newIncomeStream, pay: Number(e)});
        }
        if(inputName === "income_stream"){
            setNewIncomeStream({...newIncomeStream, income_stream: Number(e)});
        }

    };
    return (
        <div className="income-stream-form-main-container">
            <div>
                Income Stream Form
            </div>
            <div>
                <div className="income-stream-form-container">
                    <div>
                        <label htmlFor="pay">Pay: </label>
                        <input type="number" id="pay" name="pay" value={newIncomeStream.pay} onChange={(e) => updateForm(e.target.name, e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="income_stream">Income Stream: </label>
                        <input type="number" id="income_stream" name="income_stream" value={newIncomeStream.income_stream} onChange={(e) => updateForm(e.target.name, e.target.value)} />
                    </div>
                </div>    
            </div>
        </div>
    )
}
export default IncomeStreamForm;