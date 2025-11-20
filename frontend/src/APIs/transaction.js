import api from "./axios";

export const addTransaction = async (type, name, quantity, price, date) =>{
    const response = await api.post("/transaction/add", {type,name,quantity,price,date});
    return response.data
}