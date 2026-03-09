import { Routes, Route } from 'react-router-dom'
import ConvitePage from './pages/ConvitePage'
import ConfirmacaoPage from './pages/ConfirmacaoPage'
import AdminPage from './pages/AdminPage'
import SucessoPage from './pages/SucessoPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ConvitePage />} />
      <Route path="/confirmar" element={<ConfirmacaoPage />} />
      <Route path="/sucesso" element={<SucessoPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}