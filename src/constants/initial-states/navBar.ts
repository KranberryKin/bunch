import { Route } from "react-router-dom";
import { ROUTES } from "./routes.ts";

interface IPageNames {
    name:string;
    page:string;
}

interface INAVBAR_CONSTANTS {
    page_names:IPageNames[];
}

export const NAVBAR_CONSTANTS:INAVBAR_CONSTANTS = {
    page_names: [
        {
            name: "Budget",
            page: ROUTES.URL.BUDGETS,
        },
        {
            name: "Sprints",
            page: ROUTES.URL.SPRINTS,
        }
    ]
}