import mongoose from 'mongoose'
import UserSchema from '../interfaces/UserSchema'


const userSchema = new mongoose.Schema<UserSchema>({
    username: String,
    mail:     String,

    password: {
        hash: String,
        salt: String,
        iv:   String
    },

    saved: {
        type: [{
            items: [{
                name: String,
                itemtype: String,
    
                filetype:    String,
                sizeKB:      Number,
                path:        String,
                thumbnail:   String,
                length:      Number,
                description: String
            }],
    
            name: String,
            itemtype: String
        }],

        default: [{ name: 'root', itemtype: 'folder', items: [] }]
    }
})


export default mongoose.model<UserSchema>('User', userSchema)