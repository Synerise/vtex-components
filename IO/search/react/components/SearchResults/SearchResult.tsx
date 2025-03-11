import type { SearchResultType } from '../../typings/search'
import styles from './SearchResult.module.css'

export function SearchResult(props: SearchResultType) {
  return (
    <a
      href={props.link}
      className={`${styles.product__container} flex mw7 mt4 shadow-2 br2 overflow-hidden bg-white`}
    >
      <div className="h-100 bg-black-10">
        <img className="h-100 img" src={props.imageLink} />
      </div>
      <div className="flex flex-column ml4 pa3 w-100">
        <span>{props.title.slice(props.brand.length + 3)}</span>
        <span className="mt2 fw4 f5 black-50">{props.brand}</span>
        <span className="mt3 ml-auto">
          {`${(+props.price.value).toFixed(2).replace('.', ',')} ${
            props.price.currency
          }`}
        </span>
        <span className={`${styles.product__category} black-30`}>
          {props.category}
        </span>
      </div>
    </a>
  )
}
