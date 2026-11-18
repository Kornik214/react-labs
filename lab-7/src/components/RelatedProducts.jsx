import FavoriteButton from './FavoriteButton.jsx'
import { useShowMore } from '../hooks/useShowMore.js'

export default function RelatedProducts({ products }) {
  const { visibleItems, hiddenCount, showMore, collapse } = useShowMore(
    products,
    4,
  )
  const hasToggle = products.length > 4

  return (
    <section className="related" aria-labelledby="related-title">
      <h2 id="related-title">Схожі товари</h2>
      <ul className="related-list" aria-labelledby="related-title">
        {visibleItems.map((item) => (
          <li key={item.id} className="related-card">
            <h3>{item.name}</h3>
            <p>{item.notes}</p>
            <p className="price">{item.price} грн</p>
            <FavoriteButton productId={item.id} name={item.name} />
          </li>
        ))}
        {hasToggle && (
          <li className="related-more">
            <button
              type="button"
              onClick={hiddenCount > 0 ? showMore : collapse}
            >
              {hiddenCount > 0
                ? `Показати ще ${Math.min(4, hiddenCount)}`
                : 'Згорнути'}
            </button>
          </li>
        )}
      </ul>
    </section>
  )
}
