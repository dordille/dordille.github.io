document.addEventListener('DOMContentLoaded', function() {
  var email;
  email = document.getElementById('email');
  return email.addEventListener('mouseover', function() {
    return email.href = ['m', 'a', 'i', 'l', 't', 'o', ':', 'd', 'o', 'r', 'd', 'i', 'l', 'l', 'e', '@', 'g', 'm', 'a', 'i', 'l', '.', 'c', 'o', 'm'].join('');
  });
});
