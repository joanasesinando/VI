resize()
window.addEventListener('resize', resize)

eva.replace()

function resize () {
  window.innerWidth < 991.98 ? showWarning() : hideWarning()
}

function showWarning () {
  $('.navbar, .footer, .top-section, .bottom-section').attr('style', 'display: none !important')
  $('.warning').attr('style', 'display: block')
  $('body').addClass('no-vis')
}

function hideWarning () {
  $('.navbar, .top-section, .bottom-section').attr('style', 'display: block !important')
  $('.footer').attr('style', 'display: flex !important')

  $('.warning').attr('style', 'display: none')
  $('body').removeClass('no-vis')
}
