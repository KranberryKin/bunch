import { useState } from "react";
import "./customdropdown.css";

interface ICustomDropdownProps {
    listOptions: string[];
    callback: (selectedOption: string) => void;
}

const CustomDropdown = (props: ICustomDropdownProps) => {
    const [selectedOption, setSelectedOption] = useState<string>("Select An Option");
    const [isSelecting, setIsSelecting] = useState<boolean>(false);
    const [filterString, setFilterString] = useState<string>("");

    const handleSelection = (option: string) => {
        setSelectedOption(option);
        setIsSelecting(false);
        props.callback(option);
    }

    return (
        <div className="custom-dropdown-main-container">
            <div>
                <div className="custom-dropdown-selectable-option blue" onClick={() => setIsSelecting(isSelecting ? false : true)}>{selectedOption}</div>
            </div>
            <div className={"custom-dropdown-dropdown-container" + (isSelecting === false ? " hidden" : "")}>
                <div>
                    <input type="text" value={filterString} onChange={(e) => setFilterString(e.target.value)} />
                </div>
                <div className="custom-dropdown-list-container" >
                    {props.listOptions.filter(option => option.toLowerCase().includes(filterString.toLowerCase())).map((option, index) => (
                <div key={index} onClick={() => handleSelection(option)}>
                    <p className="custom-dropdown-selectable-option">{option}</p>
                </div>
            ))}
                </div>
            </div>
        </div>
    );
}
export default CustomDropdown;