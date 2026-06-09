import IBills from "./IBills.ts";
import IIncomeStream from "./IIncomeStream.ts";

interface IBudget {
    id: number;
    name: string;
    user_id: number;
    income_stream: IIncomeStream[];
    bills: IBills[];
}
export default IBudget;