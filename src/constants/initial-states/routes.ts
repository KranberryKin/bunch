interface IRoutePaths {
    URL:{    
        ETC: string;
        HOMEPAGE: string;
        PROFILE: string;
        LOGIN: string;
        BUNCH_APP: string;
        BUDGETS: string;
        BUDGET_DETAILS: string;
        SPRINTS: string;
        SPRINT_DETAILS: string;
    },
    navigate:{
        budgetDetails: string;
        sprintDetails: string;

    }
}

export const ROUTES:IRoutePaths = {
    URL: {
        ETC: "/*",
        HOMEPAGE: "/bunch",
        PROFILE: "/my_profile",
        LOGIN: "/login",
        BUNCH_APP: "/bunchApp",
        BUDGETS: "budget",
        BUDGET_DETAILS: "budget/:budgetId",
        SPRINTS: "sprints",
        SPRINT_DETAILS: "sprints/:sprintId"
    },
    navigate: {
        budgetDetails: ":budgetId",
        sprintDetails: ":sprintId"
    }
}
