interface IBills {
    id: number;
    name: string;
    budget_id: number;
    amount: number;
    isReaccuring: boolean;
    date_paid: string;
    reaccuring_date: string;
}
export default IBills;
