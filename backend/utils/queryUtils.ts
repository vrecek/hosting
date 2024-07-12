const queryFileItemById = (userId: string, itemId: string): object[] => {
    return [
        {
            ownerID: userId, 
            items: { $elemMatch: { _id: itemId }} 
        },
        { 'items.$': 1 }
    ]
}


export {
    queryFileItemById
}