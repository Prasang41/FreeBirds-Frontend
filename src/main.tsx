import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import Layout from './Layout'
import Home from './components/Home/Home'
import Jobs from './components/Jobs/Jobs'
import Profile from './components/User/User'
import Login from './components/Login/Login'
import Register from './components/Login/Register'
import Job from './components/Job/Job'
import Proposal from './components/Proposal/Proposal'
import Choosing from './components/Proposal/Choosing'
import Contract from './components/Contract/Contract'
import ErrorPage from './components/ErrorPage'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />} errorElement={<ErrorPage />}>

      {/* Public home — no id, shows about + job previews */}
      <Route path='' element={<Register />} />
      <Route path='login' element={<Login />} />

      {/* Home with user id */}
      <Route path='home/:id' element={<Home />}>
        <Route path='job/:jobId' element={<Job />} />
      </Route>

      {/* Also allow /home without id so logged-out users don't 404 */}
      <Route path='home' element={<Home />}>
        <Route path='job/:jobId' element={<Job />} />
      </Route>

      <Route path='proposal/:id' element={<Proposal />}>
        <Route path='particular-proposal/:proposalId' element={<Choosing />} />
      </Route>

      <Route path='contract/:id' element={<Contract />} />

      <Route path='jobs/:id' element={<Jobs />}>
        <Route path='job/:jobId' element={<Job />} />
      </Route>

      <Route path='user/:id' element={<Profile />} />

      {/* Catch-all — anything unknown shows ErrorPage */}
      <Route path='*' element={<ErrorPage />} />
    </Route>
  )
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)