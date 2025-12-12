import axiosInstance from "./axios-instance"

export const getClientUser = async () => {
    try {
        const { data } = await axiosInstance.get('/api/me')
        return data
    } catch (error) {
        return null
    }
}
