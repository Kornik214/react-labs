import { useState } from 'react'
import './ProfileCard.css'

function ProfileCard({ name, group, technologies }) {
  const [clickCount, setClickCount] = useState(0)

  return (
    <article className="profile-card" aria-labelledby="profile-title">
      <h1 id="profile-title">Про мене</h1>
      <dl className="profile-card__details">
        <div>
          <dt>Ім’я</dt>
          <dd>{name}</dd>
        </div>
        <div>
          <dt>Група</dt>
          <dd>{group}</dd>
        </div>
      </dl>
      <h2 className="profile-card__subtitle">Технології, які хочу опанувати</h2>
      <ul className="profile-card__technologies">
        {technologies.map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>
      <div className="profile-card__actions">
        <button
          className="profile-card__button"
          type="button"
          onClick={() => setClickCount((count) => count + 1)}
        >
          Подобається
        </button>
        <p className="profile-card__count" aria-live="polite">
          Натискань: {clickCount}
        </p>
      </div>
    </article>
  )
}

export default ProfileCard
