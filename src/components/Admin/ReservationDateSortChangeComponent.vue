<template>
  <div class="container" style="margin: 0 auto; padding: 5%;">
    <h1>날짜별예약정보</h1>
    <p>날짜별로 낚시의 종류와 인원 금액을 설정할 수 있습니다.</p>

    <form @submit.prevent ="dateChange" style="margin-top: 50px;">
      <h3>특정 날짜 변경</h3>
      <p>해당 날짜의 상태를 변경 할 수 있습니다.</p>
      <table class="table table-bordered border-dark">
        <thead>
        <tr>
          <th colspan="2" class="table-dark">
            특정 날짜 변경
          </th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th style="width: 35%;">날짜</th>
          <td style="width: 65%;">
            <input type="date" class="form-control" v-model="reservationDateDTO.regDate" required>
          </td>
        </tr>
        <tr>
          <th style="width: 35%;">낚시 종류 설정</th>
          <td style="width: 65%;">
            <input class="form-control" type="text" v-model="reservationDateDTO.fishingSort">
          </td>
        </tr>
        <tr>
          <th style="width: 35%;">낚시 인원 설정</th>
          <td style="width: 65%;">
                        <span class="d-flex">
                                <input class="form-control" type="number" v-model="reservationDateDTO.extrasMembers">&nbsp;명
                        </span>
          </td>
        </tr>
        <tr>
          <th style="width: 35%;">낚시 금액 설정</th>
          <td style="width: 65%;">
                        <span class="d-flex">
                                <input class="form-control" type="number" v-model="reservationDateDTO.fishingMoney">&nbsp;원
                        </span>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <button class="btn btn-dark w-100 mt-4" type="submit">적용하기</button>
          </td>
        </tr>
        </tbody>
      </table>
    </form>

    <form @submit.prevent="dateRangeChange" style="margin-top: 50px;">
      <h3>기간 내 변경</h3>
      <p>기간 내의 상태를 변경할 수 있습니다. <br/>
        <font color="#dc143c">오늘부터 4개월 이내 만 설정이 가능합니다.</font></p>
      <table class="table table-bordered border-dark">
        <thead>
        <tr>
          <th colspan="2" class="table-dark">기간 내 변경</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th style="width: 35%;">시작 날짜</th>
          <td style="width: 65%;">
            <input type="date" class="form-control" id="startDate" v-model="startDate" required>
          </td>
        </tr>
        <tr>
          <th style="width: 35%;">종료 날짜</th>
          <td style="width: 65%;">
            <input type="date" class="form-control" id="endDate" v-model="endDate" required>
          </td>
        </tr>
        <tr>
          <th style="width: 35%;">낚시 종류 설정</th>
          <td style="width: 65%;">
            <input class="form-control" type="text" v-model="fishingSort" required>
          </td>
        </tr>
        <tr>
          <th style="width: 35%;">낚시 인원 설정</th>
          <td style="width: 65%;">
                        <span class="d-flex">
                            <input class="form-control" type="number" v-model="extrasMembers" required>&nbsp;명
                        </span>
          </td>
        </tr>
        <tr>
          <th style="width: 35%;">낚시 금액 설정</th>
          <td style="width: 65%;">
                        <span class="d-flex">
                            <input class="form-control" type="number" v-model="fishingMoney" required>&nbsp;원
                        </span>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <button class="btn btn-dark w-100 mt-4" type="submit">적용하기</button>
          </td>
        </tr>
        </tbody>
      </table>
    </form>
  </div>
</template>

<script>
import backSideApiService from "@/services/BackSideApiService";
import moment from "moment";

export default {
  name : "ReservationDateSortChangeComponent",
  data() {
    return {
      reservationDateDTO : {
        rdate : '',
        regDate : '',
        fishingSort : '',
        extrasMembers : '',
        fishingMoney : '',
      },
      startDate : '',
      endDate : '',
      fishingSort : '',
      extrasMembers : '',
      fishingMoney : '',
    }
  },
  methods : {
    async loadReservationDateSort() {
      if(!this.reservationDateDTO.regDate) return null;

      try {
        const response = await backSideApiService.loadReservationDateSort(this.reservationDateDTO.regDate);
        this.reservationDateDTO = response.data.reservationDateDTO;
      }catch (error){
        alert("데이터를 불러오는 중 오류가 발생하였습니다.")
      }
    },
    async dateChange(){
      const modifyData = {
        rdate : this.reservationDateDTO.rdate,
        regDate : this.reservationDateDTO.regDate,
        fishingSort : this.reservationDateDTO.fishingSort,
        fishingMoney : this.reservationDateDTO.fishingMoney,
        extrasMembers : this.reservationDateDTO.extrasMembers
      }

      try {
        const response = await backSideApiService.modifyReservationDateSort(modifyData);
        alert(response.data.success);
      }catch (error){
        alert(error.response.data.error);
      }
    },
    async dateRangeChange() {
      const modifyData = {
        startDate : this.startDate,
        endDate : this.endDate,
        fishingSort : this.fishingSort,
        fishingMoney : this.fishingMoney,
        extrasMembers : this.extrasMembers
      }

      try {
        const response = await backSideApiService.modifyReservationDatesSort(modifyData);
        let result = window.confirm(response.data.success);
        if(result) {  window.location.href='http://localhost:3000/reservation/list'}
      }catch (error){
        alert(error.response.data.error);
      }

    }
  },
  watch: {
    'reservationDateDTO.regDate': function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.loadReservationDateSort();
      }
    }
  },
  mounted() {
    this.reservationDateDTO.regDate = moment().format('YYYY-MM-DD');
    this.startDate = moment().format('YYYY-MM-DD');
    this.endDate = moment().add(1, 'day').format('YYYY-MM-DD');
    this.loadReservationDateSort();
  }
}

</script>


<style scoped>

</style>