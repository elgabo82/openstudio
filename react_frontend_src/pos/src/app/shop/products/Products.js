import React, { Component } from "react"
import { intlShape } from "react-intl"
import PropTypes from "prop-types"
import { v4 } from "uuid"
import validator from 'validator'

import ShopTemplate from '../ShopTemplate'
import ProductsList from "./ProductsList"

import InputGroupSearch from "../../../components/ui/InputGroupSearch"
import Breadcrumb from "../../../components/ui/Breadcrumb"
import ProductsCategoryFilter from "./ProductsCategoryFilter";

class Products extends Component {
    constructor(props) {
        super(props)
        console.log(props)
    }

    PropTypes = {
        intl: intlShape.isRequired,
        setPageTitle: PropTypes.function,
        addToCart: PropTypes.function,
        app: PropTypes.object,
        categories: PropTypes.object,
        loaded: PropTypes.boolean,
    }

    componentWillMount() {
        this.props.setPageTitle(
            this.props.intl.formatMessage({ id: 'app.pos.products' })
        )
        this.props.setCustomersListRedirectNext('/shop/products')
        if (!this.props.loaded) {
            this.props.fetchProducts()
        }
        if (!this.props.categories_loaded) {
            this.props.fetchProductCategories()
        }

    }

    onClickProductListItem(product) {
        console.log('clicked on:')
        console.log(product)

        let item = {
           id: v4(),
           item_type: 'product',
           quantity: 1,
           data: product 
        }

        console.log('item')
        console.log(item)
        // Check if item not yet in cart
        
        // If not yet in cart, add as a new pproduct, else increase 
        this.props.addToCart(item)
        
        // this.props.setDisplayCustomerID(id)
    }

    onSearchClear() {
        console.log('clear clicked')
        this.props.clearSearchValue()
        this.props.clearSearchProductID()
    }

    onSearchChange(e) {
        console.log('search value changed')
        const value = e.target.value
        const products = this.props.products

        this.props.setSearchValue(value)

        console.log("timeout: " + products.searchTimeout)
        if ( products.searchTimeout ) {
            this.props.clearSearchTimeout()
            console.log('reset timeout')
        }

        let timeout
        this.props.setSearchTimeout(
            setTimeout(() => this.setSearchValue(value), 
                (validator.isInt(value)) ? timeout = 225 : timeout = 750)
        )
    }

    setSearchValue(value) {
        this.props.clearSearchProductID()

        let productID

        if (validator.isInt(value)) {
            productID = value
            this.props.setSearchProductID(productID)
        } 
    }


    onClickBreadcrumbHome() {
        this.props.clearCategoryFilterID()
    }

    onClickCategory = id => {
        console.log('clicked category')
        console.log(id)    
        this.props.setCategoryFilterID(id)    
    }
    
    
    render() {
        const products = this.props.products
        const products_data = this.props.products.data
        const product_categories = this.props.products.categories

        let products_list = []
        let filtered_products = []
        if (products.loaded) {
            // Apply filter before searching
            if (products.category_filter_id) {
                Object.keys(products.data).map( (key) => {
                    // check if filter id in categories for product variant
                    if (products.data[key].categories.includes(products.category_filter_id)) {
                        filtered_products.push(products_data[key])
                    }
                })
            } else {
                // No need to filter anything
                filtered_products = products_data
            }

            // Search barcode
            if ( products.searchID ) {
                filtered_products.map( (product) => {
                    // console.log('customer:')
                    // console.log(key)
                    // console.log(customers.data[key])
                    if (product.barcode.includes(products.searchID)) {
                        products_list.push(product)
                    }
                })
            } else if (products.search_value && products.search_value.length > 1) {
                filtered_products.map( (product) => {
                    // console.log('product:')
                    // console.log(product)
                    // console.log(filtered_products[key])
                    if ( (product.search_product_name.includes(products.search_value)) ||  
                         (product.search_variant_name.includes(products.search_value)) ) {
                        products_list.push(product)
                    }
                })
            } else {
                // show all products in category if no further filters are applied
                products_list = filtered_products
            }
        }

        return (
            <ShopTemplate app_state={this.props.app}>
                { this.props.loaded ? 
                    <div>
                        <div className="row">
                            <div className="col-md-6">
                                <Breadcrumb onClickHome={this.onClickBreadcrumbHome.bind(this)} 
                                            category_filter_id={products.category_filter_id}
                                            categories={product_categories}
                                            home_title='All products' />
                            </div>
                            <div className="col-md-6">
                                <InputGroupSearch placeholder="Scan barcode or search..."
                                                onClear={this.onSearchClear.bind(this)}
                                                onChange={this.onSearchChange.bind(this)}
                                                value={products.search_value}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <ProductsCategoryFilter categories={products.categories}
                                                        category_filter_id={products.category_filter_id}
                                                        onClick={this.onClickCategory.bind(this)} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <ProductsList products={products_list}
                                              onClick={this.onClickProductListItem.bind(this)} />
                            </div>
                        </div>
                    </div> :
                     "Loading..."
                }
            </ShopTemplate>
        )
    }
}

export default Products
