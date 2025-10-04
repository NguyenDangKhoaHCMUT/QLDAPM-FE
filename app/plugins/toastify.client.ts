import { defineNuxtPlugin } from '#app'
import Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toastify, {
    autoClose: 3000,
    position: 'top-right',
    theme: 'light',
    hideProgressBar: false, // Hiển thị thanh progress để biết thời gian còn lại
    closeOnClick: true, // Cho phép click để đóng
    pauseOnHover: true, // Dừng đếm ngược khi hover
    draggable: true, // Cho phép kéo thả
    transition: 'Vue-Toastification__bounce', // Animation mượt hơn
    newestOnTop: true // Toast mới nhất hiển thị trên cùng
  })
})
