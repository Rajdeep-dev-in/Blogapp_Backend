import mongoose from "mongoose";

export async function connectWithMongoDb(url){
    return mongoose.connect(url)
}
