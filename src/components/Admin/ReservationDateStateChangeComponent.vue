<template>
  <div class="container" style="margin: 0 auto; padding: 5%;">
    <h1>날짜별예약상태</h1>
    <p>날짜별로 예약상태를 변경 할 수 있습니다.</p>

    <form @submit.prevent="changeState" style="margin-top: 25px">
      <div class="mb-3">
        <label for="reservationDate" class="form-label" style="font-weight: bold;">예약날짜</label>
        <input type="date" class="form-control" id="reservationDate" v-model="reservationDateDTO.regDate" required>
      </div>

      <div class="mb-3">
        <label class="form-label" style="font-weight: bold;">예약 상태 변경</label><br/>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" id="available" v-model="reservationDateDTO.available" value="true"/>
          <label class="form-check-label" for="available">예약 가능</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" id="unavailable" v-model="reservationDateDTO.available" value="false"/>
          <label class="form-check-label" for="unavailable">예약 불가</label>
        </div>
      </div>

      <div class="mb-3">
        <label for="message" class="form-label" style="font-weight: bold;">예약 불가 사유</label>
        <input type="text" class="form-control" id="message" v-model="reservationDateDTO.message" placeholder="예약이 불가능한 사유를 입력하세요. ex) 추석연휴, 설날연휴">
      </div>

      <button class="btn btn-primary w-100 mt-4" type="submit" id="applyButton">적용하기</button>
    </form>
  </div>
</template>

<script>
import backSideApiService from "@/services/BackSideApiService";
import moment from "moment";
export default {
  name : "ReservationDateStateChangeComponent",
  data() {
    return {
      reservationDateDTO : { rdate : '', regDate : '', available : false, message : ''}
    }
  },
  methods : {
    formatDate(dateString) {
      return moment(dateString).format('YYYY-MM-DD');
    },
    async loadReservationDateState(){
      if(!this.reservationDateDTO.regDate) return null;

      try {
        const response = await backSideApiService.getReservationDateState(this.reservationDateDTO.regDate);
        this.reservationDateDTO = response.data.reservationDateDTO;
      }catch (error){
        alert("데이터를 불러오는데 실패하였습니다.");
      }
    },
    async changeState(){

      const modifyData = {
        rdate : this.reservationDateDTO.rdate,
        regDate : this.reservationDateDTO.regDate,
        available : this.reservationDateDTO.available,
        message : this.reservationDateDTO.message
      }
      try {
        const response = await backSideApiService.modifyReservationDateState(modifyData);
        alert(response.data.success)
      }catch (error){
        alert(error.response.data.error);
      }
    }
  },
  watch: {
    'reservationDateDTO.regDate': function (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.loadReservationDateState();
      }
    },
  },
  mounted() {
    this.reservationDateDTO.regDate = this.formatDate(new Date());
  }
}

</script>



<style scoped>

</style>