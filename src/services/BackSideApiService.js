import axios from "axios";

const API_URL = 'http://localhost';

function getHeaders() {
    const headers = {
        'Content-Type': 'application/json',
    };
    let token;
    const localToken = localStorage.getItem('token') || null;
    const sessionToken = sessionStorage.getItem('token') || null;
    if (localToken || sessionToken) {
        token = localToken || sessionToken;
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}
export default {
    authCheckLocal(tokenData) {
        return axios.post(API_URL+"/authlocal", tokenData,  { headers: getHeaders() });
    },
    authCheckSession(tokenData) {
        return axios.post(API_URL+"/authsession", tokenData,  { headers: getHeaders() });
    },
    // Member 회원
    login(loginData) {
        return axios.post(API_URL + "/member/login", loginData,  { headers: getHeaders() });
    },
    logout(){
        return axios.post(API_URL + "/member/logout",  { headers: getHeaders() });
    },

    //관리자
    loadReservationListonList(regDate) {
        return axios.get(API_URL + "/admin/reservationList", { params: { regDate : regDate }, headers: getHeaders() });
    },
    registerReservation(reservationData){
        return axios.post(API_URL + "/admin/register", reservationData, { headers : getHeaders()})
    },
    confirmStateChange(state){
        return axios.post(API_URL + '/admin/reservationState', state, { headers : getHeaders() })
    },
    loadReservationSearchListonList(reservationDTO) {
        return axios.get(API_URL + "/admin/searchList",
            { params: { page : reservationDTO.page, rvno : reservationDTO.rvno, regName : reservationDTO.regName, depositName : reservationDTO.depositName,
                    regDate : reservationDTO.regDate, tel : reservationDTO.tel }, headers: getHeaders() });
    },
    loadReservationInfo(rvno){
        return axios.get(API_URL + "/admin/reservationInfo", { params: { rvno : rvno}, headers: getHeaders() });
    },
    changeMoney(changeData) {
        return axios.post(API_URL + '/admin/moneyChange', changeData, { headers: getHeaders() })
    },
    reservationDelete(rvno) {
        return axios.post(API_URL + '/admin/reservationDelete', rvno, { headers: getHeaders() })
    },
    loadReservationInfoForModify(rvno) {
        return axios.get(API_URL + "/admin/reservationModify", { params: { rvno : rvno}, headers: getHeaders() });
    },
    changeDate(regDate){
        return axios.get(API_URL + "/admin/changeDate", { params: { regDate : regDate}, headers: getHeaders() });
    },
    modifyReservation(modifyData){
        return axios.post(API_URL + '/admin/reservationModify', modifyData, { headers: getHeaders() })
    },
    getReservationDateState(regDate) {
        return axios.get(API_URL + "/admin/getDateState", { params: { regDate : regDate}, headers: getHeaders() });
    },
    modifyReservationDateState(modifyData) {
        return axios.post(API_URL + '/admin/modifyDateState', modifyData, { headers: getHeaders() })
    },
    loadReservationDateSort(regDate){
        return axios.get(API_URL + "/admin/modifySort", { params: { regDate : regDate}, headers: getHeaders() });
    },
    modifyReservationDateSort(modifyData){ // 한개
        return axios.post(API_URL + '/admin/modifySort2', modifyData, { headers: getHeaders() })
    },
    modifyReservationDatesSort(modifyData){ // 여러개
        return axios.post(API_URL + '/admin/modifySort', modifyData, { headers: getHeaders() })
    }

}
