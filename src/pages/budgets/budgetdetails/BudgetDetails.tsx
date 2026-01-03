import { useParams } from "react-router-dom";
import "./budgetdetails.css";
import LocalStorageManager from "../../../services/LocalStorageManager.ts";
import IBudget from "../../../constants/interfaces/budget.ts";
import { DataBase_Strings } from "../../../constants/initial-states/Database.ts";
import IIncomeStream from "../../../constants/interfaces/IIncomeStream.ts";
import { useEffect, useState } from "react";
import IBills from "../../../constants/interfaces/IBills.ts";
import Button from "../../../components/button/button.tsx";
import CustomModal, { ICustomModalProps } from "../../../components/custommodal/CustomModal.tsx";
import IncomeStreamForm from "../../../components/forms/incomestreamform/IncomeStreamForm.tsx";
import BillsForm from "../../../components/forms/billsform/BillsForm.tsx";
const BudgetDetails = () => {
    const params = useParams();
    const budgetRepo = new LocalStorageManager<IBudget>(DataBase_Strings.Budget_DB);
    const incomeStreamRepo = new LocalStorageManager<IIncomeStream>(DataBase_Strings.Income_Stream_DB);
    const billsRepo = new LocalStorageManager<IBills>(DataBase_Strings.Bills_DB);

    const [budgetDetails, setBudgetDetails] = useState<IBudget | undefined>(undefined);
    const [customModalContent, setCustomModalContent] = useState<ICustomModalProps>({body_content:undefined});

    const setForm = (content: string) => {
        setCustomModalContent({body_content:undefined});
        if(content === "IncomeStreamForm"){
            setCustomModalContent({body_content: <IncomeStreamForm budgetId={Number(params.budgetId)} />});
        }else if(content === "BillsForm"){
            setCustomModalContent({body_content: <BillsForm />});
        }
    };

    useEffect(() => {
        const updatedBudget = budgetRepo.values.find(b => b.id === Number(params.budgetId));
        const incomeStreams = incomeStreamRepo.values.filter(i => i.buget_id === Number(params.budgetId));
        const bills = billsRepo.values.filter(b => b.budget_id === Number(params.budgetId));
        if(updatedBudget){
            updatedBudget.income_stream = incomeStreams;
            updatedBudget.bills = bills;
        }
        setBudgetDetails(updatedBudget);
    }, [params.budgetId]);


    

    return <div className="budget-details-main-container">
            <CustomModal body_content={customModalContent.body_content} />
            <div className="budget-details-title-container">
                <h3>{budgetDetails ? `Budget: ${budgetDetails.name}` : "Budget Not Found"}</h3>
            </div>
            <div className="budget-details-income-stream-container">
                <div className="border-bottom">
                    <h3 className="text-padding">Income Streams</h3>
                    <div>
                        <Button title="Add Income Stream" clicked={() => setForm("IncomeStreamForm") } buttonLabel={"+ Add Income Stream"}/>
                    </div>
                </div>
                <div>
                    {budgetDetails?.income_stream.map((income, index) => (
                        <div key={`income-${index}`}>
                            <span>{income.pay}: </span>
                            <span>${income.income_stream}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="budget-details-bills-container">
                <div className="border-bottom">
                    <h3 className="text-padding">Bills</h3>
                    <Button title="Add Bill" clicked={() => setForm("BillsForm") } buttonLabel={"+ Add Bill"}/>
                </div>
                <div>
                    {budgetDetails?.bills.map((bill, index) => (
                        <div key={`bill-${index}`}>
                            <span>{bill.name}: </span>
                            <span>${bill.amount}</span>
                            <span>Re-Accuring: {bill.isReaccuring}</span>
                            <span>Due Date: {bill.reaccuring_date}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>;
};

export default BudgetDetails;