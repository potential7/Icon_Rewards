const bcrypt = require('bcrypt')
const Admin = require('../models/admin')
const User = require('../models/user')

exports.changePasswordView = (req, res) => {
    res.render('admin/admin changePassword', {
        errors: req.flash('error'),
        success: req.flash('success'),
        pageTitle: 'admin change-password',
        active: "password"

    })
};
exports.dashboard = (req, res) => {
    res.render('admin/admin dashboard', {
        pageTitle: "admin",
        active: "dashboard"
    })

};
exports.signinView = async (req, res) => {
    const user = await Admin.findOne({email:'admin@gmail.com'});
    if (!user){
        await Admin.create({email:'admin@gmail.com',password:'admin12345'})
    }
    res.render('admin/signin', {
        errors: req.flash('error'),
        pageTitle: 'admin signin'
    })
}

exports.login = (req, res) => {
    const { email, password } = req.body;
    Admin.findOne({ email: email }, (error, user) => {
        if (user) {
            bcrypt.compare(password, user.password, (error, same) => {
                if (same) {
                    req.session.userId = user._id// if passwords match
                    // // store user session
                    req.isAuthenticated = true
                    res.redirect('/admin/dashboard')
                }
                else {
                    const validationErrors = ['login details, not correct']
                    req.flash('error', validationErrors)
                    res.redirect('/admin')
                }
            })
        }
        else {
            const validationErrors = ['login details, not correct']
            req.flash('error', validationErrors)
            res.redirect('/admin')
        }
    }
    )
}


exports.changePassword = async (req, res) => {
    const password = req.body.password;
    const newPassword = req.body.npassword;
    const Confirmpassword = req.body.cpassword;
    var id = req.session.userId
    bcrypt.hash(newPassword, 10, (e, newhash) => {
        Admin.findById(id, (error, user) => {
            if (user) {
                bcrypt.compare(password, user.password, (error, same) => {
                    if (same) {
                        if (newPassword === Confirmpassword) {
                            // var usr = bcrypt.hash(newPassword, 10)
                            Admin.findByIdAndUpdate(id, { 'password': newhash }, (err, upd) => {
                                if (upd) {
                                    req.flash('success', 'Password successfuly changed')
                                    res.redirect('/admin/changepassword')
                                }
                            });

                        }
                        else {
                            const validationErrors = ['confirm password is not the same with new password']
                            req.flash('error', validationErrors)
                            req.flash('data', req.body)
                            res.redirect('/admin/changepassword')

                        }
                    }
                    else {
                        const validationErrors = ['password is not correct']
                        req.flash('error', validationErrors)
                        req.flash('data', req.body)
                        res.redirect('/admin/change-password')

                    }
                })

            }
            else {
                req.flash('error', 'not successfully')
                res.redirect('/admin/changepassword')
            }
        })
    })
}
exports.signupView = (req, res) => {
    res.render('signup', {
        errors: req.flash('error'),
        success: req.flash('success'),
        pageTitle: 'signup'
    }
    )
}

exports.signup = async (req, res, next) => {
    const { password, email } = req.body;
    const checkAdmin = await Admin.findOne({ email: email })
    if (checkAdmin) {
        req.flash('error', "email already exists")
        return res.redirect('/signup');
    }

    Admin.create({ password: password, email: email }, (error, user) => {
        if (error) {
            const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
            req.flash('error', validationErrors)
            req.flash('data', req.body)
            return res.redirect('/signup');
        }
        else {
            req.flash('success', 'Successfully created an account')
            req.session.userId = user._id
            res.redirect('/users');
        }
    }
    )
}

exports.getAllUsers = async (req, res, next) => {
    const users = await User.find({})
    res.render('admin/remove', {
        errors: req.flash('error'),
        success: req.flash('success'),
        users: users,
        pageTitle: "view users",
        active: "user"

    })
}

exports.deleteUser = async (req, res) => {
    try {
        const id = req.body.id
        await User.findOneAndDelete({ _id: id })
        req.flash("success", "successfully removed user")
        return res.redirect("/admin/get-users")
    }
    catch (error) {
        req.flash("error", error)
        console.log(error)
        return res.redirect("/admin/get-users")
    }
};


exports.addProduct = async (req,  res)=>{
    res.render('admin/add-product', {
        errors: req.flash('error'),
        success: req.flash('success'),
        pageTitle: "view users",
        active: "user"

    })   
}