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
            label: "Active Sprints",
            buttonTitle: "See Completed Sprints",
            isCompleted: false,
        },
        {
            label: "Completed Sprints",
            buttonTitle: "See All Sprints",
            isCompleted: true,
        },
        {
            label: "All Sprints",
            buttonTitle: "See All Sprints",
            isCompleted: false,
        }
    ],
    createSprintButtonLabel: "+ Create Sprint"
};
export default SPRINTZ_INITIAL_STATE;