<template>
  <div class="container" style="max-width: 800px; margin: 50px auto 0 auto">
    <h1>예약상세보기</h1>
    <p style="margin-top: 15px; color: red;" v-if="message">{{ message }}</p>
    <table class="table border-dark">
      <tbody>
      <tr>
        <th style="width: 30%">예약번호</th>
        <td style="width: 70%">{{ reservationDTO.rvno }}</td>
      </tr>
      <tr>
        <th>예약날짜</th>
        <td>{{ reservationDTO.regDate }}</td>
      </tr>
      <tr>
        <th>예약자명</th>
        <td>{{ reservationDTO.regName }}</td>
      </tr>
      <tr>
        <th>입금자명</th>
        <td>{{ reservationDTO.depositName }}</td>
      </tr>
      <tr>
        <th>전화번호</th>
        <td><a :href="'tel:'+reservationDTO.tel">{{ reservationDTO.tel }}</a></td>
      </tr>
      <tr>
        <th>예약인원</th>
        <td>{{ reservationDTO.member }}명</td>
      </tr>
      <tr>
        <th>입금금액</th>
        <td>
          <form @submit.prevent="moneyChange">
          <span class="d-flex">
            <input class="form-control mr-2" type="number" v-model="reservationDTO.money" name="money" style="width: 65%">&nbsp;원&nbsp;
            <button type="submit" class="btn btn-dark" id="moneyChange" style="width: 25%">적용</button>
          </span>
          </form>
        </td>
      </tr>
      <tr>
        <th>지역</th>
        <td>{{ reservationDTO.region }}</td>
      </tr>
      <tr>
        <th>예약확정 및 문자발송</th>
        <td>
          <p v-if="reservationDTO.state">
            예약확정
          </p>
          <button v-if="!reservationDTO.state" class="btn btn-primary" @click="confirmStateChange(true, reservationDTO.rvno)">
            확정하기
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <div class="button-container" style="margin-top:25px; text-align: center;">
      <button type="button" class="btn btn-warning" @click="goModify">예약수정</button>
      <button type="button" class="btn btn-danger" @click="deleteReservation">예약삭제</button>
      <button @click="goBack"
              class="btn btn-outline-primary" id="goBackBtn">
        돌아가기
      </button>
    </div>
  </div>
</template>

<script>
import backSideApiService from "@/services/BackSideApiService";
export default {
  name : "ReservationInfoComponent",
  data() {
    return {
      reservationDTO : {
        rvno : this.$route.query.rvno
      },
      message : '',
      search : this.$route.query.search
    }
  },
  methods : {
    async loadReservationInfo() {
      try {
        const response = await backSideApiService.loadReservationInfo(this.reservationDTO.rvno);
        this.reservationDTO = response.data.reservationDTO;
      }catch (error){
        alert("데이터를 불러오는 중 오류가 발생하였습니다.")
      }
    },
    goModify() {
      this.$router.push(`/admin/reservationModify?search=${this.search}&rvno=${this.reservationDTO.rvno}`);
    },
    goBack() {
      if(this.search === "true"){
        this.$router.push('/admin/searchlist');
      } else {
        this.$router.push('/admin/reservationlist');
      }
    },
    async moneyChange() {
      const changeData = {
        rvno: this.reservationDTO.rvno,
        money: this.reservationDTO.money
      }

      try {
        const response = await backSideApiService.changeMoney(changeData);
        this.message = response.data.success;
      } catch (error) {
        this.message = error.response.data.error;
      }
    },
    async confirmStateChange(isConfirmed, reservationId) {
      let result = window.confirm("예약상태 확정 및 문자를 보내시겠습니까?");
      if (result) {
        const state = {state: isConfirmed, rvno: reservationId};

        try {
          const response = await backSideApiService.confirmStateChange(state);
          alert(response.data.success);
          await this.loadReservationInfo();
        } catch (error) {
          alert(error.response.data.error);
        }
      }
    },
    async deleteReservation() {
      const rvno = { rvno : this.reservationDTO.rvno };
      try {
        const response = await backSideApiService.reservationDelete(rvno);
        alert(response.data.success);
        if(this.search === "true"){
          this.$router.push('/admin/searchlist');
        } else {
          this.$router.push('/admin/reservationlist');
        }
      }catch (error){
        alert(error.response.data.error);
      }
    }
  },
  mounted() {
    this.loadReservationInfo();
  }
}

</script>


<style scoped>
td {
  width: 80%;
}

th {
  width: 20%;
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