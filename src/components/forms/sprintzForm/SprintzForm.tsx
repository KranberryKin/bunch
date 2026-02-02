import { useState } from "react";
import LocalStorageManager from "../../../services/LocalStorageManager.ts";
import ISprintz from "../../../constants/interfaces/Sprintz.ts";
import { DataBase_Strings } from "../../../constants/initial-states/Database.ts";
import Button from "../../button/button.tsx";
import "./sprintsform.css"
import CustomDatePicker from "../../customdatepicker/CustomDatePicker.tsx";
import IUser from "../../../constants/interfaces/user.ts";

interface ISprintzForm {
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    isCompleted: boolean;
}

interface ISprintzFormProps {
    currentUser: IUser | undefined;
    callbackFunction?: () => void;
}

const SprintzForm = (props: ISprintzFormProps) => {
    const sprintzRepo = new LocalStorageManager<ISprintz>(DataBase_Strings.Sprintz_DB);
    const [sprintzForm, setSprintzForm] = useState<ISprintzForm>({
        title: "",
        description: "",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        isCompleted: false,
    });

    const validateForm = (): boolean => {
        // Basic validation logic
        if(
            !sprintzForm.title ||
            sprintzForm.title.trim() === "" ||
            sprintzForm.title.length < 2 ||
            !sprintzForm.startDate ||
            !sprintzForm.endDate
        ){
            return false;
        }
        if(new Date(sprintzForm.startDate) >= new Date(sprintzForm.endDate)){
            return false;
        }
        return true;
    }

    const handleFormSubmit = () => {
        if(validateForm() && props.currentUser){
            const newSprint: ISprintz = {
                id: sprintzRepo.generateId(),
                title: sprintzForm.title,
                startDate: sprintzForm.startDate,
                endDate: sprintzForm.endDate,
                isCompleted: sprintzForm.isCompleted,
                userId: props.currentUser.id,
                description: sprintzForm.description || "",
            };
            sprintzRepo.add(newSprint);
            clearForm();
            if(props.callbackFunction){
                props.callbackFunction();
            };
        }
        console.log("handleFormSubmit clicked!");
    }

    const clearForm = () => {
        setSprintzForm({
            title: "",
            description: "",
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            isCompleted: false,
        });
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSprintzForm({ ...sprintzForm, [name]: value });
        console.log("sprintzForm: ", sprintzForm);
    }
    return <div className="sprintz-form-main-container">
            <div className="sprintz-form-header">
                Sprintz Form
            </div>
            <div className="sprintz-form-inputs-container">
                {Object.keys(sprintzForm).map((key) => (
                    key !== "isCompleted" ?
                        key.includes("Date") ? 
                        <div>
                            <div key={key} className="sprintz-form-input-item">
                                <label>{key.charAt(0).toUpperCase() + key.slice(1)} :</label>
                                <div>
                                    <CustomDatePicker callbackFunction={(selectedDate: string) => setSprintzForm({ ...sprintzForm, [key]: selectedDate })} />
                                </div>
                            </div>
                        </div> :
                        <div key={key} className="sprintz-form-input-item">
                            <label>{key.charAt(0).toUpperCase() + key.slice(1)} :</label>
                            <input type="text" name={key} value={sprintzForm[key as keyof ISprintzForm] as string} onChange={handleInputChange} />
                        </div> 
                    : null
                ))}
            </div>
            <div className="sprintz-form-button-container">
                <div>
                    <Button buttonLabel="Submit" clicked={() => handleFormSubmit()} />
                </div>
                <div>
                    <Button buttonLabel="Clear" clicked={() => clearForm()} />
                </div>
            </div>
        </div>;
}
export default SprintzForm;