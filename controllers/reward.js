const Discount = require("../models/discount")
const User = require("../models/user")

exports.grantReward = async (req, res) => {
    try {
        const { shopLocation, email } = req.body
        const date = Date.now()
        const userId = (await User.findOne({ email: email })).id;

        if (!userId) {
            req.flash("error", 'no registered account with the associated email')
            return res.redirect("/admin/grant-reward")
        }
        Discount.create({
            userId: userId, shopLocation: shopLocation, date: date
        }, (error, dis) => {
            if (dis) {
                res.render(
                    'admin/add-product', {
                    errors: req.flash('error'),
                    success: req.flash('success'),
                    pageTitle: "add transaction",
                    active: "add",
                    discount: dis

                }
                )
            }
            else {
                const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
                console.log(validationErrors)
                req.flash("error", validationErrors)
                return res.redirect("/admin/grant-reward")
            }
        }
        )

    }
    catch (error) {
        req.flash("error", error)
        return res.redirect("/admin/grant-reward")
    }
};
exports.grantRewardView = async (req, res) => {
    res.render('admin/add-reward', {
        errors: req.flash('error'),
        success: req.flash('success'),
        pageTitle: "add transation",
        active: "add"
    })

}
exports.deleteReward = async (req, res) => {
    try {
        const id = req.body.id
        console.log(id)
        await Discount.findOneAndDelete({ id: id })
        req.flash("success", "successfully removed transaction")
        return res.redirect("/admin/view-reward")
    }
    catch (error) {
        console.log(error)
        req.flash("error", 'something went wrong')
        return res.redirect("/admin/view-reward")
    }
};
exports.viewAllRewards = async (req, res) => {
    const rewards = await Discount.find({}).populate('userId')
    res.render('admin/edit-reward', {
        errors: req.flash('error'),
        rewards: rewards,
        success: req.flash('success'),
        pageTitle: "view transactions",
        active: "view"
    })

}
exports.viewAllUserRewards = async (req, res) => {
    const id = req.session.userId;
    const rewards = await Discount.find({ userId: id })
    var totalAmount = 0
    rewards.filter(reward => totalAmount = Number(reward.discounts) + totalAmount)
    res.render('discounts', {
        errors: req.flash('error'),
        rewards: rewards,
        totalAmount: totalAmount,
        success: req.flash('success'),
        pageTitle: 'rewards'

    })

}
exports.viewProduct = async (req, res) => {
    const id = req.params.id;
    const rewards = await Discount.findOne({ "_id": id })
    res.render('products', {
        errors: req.flash('error'),
        rewards: rewards,
        success: req.flash('success'),
        pageTitle: 'rewards'

    })
}
exports.addProduct = async (req, res) => {
    try {
        const id = req.params.id
        const { item, qty, amount } = req.body
        const dis = { id: id }
        if (!item) {
            res.render(
                'admin/add-product', {
                errors: ["you did not type in any product"],
                success: req.flash('success'),
                pageTitle: "add transaction",
                active: "add",
                discount: dis

            }
            )
        }

        if (typeof (req.body.item) == 'object') {
            const all = []
            var discounts = 0
            for (let i = 0; i < item.length; i++) {
                var itm = {}
                itm["item"] = item[i];
                itm["qty"] = qty[i]
                itm["amount"] = amount[i]
                itm["discount"] = (Number(amount[i]) * 0.05).toFixed(2)
                all.push(itm)
                discounts = discounts + (Number(amount[i]) * 0.05)
            }
            var shoppingAmount = 0
            amount.filter(p => {
                shoppingAmount = shoppingAmount + Number(p)
            })
            Discount.findOneAndUpdate({ _id: id }, { product: all, shoppingAmount: shoppingAmount, discounts: discounts.toFixed(2) }, (er, add) => {
                console.log(er, add)
                if (er) {
                    const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
                    console.log(validationErrors)
                    req.flash("error", validationErrors)
                    res.render(
                        'admin/add-product', {
                        errors: req.flash('error'),
                        success: req.flash('success'),
                        pageTitle: "add transaction",
                        active: "add",
                        discount: dis

                    }
                    )
                }
                else {
                    req.flash("success", "transaction add successfully")
                    res.redirect("/admin/grant-reward")
                }
            })
        }

        else if (typeof (req.body.item) == 'string') {
            const discount = (Number(req.body.amount) * 0.05).toFixed(2)
            var discounts = (Number(req.body.amount) * 0.05).toFixed(2)
            var shoppingAmount = Number(req.body.amount)
            console.log(discount,
                discounts,
                shoppingAmount)
            const all = []
            Discount.findOneAndUpdate({ _id: id }, { product: [{ ...req.body, discount: discount }], shoppingAmount: shoppingAmount, discounts: discounts }, (er, add) => {
                console.log(er, add)
                if (er) {
                    const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
                    console.log(validationErrors)
                    req.flash("error", validationErrors)
                    res.render(
                        'admin/add-product', {
                        errors: req.flash('error'),
                        success: req.flash('success'),
                        pageTitle: "add transaction",
                        active: "add",
                        discount: dis

                    }
                    )
                }
                else {
                    req.flash("success", "transaction add successfully")
                    res.redirect("/admin/grant-reward")
                }
            })
        }

    }
    catch (error) {
        console.log(error)
        req.flash("error", error)
        return res.redirect("/admin/grant-reward")
    }
};

exports.viewAllProduct = async (req, res) => {
    const productId = req.params.id
    const product = (await Discount.findOne({ _id: productId })).product

    console.log(product)
    res.render('admin/view-product', {
        errors: req.flash('error'),
        product: product,
        success: req.flash('success'),
        pageTitle: "view transactions",
        active: "view"
    })

}