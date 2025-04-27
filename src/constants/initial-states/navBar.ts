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
            page: "/bunchApp/budget",
        }
    ]
}