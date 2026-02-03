interface ISprintDetailsInitialState {
    Page_Title: string;
    Child_Pages:string[];
}

const SPRINT_DETAILS_INITIAL_STATE: ISprintDetailsInitialState = {
    Page_Title: "Sprint Details",
    Child_Pages:[
        "Backlog",
        "Current Sprint",
        "Statistics",
    ],
};
export default SPRINT_DETAILS_INITIAL_STATE;