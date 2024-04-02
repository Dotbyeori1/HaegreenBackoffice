<template>
  <slot name="backHeader">
    <nav class="sb-topnav navbar navbar-expand navbar-dark bg-dark">
      <!-- Navbar Brand-->
      <a class="navbar-brand ps-3" href="/admin/reservationlist">관리페이지</a>
      <!-- Sidebar Toggle-->
      <button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i
          class="fas fa-bars"></i></button>
      <!-- Navbar Search-->
      <div class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
      </div>
      <!-- Navbar-->
      <ul class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown"
             aria-expanded="false"><i class="fas fa-user fa-fw"></i></a>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
            <li><a class="dropdown-item" href="http://localhost:3000">메인으로</a></li>
            <li>
              <hr class="dropdown-divider"/>
            </li>
            <li><a class="dropdown-item" @click="logout">로그아웃</a></li>
          </ul>
        </li>
      </ul>
    </nav>
  </slot>
  <slot name="backContent">
    <div id="layoutSidenav">
      <div id="layoutSidenav_nav">
        <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
          <div class="sb-sidenav-menu">
            <div class="nav">
              <div class="sb-sidenav-menu-heading">메인</div>
              <a class="nav-link" href="#">
                <div class="sb-nav-link-icon"><i class="fas fa-tachometer-alt"></i></div>
                대시보드
              </a>
              <div class="sb-sidenav-menu-heading">예약관리</div>
              <router-link class="nav-link" to="/admin/searchlist">
                <div class="sb-nav-link-icon"><i class="fas fa-columns"></i></div>
                예약현황(최근별)
              </router-link>
              <router-link class="nav-link" to="/admin/reservationlist">
                <div class="sb-nav-link-icon"><i class="fas fa-columns"></i></div>
                예약현황(날짜별)
              </router-link>
              <router-link class="nav-link" to="/admin/modifydate">
                <div class="sb-nav-link-icon"><i class="fas fa-columns"></i></div>
                날짜별예약상태
              </router-link>
              <router-link class="nav-link" to="/admin/modifysort">
                <div class="sb-nav-link-icon"><i class="fas fa-columns"></i></div>
                날짜별예약정보
              </router-link>
              <router-link class="nav-link" to="/admin/ReservationListGrid">
                <div class="sb-nav-link-icon"><i class="fas fa-columns"></i></div>
                그리드테스트
              </router-link>
              <div class="collapse" id="collapsePages" aria-labelledby="headingTwo"
                   data-bs-parent="#sidenavAccordion">
                <nav class="sb-sidenav-menu-nested nav accordion" id="sidenavAccordionPages">
                  <a class="nav-link collapsed" href="#" data-bs-toggle="collapse"
                     data-bs-target="#pagesCollapseAuth" aria-expanded="false"
                     aria-controls="pagesCollapseAuth">
                    Authentication
                    <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                  </a>
                  <div class="collapse" id="pagesCollapseAuth" aria-labelledby="headingOne"
                       data-bs-parent="#sidenavAccordionPages">
                    <nav class="sb-sidenav-menu-nested nav">
                      <a class="nav-link" href="http://localhost:3000">메인으로</a>
                      <a class="nav-link" @click="logout()">로그아웃</a>
                    </nav>
                  </div>
                  <a class="nav-link collapsed" href="#" data-bs-toggle="collapse"
                     data-bs-target="#pagesCollapseError" aria-expanded="false"
                     aria-controls="pagesCollapseError">
                    Error
                    <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                  </a>
                  <div class="collapse" id="pagesCollapseError" aria-labelledby="headingOne"
                       data-bs-parent="#sidenavAccordionPages">
                    <nav class="sb-sidenav-menu-nested nav">
                      <a class="nav-link" href="401.html">401 Page</a>
                      <a class="nav-link" href="404.html">404 Page</a>
                      <a class="nav-link" href="500.html">500 Page</a>
                    </nav>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </nav>
      </div>
      <div id="layoutSidenav_content">
        <router-view></router-view>
        <footer class="py-4 bg-light mt-auto">
          <div class="container-fluid px-4">
            <div class="d-flex align-items-center justify-content-between small">
              <div class="text-muted">2023© 해그린피싱</div>
              <div>
                <a href="#">이용약관</a>
                &middot;
                <a href="#">개인보호정책</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </slot>
</template>

<script>
import {useUserStore} from "@/store/UserStore";
import {computed} from "vue";

export default {
  name: "BackFragments",
  props: {
    changeView: Boolean
  },
  setup() {
    const userStore = useUserStore();
    const role = computed(() => userStore.role);

    function logout() {
      userStore.logout();
      window.location.href = 'http://localhost:3000/member/login'
    }

    return {role, logout};
  },
}
</script>

<style lang="css" scoped>
@import url('@/assets/sbadmin/css/styles.css');
@import url('@/assets/sbadmin/css/style.min.css');
</style>