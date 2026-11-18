import BrewGuide from '../../../features/brew-timer/components/BrewGuide.jsx'
import NotFound from '../../../components/NotFound.jsx'
import ProductCard from '../../components/ProductCard.jsx'
import RelatedProducts from '../../components/RelatedProducts.jsx'
import ReviewList from '../../../features/reviews/components/ReviewList.jsx'
import Tabs from '../../../components/Tabs.jsx'
import { beans } from '../../../data/beans.js'
import { brewMethods } from '../../../features/brew-timer/data/brewMethods.js'
import { reviews } from '../../../features/reviews/data/reviews.js'

export default function BeanPage({ beanId }) {
  const bean = beans.find((item) => item.id === beanId)
  if (!bean) return <NotFound />

  const beanReviews = reviews.filter((review) => review.beanId === bean.id)
  const related = beans.filter((item) => item.id !== bean.id)

  return (
    <>
      <ProductCard product={bean} />
      <Tabs defaultValue="brew">
        <Tabs.List aria-label="Про каву">
          <Tabs.Tab value="brew">Заварювання</Tabs.Tab>
          <Tabs.Tab value="reviews">Відгуки ({beanReviews.length})</Tabs.Tab>
          <Tabs.Tab value="related">Схожі товари</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="brew">
          <BrewGuide methods={brewMethods} />
        </Tabs.Panel>
        <Tabs.Panel value="reviews">
          <ReviewList reviews={beanReviews} />
        </Tabs.Panel>
        <Tabs.Panel value="related">
          <RelatedProducts products={related} />
        </Tabs.Panel>
      </Tabs>
    </>
  )
}
