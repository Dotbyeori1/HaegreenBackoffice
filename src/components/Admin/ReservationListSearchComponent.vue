<template>
  <div class="container" style="margin: 0 auto; padding: 5%;">
    <h1>예약현황(최근별)</h1>
    <p>예약번호를 누르시면 해당번호의 예약정보 확인·수정·삭제가 가능합니다.</p>
    <p>검색을 통해 원하는 결과를 얻을 수 있습니다.</p>
    <div class="col-md-12" style="margin: 25px 0;">
      <form @submit.prevent="searchAudit">
        <table class="table border">
          <thead>
            <tr>
              <th class="table-light" colspan="4" style="text-align: center">
              검색하기
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="width: 15%">예약자명</td>
              <td style="width: 35%"><input type="text" class="form-control" v-model="reservationDTO.regName"/>&nbsp;
              </td>
              <td style="width: 15%">입금자명</td>
              <td style="width: 35%"><input type="text" class="form-control" v-model="reservationDTO.depositName"/>&nbsp;
              </td>
            </tr>
            <tr>
              <td style="width: 15%">전화번호</td>
              <td class="border-right" style="width: 35%">
                <input type="text" class="form-control" v-model="reservationDTO.tel"/>&nbsp;
              </td>
              <td style="width: 15%">예약번호</td>
              <td style="width: 35%">
                <input type="number" class="form-control" v-model="reservationDTO.rvno"/>&nbsp;
              </td>
            </tr>
            <tr>
              <td style="width: 15%">예약날짜</td>
              <td style="width: 85%" colspan="3">
                <input type="date" class="form-control" v-model="reservationDTO.regDate"/>&nbsp;
              </td>
            </tr>
            <tr class="table-light">
              <td colspan="4" style="text-align: center">
                <button class="btn btn-primary" type="submit" style="margin-right: 10px">검색</button>
                <button class="btn btn-outline-primary" type="button" @click="clear">초기화</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>

    <div v-if="this.search === true">
      <p>남은인원 : {{ extras }}, 확정된인원 : {{ confirmMember }}명</p>
    </div>

    <table class="table" style="margin-top: 10px;">
      <thead>
      <tr class="table-light">
        <th>예약번호</th>
        <th v-if="!this.search">예약날짜</th>
        <th>예약자명</th>
        <th>입금자명</th>
        <th>전화번호</th>
        <th>인원</th>
        <th>입금금액</th>
        <th>예약확정</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="dto in result.dtoList" :key="dto.rvno">
        <td>
          <router-link :to="`/admin/reservationInfo?rvno=${dto.rvno}&search=true`">{{ dto.rvno }}</router-link>
        </td>
        <td v-if="!this.search">{{ dto.regDate }}</td>
        <td>{{ dto.regName }}</td>
        <td>{{ dto.depositName }}</td>
        <td><a :href="'tel:'+dto.tel">{{ dto.tel }}</a></td>
        <td>{{ dto.member }}</td>
        <td>{{ dto.formatMoney }}</td>
        <td>
          <p v-if="dto.state">
            확정완료
          </p>
          <button v-if="!dto.state"
                  class="btn btn-primary"
                  @click="confirmStateChange(true,dto.rvno)">
            확정하기
          </button>
        </td>
      </tr>
      <!-- 만약 dtoList가 비어있을 때 메시지를 표시 -->
      <tr v-if="result.dtoList.length === 0">
        <td colspan="9" style="text-align: center">
          조회 된 결과가 없습니다.
        </td>
      </tr>
      </tbody>
    </table>
    <nav>
      <ul class="pagination justify-content-center">
        <!-- 'Previous' 버튼 -->
        <li :class="result.prev ? 'page-item' : 'page-item disabled'">
          <a class="page-link" @click="changePage( this.result.page - 1)">
            이전
          </a>
        </li>

        <!-- 페이지네이션 -->
        <li v-for="page in paginationRange" :key="page"
            :class="result.page === page ? 'page-item active' : 'page-item'">
          <a class="page-link" @click="changePage(page)">
            {{ page }}
          </a>
        </li>

        <!-- 'Next' 버튼 -->
        <li :class="result.next ? 'page-item' : 'page-item disabled'">
          <a class="page-link" @click="changePage(this.result.page + 1)">
            다음
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import backSideApiService from "@/services/BackSideApiService";

export default {
  name: "reservationListSearchComponent",
  data() {
    return {
      reservationDTO:
          {page: 1, rvno: null, type: '', regName: '', depositName: '', tel: '', regDate: ''},
      result: {dtoList: []},
      search: false,
      extras: '',
      confirmMember: ''
    }
  },
  computed: {
    paginationRange() {
      const totalPages = this.result.totalPage;
      const currentPage = this.result.page;
      const range = 5;
      let startPage = currentPage - Math.floor(range / 2);
      startPage = Math.max(startPage, 1);
      let endPage = startPage + range - 1;
      endPage = Math.min(endPage, totalPages);
      startPage = Math.max(endPage - range + 1, 1);
      const pages = [];
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    }
  },
  methods: {
    changePage(page) {
      this.reservationDTO.page = page;
      this.loadReservationList(this.reservationDTO, false);
    },
    clear() {
      if (!this.reservationDTO.regName &&
          !this.reservationDTO.depositName &&
          !this.reservationDTO.tel &&
          !this.reservationDTO.rvno &&
          !this.reservationDTO.regDate) {
        return null;
      } else {
        const updatedReservationDTO = {page: 1, rvno: null, type: '', regName: '', depositName: '', tel: ''};
        this.reservationDTO = updatedReservationDTO;
        this.loadReservationList(updatedReservationDTO, false);
      }
    },
    searchAudit() {
      if (!this.reservationDTO.regName &&
          !this.reservationDTO.depositName &&
          !this.reservationDTO.tel &&
          !this.reservationDTO.rvno &&
          !this.reservationDTO.regDate) {
        return null;
      } else {
        this.loadReservationList(this.reservationDTO, true);
      }
    },
    async loadReservationList(reservationDTO, search) {

      if (search) {
        this.search = search;
      } else {
        this.search = false;
      }

      try {
        const response = await backSideApiService.loadReservationSearchListonList(reservationDTO)  // 여기서 data를 사용하여 전달);
        this.extras = response.data.extras;
        this.confirmMember = response.data.confirmMember;
        this.result = response.data.result;
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
          await this.loadReservationList(this.reservationDTO, this.search);
        } catch (error) {
          alert(error.response.data.error);
        }
      }
    }
  },
  mounted() {
    this.loadReservationList(this.reservationDTO, false);
  }
}

</script>

<style scoped>
.pagination a {
  cursor: pointer;
}
</style>