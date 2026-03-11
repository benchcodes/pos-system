import { useState } from 'react'
import RoleCard from './components/RoleCard'
import { roles } from './data/roles'
import CashierPage from './pages/CashierPage'

function App() {
  const [currentPage, setCurrentPage] = useState(null)

  // Show the Cashier page when that role is selected
  if (currentPage === 'cashier') {
    return <CashierPage onLogout={() => setCurrentPage(null)} />
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#e6ecf7] px-4 py-8 font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <section className="w-full max-w-[980px]">
        <header className="mb-5 text-center max-[900px]:mb-4">
          <h1 className="m-0 text-[clamp(2rem,4vw,2.35rem)] leading-tight font-bold text-[#0f2542]">
            POS System
          </h1>
          <p className="mt-[0.35rem] text-[0.95rem] text-[#50607e]">Select your role to continue</p>
        </header>

        <div className="grid gap-4 min-[901px]:grid-cols-3 max-[900px]:mx-auto max-[900px]:max-w-[360px]">
          {roles.map((role) => (
            <RoleCard
              key={role.title}
              role={role}
              onSelect={() => role.title === 'Cashier' && setCurrentPage('cashier')}
            />
          ))}
        </div>

        <footer className="mt-[1.05rem] text-center text-[0.82rem] text-[#7b89a1]">
          Demo System - Click any role to access
        </footer>
      </section>
    </main>
  )
}

export default App
