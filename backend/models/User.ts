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
                name:     String,
                itemtype: String,
                tree:     String,
                items:    Array,
    
                filetype:  String,
                created:   Number,
                sizeBytes: Number,
                thumbnail: String,
                length:    Number,
                note:      String
            }],

            name:     String,
            itemtype: String,
            tree:     String
        }] as any,

        default: [{ name: 'root', itemtype: 'folder', tree: 'root', items: [] }]
    }
})


export default mongoose.model<UserSchema>('User', userSchema)