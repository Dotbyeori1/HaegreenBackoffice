<template>
  <div>
    <grid :data="reservationDTOS"
          :columns="columns"
          :rowHeaders="['checkbox']">
    </grid>
  </div>
</template>

<script>
import 'tui-grid/dist/tui-grid.css'
import { Grid } from '@toast-ui/vue-grid'
import backSideApiService from "@/services/BackSideApiService";

export default {
  name : "ReservationListGridComponent",
  components: { 'grid': Grid },
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

      columns: [
        {
          header: '예약번호',
          name: 'rvno',
          formatter: function({ value }) {
            return `<a href="/admin/reservationInfo?rvno=${value}&search=false">${value}</a>`;
          }
        },
        { header: '예약자명', name: 'regName' },
        { header: '입금자명', name: 'depositName' },
        { header: '전화번호', name: 'tel' },
        { header: '인원', name: 'member' },
        { header: '입금금액', name: 'formatMoney' },
        {
          header: '확정결정',
          name: 'state',
          formatter: function({ value, row }) {
            if (value) {
              return '확정완료';
            } else {
              return `<button class="btn btn-primary" onclick="location.href='/confirmStateChange?rvno=${row.rvno}'">확정하기</button>`;
            }
          }
        }
      ]
    }
  },
  methods : {
    async searchDate() {
      if (!this.regDate) return null;

      try {
        const response = await backSideApiService.loadReservationListonList(this.regDate)  // 여기서 data를 사용하여 전달);
        this.available = response.data.available;
        this.extras = response.data.extras;
        this.fishingMoney = response.data.fishingMoney;
        this.reservationDTOS = response.data.reservationDTOS;
        this.confirmMember = response.data.confirmMember;
      } catch (error) {
        alert("데이터를 가져오는 중 문제가 발생했습니다.");
      }
    }
  },
  mounted() {
    this.searchDate();
  }
}

</script>

<style scoped>

</style>