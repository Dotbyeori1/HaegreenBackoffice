<template>
  <div class="modal-background" v-if="showModal">
    <div :class="{ 'modal': true, 'fade': !showModal}" role="dialog" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">예약등록</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <form @submit.prevent="registerReservation">
            <div class="modal-body">
              <div class="form-group">
                <label for="regDate">예약날짜</label>
                <input type="date" id="regDate" :value="regDate" class="form-control" required>
              </div>
              <div class="form-group">
                <label for="member">예약인원</label>
                <select v-model="member" class="form-select" id="member">
                  <option v-for="i in extras" :key="i" :value="i" :selected="i === member">{{ i + '명' }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="regName">예약자명</label>
                <input type="text" id="regName" v-model="regName" class="form-control" placeholder="예약자명을 입력해주세요"
                       required>
              </div>
              <div class="form-group">
                <label for="depositName">입금자명</label>
                <input type="text" id="depositName" v-model="depositName" class="form-control"
                       placeholder="입금자명을 입력해주세요" required>
              </div>
              <div class="form-group">
                <label for="region">지역</label>
                <input type="text" id="region" v-model="region" class="form-control" placeholder="예시) 거제, 부산, 창원, 대전"
                       required>
              </div>
              <div class="form-group">
                <label for="tel">전화번호</label>
                <div style="display: flex;">
                  <input type="text" id="tel1" v-model="tel1" class="form-control" @input="enforceMaxLength('tel1', 3)"
                         required style="flex: 1;">-
                  <input type="text" id="tel2" v-model="tel2" class="form-control" @input="enforceMaxLength('tel2', 4)"
                         required style="flex: 1;">-
                  <input type="text" id="tel3" v-model="tel3" class="form-control" @input="enforceMaxLength('tel3', 4)"
                         required style="flex: 1;">
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary">전송</button>
              <button type="button" class="btn btn-secondary" @click="closeModal">취소</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import backSideApiService from "@/services/BackSideApiService";

export default {
  name: "ReservationRegisterComponent",
  props: {
    regDate: String,
    extras: Number,
    showModal: Boolean
  },
  data() {
    return {
      member: 1,
      regName: "",
      depositName: "",
      region: "",
      tel1: "",
      tel2: "",
      tel3: "",
      totalCost: '',
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    enforceMaxLength(field, maxLength) {
      if (field === 'tel1') {
        this.tel1 = this.tel1.replace(/[^\d]/g, '').slice(0, maxLength);
      } else if (field === 'tel2') {
        this.tel2 = this.tel2.replace(/[^\d]/g, '').slice(0, maxLength);
      } else if (field === 'tel3') {
        this.tel3 = this.tel3.replace(/[^\d]/g, '').slice(0, maxLength);
      }
    },
    async registerReservation() {
      const registerData = {
        regDate: this.regDate,
        regName: this.regName,
        member: this.member,
        depositName: this.depositName,
        region: this.region,
        tel1: this.tel1,
        tel2: this.tel2,
        tel3: this.tel3
      };

      try {
        const response = await backSideApiService.registerReservation(registerData);
        alert(response.data.message);
        this.closeModal();
      } catch (error) {
        if (error.response.data) {
          alert(error.response.data.error);
        }
        alert(error.response.data.error || "전송 중 오류가 발생하였습니다.");
      }
    }
  }
};
</script>

<style scoped>
.modal {
  display: block;
}

.form-group label {
  margin-top: 20px;
}

.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 투명도 조절 */
  z-index: 2000; /* 모달보다 낮은 z-index */
}
</style>
