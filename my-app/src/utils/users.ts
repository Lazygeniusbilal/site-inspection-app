// api
const API_URL= "http://127.0.0.1:8000";

export const GetUsers= async () => {
    // try to fetch the data users 
    const response= await fetch(`${API_URL}/users/`, {method: "GET"});

    if (!response.ok) throw new Error("Error fetching users!");
    return await response.json();
}