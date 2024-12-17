const Users = require("../Models/userModel")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.userRegistration = async (req, res) => {
    try {
        const { fullName, email, password } = req.body
        if (!fullName || !email || !password) {
            res.status(406).json("Invalid Data !!")
        } else {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            const newUser = new Users({
                fullName, email, password: hashedPassword, profilePic: ""
            })

            if (password.length < 6) {
                res.status(400).json("Password must be atleast 6 characters !!")
            } else {
                const user = await Users.findOne({ email })
                if (user) {
                    res.status(400).json("Email already exists !!")
                } else {
                    await newUser.save()
                    res.status(200).json(newUser)
                }
            }
        }
    } catch (err) {
        console.log(err);
        res.status(400).json(err)
    }
}


exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            res.status(406).json("Invalid Data !!")
        } else {
            const existingUser = await Users.findOne({ email })
            if (existingUser) {
                const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
                if (!isPasswordCorrect) {
                    res.status(404).json("Invalid email/password")
                } else {
                    const token = jwt.sign({ userId: existingUser._id }, process.env.SECRET_KEY)
                    res.status(200).json({ token, fullName: existingUser.fullName, email: existingUser.email, profilePic: existingUser.profilePic })
                }
            } else {
                res.status(404).json("Invalid email/password")
            }
        }
    } catch (err) {
        console.log(err);
        res.status(400).json(err)
    }
}


exports.profileUpdate = async (req, res) => {
    try {
        const userId = req.payload
        if (req.file) {
            var profilePic = req.file.filename
            var { fullName, email } = req.body
        } else {
            var { fullName, email, profilePic } = req.body
        }

        const existingProfile = await Users.findOne({ _id: userId })
        existingProfile.fullName = fullName
        existingProfile.email = email
        existingProfile.profilePic = profilePic
        await existingProfile.save()
        res.status(200).json("Profile Updated !!")

    } catch (err) {
        console.log(err);
        res.status(400).json(err)
    }
}


exports.deleteAccount = async (req, res) => {
    try {
        const { email } = req.params
        const result = await Users.findOneAndDelete({ email: email })
        res.status(200).json(result)
    } catch (err) {
        console.log(err);
        res.status(400).json(err)
    }
}