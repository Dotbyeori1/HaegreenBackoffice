<template>
  <div class="container" style="margin:0 auto; padding: 5%">
    <h1>예약현황(날짜별)</h1>
    <p>예약번호를 누르시면 해당번호의 예약정보 확인·수정·삭제가 가능합니다.</p>
    <p>날짜별로 조회가 가능합니다.</p>
    <div>
      <div class="form-group row" style="margin-top: 25px;">
        <span class="col-8 col-sm-9 col-md-5 col-lg-3">
          <input type="date" class="form-control" v-model="regDate">
        </span>
        <span class="col-4 col-sm-3 col-md-3 col-lg-2">
          <button v-if="available === false || extras <= 0 " type="button" class="btn btn-danger">
            예약불가
          </button>
          <button v-if="available === true && extras > 0" type="button" class="btn btn-outline-primary" @click="openModal">
            예약등록
          </button>
        </span>
      </div>
    </div>

    <table class="table" style="margin-top: 25px;">
      <thead>
      <tr>
        <th>예약번호</th>
        <th>예약자명</th>
        <th>입금자명</th>
        <th>전화번호</th>
        <th>인원</th>
        <th>입금금액</th>
        <th>확정결정</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="reservation in reservationDTOS" :key="reservation.rvno">
        <td>
          <router-link :to="{ path: '/admin/reservationInfo', query: { rvno: reservation.rvno, search : false }}">
            {{ reservation.rvno }}
          </router-link>
        </td>
        <td>{{ reservation.regName }}</td>
        <td>{{ reservation.depositName }}</td>
        <td><a :href="'tel:' + reservation.tel">{{ reservation.tel }}</a></td>
        <td>{{ reservation.member }}</td>
        <td>{{ reservation.formatMoney }}</td>
        <td>
          <p v-if=reservation.state>
            확정완료
          </p>
          <button v-if="!reservation.state"
                  class="btn btn-primary"
                  @click="confirmStateChange(true, reservation.rvno );">
            확정하기
          </button>
        </td>
      </tr>
      </tbody>
    </table>
    <div style="text-align: right;">
      <p>남은 인원 : {{ extras }}명 </p>
      <p>확정된 인원 : {{ confirmMember }}명 </p>
    </div>
  </div>

  <ReservationRegisterComponent v-if="showModal" :regDate="regDate" :extras="extras" :showModal="showModal" @close="handleModalClose"/>

</template>

<script>
import moment from "moment/moment";
import backSideApiService from "@/services/BackSideApiService";
import ReservationRegisterComponent from "@/components/Admin/ReservationRegisterComponent";

export default {
  name: "ReservationListDateComponent",
  components : {ReservationRegisterComponent},
  data() {
    return {
      reservationDTOS: [
        {
          rvno: '',
          tel: '',
          member: '',
          regName: '',
          depositName: '',
          formatMoney: ''
        }
      ],
      regDate: '',
      available: '',
      extras: 0,
      confirmMember: '',

      showModal : false
    }
  },
  methods: {
    openModal(){
      this.showModal = true;
    },
    handleModalClose() {
      this.showModal = false;
      this.searchDate();
    },
    formatDate(dateString) {
      return moment(dateString).format('YYYY-MM-DD');
    },
    async searchDate() {
      if(!this.regDate) return null;

      try {
        const response = await backSideApiService.loadReservationListonList(this.regDate)
        this.available = response.data.available;
        this.extras = response.data.extras;
        this.fishingMoney = response.data.fishingMoney;
        this.reservationDTOS = response.data.reservationDTOS;
        this.confirmMember = response.data.confirmMember;
      } catch (error) {
        alert("데이터를 가져오는 중 문제가 발생했습니다.");
      }
    },
    async confirmStateChange(isConfirmed, reservationId) {
      let result = window.confirm("예약상태 확정 및 문자를 보내시겠습니까?");
      if (result) {
        const state = {state: isConfirmed, rvno: reservationId};

        try {
          const response = await backSideApiService.confirmStateChange(state);
          alert(response.data.success);
          await this.searchDate();
        } catch (error) {
          alert(error.response.data.error);
        }
      }
    }
  },
  watch: {
    regDate(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.searchDate();
      }
    },
  },
  mounted() {
    this.regDate = this.formatDate(new Date());
  }
}
</script>

<style scoped>

</style>