import bcrypt from 'bcryptjs'
import Users from '../models/users.js';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

function accessData(user){
    const token = jwt.sign({ userId: user._id}, process.env.SECRET_KEY )
    return{
        token,
        userName: user.personal_info.userName,
        fullName: user.personal_info.fullName,
        email : user.personal_info.email,
        profile_Pic: user.personal_info.profile_Pic
    } 
}

export async function handelUserRegister(req, res){
    try {
       const {fullName, email, password} = req.body
       if(fullName && email && password){
            const user = await Users.findOne({'personal_info.email' : email })
            if(!user){
                if(fullName?.length < 5){
                    return res.status(400).json({error: "Please enter a valid Full Name"})
                }
                if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)){
                    return res.status(400).json({error: "Please enter a valid email"})
                }
                if(password?.length < 5){
                    return res.status(400).json({error: "Please enter a valid and more than 5 length password"})
                }
            
                const hashPassword = await bcrypt.hash(password, 10)
                const userName = email.split("@")[0]
                const userData = new Users({
                    personal_info :{
                        fullName,
                        email,
                        password: hashPassword,
                        userName
                    }
                })
                const response = await userData.save() 
                 return res.status(201).json(accessData(response))
            }else{
                return res.status(400).json({success: false, error: "User Already Register"})
            }
       }else{
            return res.status(400).json({error: "please fill all the required details for sign up"})
       }
       
    } catch (error) {
        res.json({error: error})
    }
}

export async function handelUserLogin(req, res){
    try {
        const {email , password} = req.body;
        if(email && password){
            if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)){
                return res.status(400).json({error: "Please enter a valid email"})
            }
            if(password?.length < 5){
                return res.status(400).json({error: "Please enter a valid and more than 5 length password"})
            }
            const user = await Users.findOne({ 'personal_info.email' : email})
            console.log(user, 'user data')
            if(!user){
                return res.status(400).json({error: "Please enter the email address"})
            }
            const isMatch = await bcrypt.compare(password,user.personal_info.password)
            console.log("is match password", isMatch);
            if(!isMatch){
                return res.status(400).json({error: "Please enter a correct password"})
            }
            return res.status(200).json(accessData(user))
        }else{
            return res.status(400).json({error: "please fill all the required details for log in"})
        }
    } catch (error) {
        return res.json({error: error})
    }
    
}

