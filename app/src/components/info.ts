export const info = document.querySelector('.info') as HTMLDivElement

info.addEventListener('click', function () {
  info.classList.remove('mostrarResultado')
})
