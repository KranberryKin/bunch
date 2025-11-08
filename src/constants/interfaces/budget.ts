export enum IncomeStream {
    Hourly,
    Salary
}

export interface IIncomeStream {
    id: number;
    buget_id: number;
    pay: number;
    income_stream: IncomeStream;
}

export interface IBills {
    id: number;
    name: string;
    budget_id: number;
    amount: number;
    isReaccuring: boolean;
    date_paid: string;
    reaccuring_date: string;
}


export interface IBudget {
    id: number;
    name: string;
    user_id: number;
    income_stream: IIncomeStream[];
    bills: IBills[];
}