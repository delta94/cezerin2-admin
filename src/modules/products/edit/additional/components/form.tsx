import { Button } from "@material-ui/core"
import FontIcon from "material-ui/FontIcon"
import IconButton from "material-ui/IconButton"
import IconMenu from "material-ui/IconMenu"
import MenuItem from "material-ui/MenuItem"
import Paper from "material-ui/Paper"
import RaisedButton from "material-ui/RaisedButton"
import React from "react"
import { Link } from "react-router-dom"
import TagsInput from "react-tagsinput"
import { Field, FieldArray, reduxForm } from "redux-form"
import { TextField } from "redux-form-material-ui"
import api from "../../../../../lib/api"
import * as helper from "../../../../../lib/helper"
import messages from "../../../../../lib/text"
import ProductSearchDialog from "../../../../../modules/shared/productSearch"
import ProductCategoryMultiSelect from "./productCategoryMultiSelect"
import ProductCategorySelect from "./productCategorySelect"
import style from "./style.css"

const TagsField = ({ input, placeholder }) => {
  const tagsArray = input.value && Array.isArray(input.value) ? input.value : []
  return (
    <TagsInput
      value={tagsArray}
      inputProps={{ placeholder }}
      onChange={tags => {
        input.onChange(tags)
      }}
    />
  )
}

const ProductShort = ({
  id,
  name,
  thumbnailUrl,
  priceFormatted,
  enabled,
  discontinued,
  actions,
}) => (
  <div
    className={
      style.relatedProduct +
      (enabled === false || discontinued === true
        ? ` ${style.relatedProductDisabled}`
        : "")
    }
  >
    <div className={style.relatedProductImage}>
      {thumbnailUrl && thumbnailUrl !== "" && <img src={`${thumbnailUrl}`} />}
    </div>
    <div className={style.relatedProductText}>
      <Link to={`/product/${id}`}>{name}</Link>
      <br />
      <>{priceFormatted}</>
    </div>
    <div className={style.relatedProductActions}>{actions}</div>
  </div>
)

const RelatedProductActions = ({ fields, index }) => (
  <IconMenu
    targetOrigin={{ horizontal: "right", vertical: "top" }}
    anchorOrigin={{ horizontal: "right", vertical: "top" }}
    iconButtonElement={
      <IconButton touch>
        <FontIcon color="#777" className="material-icons">
          more_vert
        </FontIcon>
      </IconButton>
    }
  >
    <MenuItem
      primaryText={messages.actions_delete}
      onClick={() => fields.remove(index)}
    />
    {index > 0 && (
      <MenuItem
        primaryText={messages.actions_moveUp}
        onClick={() => fields.move(index, index - 1)}
      />
    )}
    {index + 1 < fields.length && (
      <MenuItem
        primaryText={messages.actions_moveDown}
        onClick={() => fields.move(index, index + 1)}
      />
    )}
  </IconMenu>
)

const RelatedProduct = ({ settings, product, actions }) => {
  if (product) {
    const priceFormatted = helper.formatCurrency(product.price, settings)
    const imageUrl =
      product && product.images.length > 0 ? product.images[0].url : null
    const thumbnailUrl = helper.getThumbnailUrl(imageUrl, 100)
    return (
      <ProductShort
        id={product.id}
        name={product.name}
        thumbnailUrl={thumbnailUrl}
        priceFormatted={priceFormatted}
        enabled={product.enabled}
        discontinued={product.discontinued}
        actions={actions}
      />
    )
  }
  // product doesn't exist
  return (
    <ProductShort
      id="-"
      name=""
      thumbnailUrl=""
      priceFormatted=""
      actions={actions}
    />
  )
}

class ProductsArray extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showAddItem: false,
      products: [],
    }
  }

  showAddItem = () => {
    this.setState({ showAddItem: true })
  }

  hideAddItem = () => {
    this.setState({ showAddItem: false })
  }

  addItem = productId => {
    this.hideAddItem()
    this.props.fields.push(productId)
  }

  componentDidMount() {
    const ids = this.props.fields.getAll()
    this.fetchProducts(ids)
  }

  componentWillReceiveProps(nextProps) {
    const currentIds = this.props.fields.getAll()
    const newIds = nextProps.fields.getAll()

    if (currentIds !== newIds) {
      this.fetchProducts(newIds)
    }
  }

  fetchProducts = ids => {
    if (ids && Array.isArray(ids) && ids.length > 0) {
      api.products
        .list({
          limit: 50,
          fields:
            "id,name,enabled,discontinued,price,on_sale,regular_price,images",
          ids,
        })
        .then(productsResponse => {
          this.setState({ products: productsResponse.json.data })
        })
    } else {
      this.setState({
        products: [],
      })
    }
  }

  render() {
    const { settings, fields } = this.props
    const { products } = this.state

    return (
      <>
        <Paper className={style.relatedProducts} zDepth={1}>
          {fields.map((field, index) => {
            const actions = (
              <RelatedProductActions fields={fields} index={index} />
            )
            const productId = fields.get(index)
            const product = products.find(item => item.id === productId)
            return (
              <RelatedProduct
                key={index}
                settings={settings}
                product={product}
                actions={actions}
              />
            )
          })}

          <ProductSearchDialog
            open={this.state.showAddItem}
            title={messages.addOrderItem}
            settings={settings}
            onSubmit={this.addItem}
            onCancel={this.hideAddItem}
            submitLabel={messages.add}
            cancelLabel={messages.cancel}
          />
        </Paper>

        <>
          <RaisedButton
            label={messages.addOrderItem}
            onClick={this.showAddItem}
          />
        </>
      </>
    )
  }
}

const ProductAdditionalForm = ({
  handleSubmit,
  pristine,
  reset,
  submitting,
  initialValues,
  settings,
  categories,
}) => (
  <form onSubmit={handleSubmit}>
    <Paper className="paper-box" zDepth={1}>
      <div className={style.innerBox}>
        <div
          className="row middle-xs"
          style={{
            padding: "0 0 15px 0",
            borderBottom: "1px solid #e0e0e0",
            marginBottom: 20,
          }}
        >
          <div className="col-xs-12 col-sm-4">{messages.category}</div>
          <div className="col-xs-12 col-sm-8">
            <Field
              name="category_id"
              component={ProductCategorySelect}
              categories={categories}
            />
          </div>
        </div>

        <div
          className="row middle-xs"
          style={{
            padding: "0 0 15px 0",
            borderBottom: "1px solid #e0e0e0",
            marginBottom: 25,
          }}
        >
          <div className="col-xs-12 col-sm-4">
            {messages.additionalCategories}
          </div>
          <div className="col-xs-12 col-sm-8">
            <FieldArray
              name="category_ids"
              component={ProductCategoryMultiSelect}
              categories={categories}
            />
          </div>
        </div>

        <div
          className="row middle-xs"
          style={{ padding: "0 0 20px 0", borderBottom: "1px solid #e0e0e0" }}
        >
          <div className="col-xs-12 col-sm-4">{messages.tags}</div>
          <div className="col-xs-12 col-sm-8">
            <Field
              name="tags"
              component={TagsField}
              placeholder={messages.newTag}
            />
          </div>
        </div>

        <div
          className="row middle-xs"
          style={{ borderBottom: "1px solid #e0e0e0", marginBottom: 20 }}
        >
          <div className="col-xs-12 col-sm-4">{messages.position}</div>
          <div className="col-xs-12 col-sm-8">
            <Field
              name="position"
              component={TextField}
              floatingLabelText={messages.position}
              fullWidth={false}
              style={{ width: 128 }}
              type="number"
            />
          </div>
        </div>

        {messages.relatedProducts}
        <FieldArray
          name="related_product_ids"
          component={ProductsArray}
          settings={settings}
        />
      </div>
      <div
        className={`buttons-box ${
          pristine ? "buttons-box-pristine" : "buttons-box-show"
        }`}
      >
        <Button
          className={style.button}
          onClick={reset}
          disabled={pristine || submitting}
        >
          {messages.cancel}
        </Button>
        <Button
          type="submit"
          color="primary"
          className={style.button}
          disabled={pristine || submitting}
        >
          {messages.save}
        </Button>
      </div>
    </Paper>
  </form>
)

export default reduxForm({
  form: "ProductAdditionalForm",
  enableReinitialize: true,
})(ProductAdditionalForm)
