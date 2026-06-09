import IToggleListDisplayState from "../interfaces/ToggleListDisplayState";

interface ISPRINTZ_INITIAL_STATE {
    sprintzPageTitle: string;
    toggleListDisplayState: IToggleListDisplayState[];
    createSprintButtonLabel: string;
}

const SPRINTZ_INITIAL_STATE: ISPRINTZ_INITIAL_STATE = {
    sprintzPageTitle: "Sprintz Page",
    toggleListDisplayState: [
        {
            label: "Active Sprintz",
            buttonTitle: "See Completed Sprints",
            isCompleted: false,
        },
        {
            label: "Completed Sprintz",
            buttonTitle: "See All Sprints",
            isCompleted: true,
        },
        {
            label: "All Sprintz",
            buttonTitle: "See All Sprints",
            isCompleted: false,
        }
    ],
    createSprintButtonLabel: "+ Create Sprintz"
};
export default SPRINTZ_INITIAL_STATE;