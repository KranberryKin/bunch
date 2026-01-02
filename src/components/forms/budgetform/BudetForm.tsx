import { useEffect, useState } from "react";
import "./budgetform.css";
import IBudget from "../../../constants/interfaces/budget.ts";
import IUser from "../../../constants/interfaces/user.ts";
import Button from "../../button/button.tsx";

const BudgetForm = ({currentUser, onConfirm, onCancel}:{currentUser:IUser | undefined, onConfirm: () => any, onCancel:() => any }) => {

    const [budgetForm, setBudgetForm] = useState<IBudget>({
        id: 0,
        name: "",
        user_id: currentUser?.id ?? 0,
        income_stream: [],
        bills: [],
    });

    useEffect(() => {
        if(currentUser){
            setBudgetForm({
                id: 0,
                name: "",
                user_id: currentUser.id,
                income_stream: [],
                bills: [],
            });
        }
        
    }, [currentUser]);

    const submitBudgetForm = () => {
    };

    const cancelBudgetForm = () => {
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