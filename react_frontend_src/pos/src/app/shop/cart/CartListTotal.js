import React, { Component } from "react"
import { intlShape } from "react-intl"
import PropTypes from "prop-types"

import Currency from "../../../components/ui/Currency"


class CartListTotal extends Component {
    constructor(props) {
        super(props)
        // console.log(props)
    }

    PropTypes = {
        intl: intlShape.isRequired,
        total: PropTypes.int,
    }

    // calculateTotal(items) {
    //     let total = 0
    //     items.map((item, i) => {
    //         if (item.item_type == 'product') {
    //             if (item.data.price) {
    //                 total = total + (item.data.price * item.quantity)
    //             }
    //         } else {
    //             if (item.data.Price) {
    //                 total = total + (item.data.Price * item.quantity)
    //             }
    //         }
    //     })

    //     return total
    // }
    
    render() {
        const total = this.props.total

        return (
            <div className="pull-right shop-cart-total">
                Total:  <Currency amount={total} />
            </div>
        )
    }
}

export default CartListTotal

