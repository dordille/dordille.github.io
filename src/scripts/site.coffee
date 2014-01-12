document.addEventListener 'DOMContentLoaded', ->
    email = document.getElementById 'email'
    email.addEventListener 'mouseover', () ->
        email.href = ['m', 'a', 'i', 'l', 't', 'o', ':',
            'd', 'o', 'r', 'd', 'i', 'l', 'l', 'e', '@',
            'g', 'm', 'a', 'i', 'l', '.', 'c', 'o', 'm'].join ''