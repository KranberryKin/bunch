import { useEffect, useState } from "react";
import "./budgetform.css";
import IBudget from "../../../constants/interfaces/budget.ts";
import IUser from "../../../constants/interfaces/user.ts";
import Button from "../../button/button.tsx";
import LocalStorageManager from "../../../services/LocalStorageManager.ts";
import { DataBase_Strings } from "../../../constants/initial-states/Database.ts";

const BudgetForm = ({currentUser, onConfirm, onCancel}:{currentUser:IUser | undefined, onConfirm: () => any, onCancel:() => any }) => {

    const budgetRepository = new LocalStorageManager<IBudget>(DataBase_Strings.Budget_DB);
    const [budgetForm, setBudgetForm] = useState<IBudget>({
        id: budgetRepository.generateId(),
        name: "",
        user_id: currentUser?.id ?? 0,
        income_stream: [],
        bills: [],
    });

    useEffect(() => {
        if(currentUser){
            setBudgetForm({
                id: budgetRepository.generateId(),
                name: "",
                user_id: currentUser.id,
                income_stream: [],
                bills: [],
            });
        }
        
    }, [currentUser]);

    const submitBudgetForm = () => {
        if(budgetForm.name === ""){
            alert("Please fill out all fields");
            return;
        }else{
            budgetRepository.add(budgetForm);
            setBudgetForm({...budgetForm, name: ""});
            onConfirm();
        };
        
    };

    const cancelBudgetForm = () => {
        setBudgetForm({...budgetForm, name: ""});
        onCancel();
    };

    const budgetKeys = Object.keys(budgetForm);
    const budgetFormLabels = budgetKeys.filter(key => !key.includes("id") && key !== "income_stream" && key !== "bills");
    return (
        <div className="budget-form-container">
            <h3>Create New Budget</h3>
            <div className="budget-form">
                {budgetFormLabels.map((label, index) => (
                <div id={label + index}>
                    <label htmlFor={label}>{label[0].toLocaleUpperCase() + label.slice(1) + " "}</label>
                    <input type="text" id={label} name={label} value={budgetForm[label as keyof IBudget] as string} onChange={(e) => setBudgetForm({...budgetForm, [label]: e.target.value})} />
                </div>))}
                <div className="budget-form-buttons">
                    <Button buttonLabel={"Submit"} clicked={() => submitBudgetForm()} />
                    <Button buttonLabel={"Cancel"} clicked={() => cancelBudgetForm()} />
                </div>
            </div>
        </div>
        );
};

export default BudgetForm;