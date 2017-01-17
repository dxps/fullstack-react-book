const ProductList = React.createClass({

    getInitialState: function () {
        
        return {
            products: [],
            sortOrder: 'DESC'
        }

    },

    componentDidMount: function () {

        this.initialLoad();

    },
    
    initialLoad: function () {

        const products = Data.sort((a, b) => {
            if (this.state.sortOrder == 'DESC') return b.votes - a.votes;
            if (this.state.sortOrder == 'ASC') return a.votes - b.votes;
        });
        this.setState({products: products});
        
    },

    handleProductUpVote: function (productId) {

        console.log("Product with id " + productId + " was upvoted.");
        Data.forEach((el) => {
            if (el.id == productId) {
                el.votes = el.votes + 1;
                return;
            }
        });
        this.updateProductListOrder();

    },

    handleProductDownVote: function (productId) {

        console.log("Product with id " + productId + " was downvoted.");
        Data.forEach((el) => {
            if (el.id == productId) {
                el.votes = el.votes - 1;
                return;
            }
        });
        this.updateProductListOrder();

    },
    
    handleSortDescOrder: function () {
        
        // console.log("Product list should use descending order.");
        this.setState({ sortOrder: 'DESC' }, () => { this.updateProductListOrder(); });
        
    },

    handleSortAscOrder: function () {

        // console.log("Product list should use ascending order.");
        this.setState({ sortOrder: 'ASC' }, () => { this.updateProductListOrder(); });
        
    },

    updateProductListOrder: function () {

        const products = this.state.products.sort((a, b) => {
            if (this.state.sortOrder == 'DESC') return b.votes - a.votes;
            if (this.state.sortOrder == 'ASC') return a.votes - b.votes;
        });
        // console.log("(updateProductListOrder) sortOrder: '%s' products: [ %s ]", this.state.sortOrder, JSON.stringify(products, null, 4));
        this.setState({products: products});

    },

    render: function () {

        const products = this.state.products.map((product) => {
            return (
                <Product
                    key={'product-' + product.id}
                    id={product.id}
                    title={product.title}
                    description={product.description}
                    url={product.url}
                    votes={product.votes}
                    submitter_avatar_url={product.submitter_avatar_url}
                    product_image_url={product.product_image_url}
                    onUpVote={this.handleProductUpVote}
                    onDownVote={this.handleProductDownVote}
                />
            );
        });

        return (
            <div>
                <div className="ui container center aligned ">
                    <div className="ui icon buttons">
                        <button className="ui button" onClick={this.handleSortDescOrder}><i className="caret down icon"></i></button>
                        <button className="ui button" onClick={this.handleSortAscOrder}><i className="caret up icon"></i></button>
                    </div>
                </div>
                <div className='ui items'>
                    {products}
                </div>
            </div>
        )

    }

});


const Product = React.createClass({

    handleUpVote: function () {

        this.props.onUpVote(this.props.id)

    },

    handleDownVote: function () {

        this.props.onDownVote(this.props.id)

    },

    render: function () {

        return (
            <div className='item'>
                <div className='image'>
                    <img src={this.props.product_image_url}/>
                </div>
                <div className='middle aligned content'>
                    <div className='header'>
                        <a onClick={this.handleUpVote}><i className='large caret up icon'></i></a>
                        <a onClick={this.handleDownVote}><i className='large caret down icon'></i></a>
                        &nbsp; {this.props.votes}
                    </div>
                    <div className='description'>
                        <a href={this.props.url}>
                            {this.props.title}
                        </a>
                    </div>
                    <div className='extra'>
                        <span>Submitted by:</span>
                        <img className='ui avatar image' src={this.props.submitter_avatar_url}/>
                    </div>
                </div>
            </div>
        );
    }

});


ReactDOM.render(
    <ProductList />,
    document.getElementById('content')
);
