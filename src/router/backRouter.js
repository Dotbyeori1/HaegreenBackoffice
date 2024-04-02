import {createRouter, createWebHistory} from 'vue-router';
import ReservationListDateComponent from "@/components/Admin/ReservationListDateComponent.vue";
import ReservationListSearchComponent from "@/components/Admin/ReservationListSearchComponent.vue";
import ReservationInfoComponent from "@/components/Admin/ReservationInfoComponent.vue";
import ReservationModifyComponent from "@/components/Admin/ReservationModifyComponent.vue";
import ReservationDateStateChangeComponent from "@/components/Admin/ReservationDateStateChangeComponent.vue";
import ReservationDateSortChangeComponent from "@/components/Admin/ReservationDateSortChangeComponent.vue";
import {useUserStore} from "@/store/UserStore";
import BackLayout from "@/components/Layout/BackLayout.vue";
import ReservationListGirdComponent from "@/components/Admin/ReservationListGirdComponent.vue";

const routes = [
    {
        path: '/admin',
        component: BackLayout,
        children: [
            {
                path: 'reservationlist',
                name: 'ReservationList',
                component: ReservationListDateComponent
            },
            {
                path: 'searchlist',
                name: 'SearchList',
                component: ReservationListSearchComponent
            },
            {
                path: 'reservationInfo',
                name: 'reservationInfo',
                component: ReservationInfoComponent
            },
            {
                path: 'reservationModify',
                name: 'ReservationModify',
                component: ReservationModifyComponent
            },
            {
                path: 'modifydate',
                name: 'ModifyDate',
                component: ReservationDateStateChangeComponent
            },
            {
                path: 'modifysort',
                name: 'modifySort',
                component: ReservationDateSortChangeComponent
            },
            {
                path: 'ReservationListGrid',
                name: 'ReservationListGrid',
                component: ReservationListGirdComponent
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

// 이전 페이지를 저장하는 전역 변수
let previousPage = null;

// 이전 페이지를 갱신하는 함수
function updatePreviousPage(to) {
    previousPage = to.fullPath;
}

// 라우터 가드 설정
router.beforeEach((to, from, next) => {
    updatePreviousPage(from);

    const userStore = useUserStore();
    const isAuthenticated = userStore.role || null;

    // 인증이 필요한 페이지인 경우
    if (to.meta.requiresAuth) {
        if (isAuthenticated === null) {
            // 인증되지 않은 사용자가 접근 시 로그인 페이지로 리디렉션
            userStore.setNeedLogin(true);
            next({name: "login"});
        } else {
            // 나머지 그냥 진행
            next();
        }
    }
    // 관리자 권한이 필요한 페이지인 경우
    else if (to.meta.adminAuth) {
        if (isAuthenticated !== "ADMIN") {
            // 관리자 권한이 없는 사용자가 접근 시 이전 페이지로 리디렉션
            next(from);
        } else {
            // 관리자 권한이 있는 경우 계속 진행
            next();
        }
    }
    // 인증이 필요하지 않은 페이지인 경우
    else {
        next();
    }
});

// 이전 페이지로 리다이렉트하는 메소드
export function redirectToPreviousPage() {
    if (previousPage) {
        router.push(previousPage);
    } else {
        // 이전 페이지가 없는 경우 기본 페이지로 리다이렉트
        router.push('/');
    }
}


export default router;