import React, { useState } from "react";
import './budget.css'
import { IBudget } from "../../constants/interfaces/budget.ts";
import Button from "../../components/button/button.tsx";

const Budget = () => {
    const [budgets, setBudgets] = useState<IBudget[]>([]);

    

    return (
        <div className="budget-main-container">
            <div className="title-container">
                <h4>
                    Your Budgets 
                </h4>
                <div>
                    <Button buttonLabel="Add" clicked={() => {}}/>
                </div>
            </div>
            <div className="budget-table">
                {budgets.map((budget, index) => (
                <div key={`${budget.name} ${index}`}>{budget.name}</div>
                ))}
            </div>
        </div>
    )
}

export default Budget;