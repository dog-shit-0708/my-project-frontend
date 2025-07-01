import axios from 'axios';

const API_URL = 'http://localhost:8080/api/feedings';

export default {
    // 获取所有喂养记录
    getAllFeedings() {
        return axios.get(API_URL);
    },

    // 根据ID获取喂养记录
    getFeedingById(id) {
        return axios.get(`${API_URL}/${id}`);
    },

    // 根据猫咪ID获取喂养记录
    getFeedingsByCatId(catId) {
        return axios.get(`${API_URL}/cat/${catId}`);
    },

    // 根据喂食人获取喂养记录
    getFeedingsByFeederName(feederName) {
        return axios.get(`${API_URL}/feeder/${feederName}`);
    },

    // 根据时间范围获取喂养记录
    getFeedingsByTimeRange(startTime, endTime) {
        return axios.get(`${API_URL}/time-range`, {
            params: {
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString()
            }
        });
    },

    // 添加喂养记录
    addFeeding(feeding) {
        return axios.post(API_URL, feeding);
    },

    // 更新喂养记录
    updateFeeding(id, feeding) {
        return axios.put(`${API_URL}/${id}`, feeding);
    },

    // 删除喂养记录
    deleteFeeding(id) {
        return axios.delete(`${API_URL}/${id}`);
    }



};

// 在feeding.js中添加
axios.interceptors.response.use(response => {
    console.log('API响应:', response.data);
    return response;
}, error => {
    console.error('API错误:', error);
    return Promise.reject(error);
});