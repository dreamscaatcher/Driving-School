import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'

const Home        = lazy(() => import('./pages/Home'))
const Quiz        = lazy(() => import('./pages/Quiz'))
const ExamMode    = lazy(() => import('./pages/ExamMode'))
const Results     = lazy(() => import('./pages/Results'))
const Bookmarks   = lazy(() => import('./pages/Bookmarks'))
const ReviewWrong = lazy(() => import('./pages/ReviewWrong'))
const Login       = lazy(() => import('./pages/Login'))
const Profile     = lazy(() => import('./pages/Profile'))
const Leaderboard = lazy(() => import('./pages/Leaderboard'))

function App() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-gray-500">Loading…</div>}>
      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/quiz/:category" element={<Quiz />} />
        <Route path="/exam"           element={<ExamMode />} />
        <Route path="/results"        element={<Results />} />
        <Route path="/bookmarks"      element={<Bookmarks />} />
        <Route path="/review"         element={<ReviewWrong />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/profile"        element={<Profile />} />
        <Route path="/leaderboard"    element={<Leaderboard />} />
      </Routes>
    </Suspense>
  )
}

export default App
