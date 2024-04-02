<template>
  <div class="container py-5" style="padding: 5%">
    <h1>예약 수정</h1>
    <p class="mb-4">예약 수정은 신중하게 해주세요.</p>
    <p class="mb-4 text-danger" v-if="message">{{ message }}</p>
    <form @submit.prevent="reservationModify">
      <div class="mb-3">
        <label class="form-label" style="font-weight: bold;">예약 번호</label>
        <input type="text" class="form-control" :value="reservationDTO.rvno" readonly>
      </div>
      <div class="mb-3">
        <label class="form-label" style="font-weight: bold;">예약 날짜</label>
        <input type="date" class="form-control" v-model="reservationDTO.regDate">
      </div>
      <div class="mb-3">
        <label class="form-label" style="font-weight: bold;">예약자명</label>
        <input type="text" class="form-control" v-model="reservationDTO.regName" placeholder="입금자명을 입력하세요">
      </div>
      <div class="mb-3">
        <label class="form-label" style="font-weight: bold;">지역</label>
        <input type="text" class="form-control"
                   v-model="reservationDTO.region" placeholder="식별할 수 있을 정도의 지역을 입력해주세요. 예시) 무주">
      </div>
      <div class="mb-3">
        <label class="form-label" style="font-weight: bold;">전화번호</label>
        <div style="display: flex;">
          <input type="text" id="tel1" v-model="reservationDTO.tel1" class="form-control"
                 @input="enforceMaxLength('tel1', 3)"
                 required style="flex: 1;">-
          <input type="text" id="tel2" v-model="reservationDTO.tel2" class="form-control"
                 @input="enforceMaxLength('tel2', 4)"
                 required style="flex: 1;">-
          <input type="text" id="tel3" v-model="reservationDTO.tel3" class="form-control"
                 @input="enforceMaxLength('tel3', 4)"
                 required style="flex: 1;">
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label" style="font-weight: bold;">예약인원</label>
        <select class="form-select" aria-label="Default select example" id="member" v-model="reservationDTO.member">
          <option v-for="(option, index) in options" :value="option.value" :key="index">{{ option.text }}</option>
        </select>
      </div>
      <div class="button-container" style="margin-top:25px; text-align: center;">
        <button type="submit" class="btn btn-warning">수정하기</button>
        <button type="button" class="btn btn-outline-primary" @click="goBack">돌아가기</button>
      </div>
    </form>
  </div>
</template>

<script>
import backSideApiService from "@/services/BackSideApiService";

export default {
  name: "ReservationModifyComponent",
  data() {
    return {
      message: '',
      search: this.$route.query.search,
      reservationDTO: {rvno: this.$route.query.rvno},
      extras: 0,
      options: []
    }
  },
  methods: {
    goBack() {
      this.$router.push(`/admin/reservationInfo?search=${this.search}&rvno=${this.reservationDTO.rvno}`)
    },
    enforceMaxLength(field, maxLength) {
      if (field === 'tel1') {
        this.reservationDTO.tel1 = this.reservationDTO.tel1.replace(/[^\d]/g, '').slice(0, maxLength);
      } else if (field === 'tel2') {
        this.reservationDTO.tel2 = this.reservationDTO.tel2.replace(/[^\d]/g, '').slice(0, maxLength);
      } else if (field === 'tel3') {
        this.reservationDTO.tel3 = this.reservationDTO.tel3.replace(/[^\d]/g, '').slice(0, maxLength);
      }
    },
    async populateDropdown(extras) {
      this.options = []; // 기존 옵션 초기화

      // 새로운 옵션 생성
      for (let i = 1; i <= extras; i++) {
        this.options.push({value: i, text: i + '명'});
      }

      // 기존 예약된 인원이 새로운 옵션에 있는지 확인하여 선택
      if (this.options.find(option => option.value === this.reservationDTO.member)) {
        this.reservationDTO.member = this.options.find(option => option.value === this.reservationDTO.member).value;
      } else {
        this.reservationDTO.member = 0; // 기존 예약된 인원이 새로운 옵션에 없으면 0으로 선택 (기본값)
      }
    },
    async loadModifyReservationInfo() {
      try {
        const response = await backSideApiService.loadReservationInfoForModify(this.reservationDTO.rvno);
        this.reservationDTO = response.data.reservationDTO;
        this.extras = response.data.extras;
        await this.populateDropdown(this.extras);
      } catch (error) {
        alert("데이터를 불러오는데 오류가 발생하였습니다.");
      }
    },
    async reservationModify() {
      const modifyData = {
        rvno: this.reservationDTO.rvno,
        regDate: this.reservationDTO.regDate,
        regName: this.reservationDTO.regName,
        depositName: this.reservationDTO.depositName,
        region: this.reservationDTO.region,
        member: this.reservationDTO.member,
        tel1: this.reservationDTO.tel1,
        tel2: this.reservationDTO.tel2,
        tel3: this.reservationDTO.tel3
      }
      try {
        const response = await backSideApiService.modifyReservation(modifyData);
        this.message = response.data;
      } catch (error) {
        alert("수정 중 오류가 발생하였습니다.");
      }
    },
    async loadExtraMembers() {
      try {
        const response = await backSideApiService.changeDate(this.reservationDTO.regDate);
        this.extras = response.data.extras;
        await this.populateDropdown(this.extras);
      } catch (error) {
        alert("오류 발생");
      }
    }
  },
  watch: {
    'reservationDTO.regDate': function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.loadExtraMembers();
      }
    }
  },
  mounted() {
    this.loadModifyReservationInfo();
  }
}
</script>


<style scoped>
input {
  padding: 5px;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.button-container button {
  margin: 0 5px;
}
</style>