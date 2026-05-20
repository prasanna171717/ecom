export interface Payment{
    id?: string;
    orderId:string;
    amount:number;
    method:'card'|'upi'|'netbanking';
    status:'pending' |'success'|'failed';
    cardLast4?: string;
    createdAt:string;

}