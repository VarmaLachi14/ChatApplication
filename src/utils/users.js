const users = []

//addUser , removeUser , getUser, getUserInRoom

const addUser = ({id,username,room}) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate data
    if(!username | !room){
        return {
            error : 'Username and Room are Required'
        }
    }

    // Check for Existing User

    const existingUser = users.find((check) => check.room === room && check.username === username)

    //Validate Username
    if(existingUser){
        return {
            error : "Username is in Use !"
        }
    }

    //Store User
    const user = {id,username,room}
    users.push(user)
    return {user}
}

const removeUser = (id) => {
    const index = users.findIndex((users) => users.id === id)
    if(index !== -1){
        return users.splice(index,1)[0]
    }
}


const getUser = (id) => {
    return users.find((findbyId) => findbyId.id === id)
   
}

const getUserInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((fill) => fill.room === room)
}


module.exports = {
    addUser,
    getUserInRoom,
    getUser,
    removeUser
}