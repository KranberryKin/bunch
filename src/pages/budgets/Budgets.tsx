import React, { useEffect, useState } from "react";
import './budgets.css'
import Button from "../../components/button/button.tsx";
import IUser from "../../constants/interfaces/user.ts";
import LocalStorageManager from "../../services/LocalStorageManager.ts";
import { DataBase_Strings } from "../../constants/initial-states/Database.ts";
import { useNavigate } from "react-router-dom";
import CustomModal from "../../components/custommodal/CustomModal.tsx";
import BudgetForm from "../../components/forms/budgetform/BudetForm.tsx";
import IBudget from "../../constants/interfaces/budget.ts";
import { ROUTES } from "../../constants/initial-states/routes.ts";

export interface IBudgetsProps {
    currentUser: IUser | undefined;
}

const Budgets = ({currentUser}:IBudgetsProps) => {
    const navigate = useNavigate();
    const budgetRepository = new LocalStorageManager<IBudget>(DataBase_Strings.Budget_DB);
    const [budgets, setBudgets] = useState<IBudget[]>([]);
    const [customModalContent, setCustomModalContent] = useState<{
        body_content?: React.ReactNode;
    }>({
        body_content: undefined,
    });

    useEffect(() => {
        if(currentUser && budgetRepository.values.length > 0){
            const userBudgets = budgetRepository.values.filter(budget => budget.user_id === currentUser.id);
            setBudgets(userBudgets);
        }
    }, [currentUser]);

    const selectBudget = (budget: IBudget) => () => {
        navigate(`${ROUTES.navigate.budgetDetails.replace(":budgetId", budget.id.toString())}`);
    }

    const updateBudgets = () => {
        budgetRepository.get();
        setBudgets(budgetRepository.values.filter(budget => budget.user_id === currentUser?.id));
        setCustomModalContent({body_content:undefined})
    }

    const addBudget = () => {
        setCustomModalContent({body_content: <BudgetForm currentUser={currentUser} onConfirm={()=> updateBudgets()} onCancel={() => setCustomModalContent({body_content:undefined})}/>});
    }

    const deleteBudget = (budget:IBudget) => {
        if(!window.confirm(`Are you sure you want to delete the budget: ${budget.name}? This action cannot be undone.`)){
            return;
        }else{
            budgetRepository.deleteData(budget)
            updateBudgets();
        }
    };
    

    return (
        <div className="budget-main-container">
            <CustomModal body_content={customModalContent.body_content}/>
            <div className="title-container">
                <h4>
                    Your Budgets 
                </h4>
                <div>
                    <Button buttonLabel="Add" clicked={() => addBudget()}/>
                </div>
            </div>
            <div className="budget-table">
                {budgets.map((budget, index) => (
                <div className="budget-option" >
                    <div className="budget-option-label" onClick={selectBudget(budget)} key={`${budget.name} ${index}`}>
                        {budget.name}
                    </div>
                    <div className="budget-option-label" onClick={() => deleteBudget(budget)}>
                        🗑️
                    </div>
                    
                </div>
                ))}
            </div>
        </div>
    )
}

export default Budgets;