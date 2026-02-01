import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/labels',
            name: 'labels',
            component: () => import('../views/LabelsView.vue')
        },
        {
            path: '/labels/designer',
            name: 'designer',
            component: () => import('../views/DesignerView.vue')
        },
        {
            path: '/employees',
            name: 'employees',
            component: () => import('../views/EmployeesView.vue')
        },
        {
            path: '/machines',
            name: 'machines',
            component: () => import('../views/MachinesView.vue')
        },
        {
            path: '/storage',
            name: 'storage',
            component: () => import('../views/StorageView.vue')
        }
    ]
})

export default router
