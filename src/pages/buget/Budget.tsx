import React, { useState } from "react";
import './budget.css'
import { IBudget } from "../../constants/interfaces/budget";

const Budget = () => {
    const [budgets, setBudgets] = useState<IBudget[]>([]);

    return (
        <div className="budget-main-container">
            <div>Your Budgets <button>Add</button> </div>
            <div>{budgets.map((budget, index) => (
                <div key={`${budget.name} ${index}`}>{budget.name}</div>
            ))}</div>
        </div>
    )
}

export default Budget;