import { useState } from "react";
import "./budgetform.css";
import IBudget from "../../../constants/interfaces/budget.ts";

const BudgetForm = () => {
    const [budgetForm, setBudgetForm] = useState<IBudget>({
        id: "",
        name: "",
        user_id: 0,
        income_stream: [],
        bills: [],
    });
    return (
        <div className="budget-form-container">
            <h3>Create New Budget</h3>
            <div className="budget-form">
                <label htmlFor="budget-name">Budget Name:</label>
                <input type="text" id="budget-name" name="budget-name" required />
            </div>
        </div>
        );
};

export default BudgetForm;