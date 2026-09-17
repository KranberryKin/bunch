import IncomeStream from "./IncomeStream.ts";

interface IIncomeStream {
    id: number;
    budget_id: number;
    hourly_amount?: number;
    salary_amount?:number;
    income_stream: IncomeStream;
}
export default IIncomeStream;
