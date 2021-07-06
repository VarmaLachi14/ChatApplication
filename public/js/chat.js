const socket = io()
const $messageForm = document.querySelector('#form1')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $location = document.querySelector('#location')
const $message = document.querySelector('#message')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate  = document.querySelector('#sidebar-template').innerHTML


const {username,room} = Qs.parse(location.search,{ ignoreQueryPrefix  : true})


socket.on('locationMessage',(obj) => {
    const html = Mustache.render(locationMessageTemplate,{
        userName : obj.username,
        url : obj.url,
        createdAt : moment(obj.createdAt).format('h:mm a')
    })
    $message.insertAdjacentHTML('beforeend',html)
})

socket.on('message',(intro) => {
    const html = Mustache.render(messageTemplate,{
        username :intro.username,
        message : intro.text,
        createdAt : moment(intro.createdAt).format('h:mm a')
    })
    $message.insertAdjacentHTML('beforeend',html)
})

$messageForm.addEventListener('submit',(e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled',"disabled")

    const msg1 = e.target.elements.forminput.value
    socket.emit('submissions', msg1, (error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }

    })
})

$location.addEventListener('click',(e) => {
    
    if(!navigator.geolocation){
        return alert("Geolocation is not supported by the browser")
    }
    
    $location.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('location',{
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        },() => {
            $location.removeAttribute('disabled')
        })
    })
})

socket.emit('join',{username,room},(error) =>{
    if(error){
        alert(error)
        location.assign('/')
    }
})

socket.on('roomData',({room,users}) => {
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})