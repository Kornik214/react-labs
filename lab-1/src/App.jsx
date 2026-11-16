import ProfileCard from './components/ProfileCard.jsx'

const technologies = ['React Hooks', 'React Router', 'TanStack Query']

function App() {
  return (
    <main className="page">
      <ProfileCard name="Назар" group="<311>" technologies={technologies} />
    </main>
  )
}

export default App
