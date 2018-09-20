export const gameCanvasTypes = {
    UPDATE_USER: 'UPDATE_USER'
}

export const updateUser = (user: {}) => {
    return {
        payload: {
            user
        },
        type: gameCanvasTypes.UPDATE_USER
    }
}
