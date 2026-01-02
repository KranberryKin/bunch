import React, { useEffect, useState } from "react";
import './budgets.css'
import { IBudget } from "../../constants/interfaces/budget.ts";
import Button from "../../components/button/button.tsx";
import IUser from "../../constants/interfaces/user.ts";
import LocalStorageManager from "../../services/LocalStorageManager.ts";
import { DataBase_Strings } from "../../constants/initial-states/Database.ts";
import { useNavigate } from "react-router-dom";
import CustomModal from "../../components/custommodal/CustomModal.tsx";

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
        navigate(`/bunchApp/budget/${budget.id}`);
    }

    

    return (
        <div className="budget-main-container">
            <CustomModal body_content={customModalContent.body_content}/>
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
                <div onClick={selectBudget(budget)} key={`${budget.name} ${index}`}>{budget.name}</div>
                ))}
            </div>
        </div>
    )
}

export default Budgets;