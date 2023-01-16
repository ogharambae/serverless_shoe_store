import axios from "axios";

export const postItem = async ( body ) => {
    try {
        console.log("body", body);
        const { data } = await axios({
            method: "post",
            url: `https://rmbka7laza.execute-api.us-east-1.amazonaws.com/test/api/admin/item`,
            data: body,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            }
        });
        return data;
    } catch (err) {
        throw new Error("Error adding item");
    }
};

export const deleteItem = async ( user_id, item_id ) => {
    try {
        const { data } = await axios({
            method: "delete",
            url: `https://rmbka7laza.execute-api.us-east-1.amazonaws.com/test/api/admin/item/${item_id}`,
            data: {
                "userId": user_id
            },
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            }
        });
        return data;
    } catch (err) {
        throw new Error("Error deleting item");
    }
}

export const updateItem = async (item_id, body) => {
    try {
        const { data } = await axios({
            method: "put",
            url: `https://rmbka7laza.execute-api.us-east-1.amazonaws.com/test/api/admin/item/${item_id}`,
            data: body,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            }
        });
        return data;
    } catch (err) {
        throw new Error("Error updating item");
    }
}
