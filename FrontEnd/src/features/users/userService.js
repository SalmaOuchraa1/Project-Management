import api from "../../services/api";

    const getUsers = async () => {const res = await api.get("/users");
    return res.data;
    };

    const createUser = async (data) => {const res = await api.post("/users", data);
    return res.data;
    };

    const updateUser = async (id, data) => {const res = await api.put(`/users/${id}`, data);
    return res.data;
    };

    const deleteUser = async (id) => {const res = await api.delete(`/users/${id}`);
    return res.data;
    };

const userService = {getUsers,createUser,updateUser,deleteUser,};
export default userService;