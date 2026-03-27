import { useEffect, useMemo, useState } from 'react'
import { loadStoredStaff } from '../data/staff'

const ATTENDANCE_STORAGE_KEY = 'pos-system-attendance-logs'
const ACTIVE_ATTENDANCE_STORAGE_KEY = 'pos-system-active-attendance-sessions'

function loadAttendanceLogs() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(ATTENDANCE_STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function loadActiveSessions() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(ACTIVE_ATTENDANCE_STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function formatDateTime(timestamp) {
  return new Date(timestamp).toLocaleString()
}

function StaffAttendancePage({ onLogout }) {
  const [staffMembers, setStaffMembers] = useState(() => loadStoredStaff())
  const [activeSessions, setActiveSessions] = useState(() => loadActiveSessions())
  const [logs, setLogs] = useState(() => loadAttendanceLogs())
  const [codeInput, setCodeInput] = useState('')
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [codeError, setCodeError] = useState('')

  useEffect(() => {
    setStaffMembers(loadStoredStaff())
  }, [])

  useEffect(() => {
    window.localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(logs))
  }, [logs])

  useEffect(() => {
    window.localStorage.setItem(ACTIVE_ATTENDANCE_STORAGE_KEY, JSON.stringify(activeSessions))
  }, [activeSessions])

  useEffect(() => {
    const allowedIds = new Set(staffMembers.map((staff) => staff.id))
    setActiveSessions((prevSessions) =>
      prevSessions.filter((session) => allowedIds.has(session.staffId))
    )
  }, [staffMembers])

  const sortedLogs = useMemo(
    () => [...logs].sort((a, b) => Number(b.timeInAt) - Number(a.timeInAt)),
    [logs]
  )

  const activeSessionByStaffId = useMemo(() => {
    const sessionMap = new Map()
    activeSessions.forEach((session) => {
      sessionMap.set(session.staffId, session)
    })
    return sessionMap
  }, [activeSessions])

  function handleTimeIn(staff) {
    const hasActiveSession = activeSessionByStaffId.has(staff.id)
    if (hasActiveSession) {
      return
    }

    const now = Date.now()
    setActiveSessions((prevSessions) => [
      {
        staffId: staff.id,
        name: staff.name,
        code: staff.code,
        timeInAt: now,
      },
      ...prevSessions,
    ])
  }

  function handleTimeOut(staffId) {
    const activeSession = activeSessionByStaffId.get(staffId)
    if (!activeSession) {
      return
    }

    const now = Date.now()
    const durationMs = now - Number(activeSession.timeInAt)

    const record = {
      id: `ATT-${now}`,
      staffId: activeSession.staffId,
      name: activeSession.name,
      code: activeSession.code,
      timeInAt: activeSession.timeInAt,
      timeOutAt: now,
      durationMinutes: Math.max(1, Math.round(durationMs / 60000)),
    }

    setLogs((prevLogs) => [record, ...prevLogs])
    setActiveSessions((prevSessions) =>
      prevSessions.filter((session) => session.staffId !== staffId)
    )
  }

  function handleCodeSubmit() {
    setCodeError('')
    const trimmedCode = codeInput.trim().toUpperCase()

    if (!trimmedCode) {
      setCodeError('Please enter a staff code')
      return
    }

    const staff = staffMembers.find((s) => s.code.toUpperCase() === trimmedCode)
    if (!staff) {
      setCodeError('Staff code not found')
      setCodeInput('')
      return
    }

    setSelectedStaff(staff)
    setCodeInput('')
  }

  function handleClear() {
    setSelectedStaff(null)
    setCodeInput('')
    setCodeError('')
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#eef2ff] px-4 py-8 font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <section className="w-full max-w-[860px] rounded-2xl border border-[#dbe3f3] bg-white p-5 shadow-sm md:p-7">
        <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-[1.55rem] font-bold text-[#0f2542]">Staff Attendance</h1>
            <p className="text-[0.9rem] text-[#64748b]">Record Time In and Time Out for your staff.</p>
          </div>

          <button
            onClick={onLogout}
            className="rounded-lg border border-[#d4dae6] px-3 py-2 text-[0.84rem] font-semibold text-[#334155] hover:bg-[#f8fafc]"
          >
            Back to Role Selection
          </button>
        </header>

        <div className="mb-5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
          <h2 className="mb-3 text-[1rem] font-bold text-[#0f2542]">Staff Time Clock</h2>

          {!selectedStaff ? (
            <div className="space-y-3">
              <div>
                <label className="mb-2 block text-[0.85rem] font-medium text-[#334155]">Enter Your Staff Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={codeInput}
                    onChange={(e) => {
                      setCodeInput(e.target.value.toUpperCase())
                      setCodeError('')
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCodeSubmit()
                      }
                    }}
                    placeholder="e.g., STF-001"
                    className="flex-1 rounded-lg border border-[#cbd5e1] px-3 py-2 text-[0.9rem] focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#dbeafe]"
                  />
                  <button
                    onClick={handleCodeSubmit}
                    className="rounded-lg bg-[#2563eb] px-4 py-2 text-[0.85rem] font-semibold text-white hover:bg-[#1d4ed8]"
                  >
                    Submit
                  </button>
                </div>
                {codeError && <p className="mt-2 text-[0.8rem] text-[#dc2626]">{codeError}</p>}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
              {(() => {
                const session = activeSessionByStaffId.get(selectedStaff.id)
                const isActive = Boolean(session)
                return isActive ? (
                  <div className="mb-4 rounded-lg border border-[#fca5a5] bg-[#ffe5e5] p-3">
                    <p className="text-center text-[0.9rem] font-bold text-[#991b1b]">⏱️ Already Timed In</p>
                  </div>
                ) : null
              })()}

              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-[0.8rem] text-[#64748b]">Staff Code</p>
                  <p className="text-[1.2rem] font-bold text-[#0f2542]">{selectedStaff.code}</p>
                </div>
                <div>
                  <p className="text-[0.8rem] text-[#64748b]">Name</p>
                  <p className="text-[1.2rem] font-bold text-[#0f2542]">{selectedStaff.name}</p>
                </div>
              </div>

              <div className="mb-4 rounded-lg bg-[#f8fafc] p-3">
                {(() => {
                  const session = activeSessionByStaffId.get(selectedStaff.id)
                  const isActive = Boolean(session)
                  return (
                    <div>
                      <p className="text-[0.8rem] text-[#64748b]">Current Status</p>
                      <span
                        className={`mt-1 inline-block rounded-full px-3 py-1 text-[0.8rem] font-semibold ${
                          isActive
                            ? 'bg-[#dcfce7] text-[#166534]'
                            : 'bg-[#e2e8f0] text-[#475569]'
                        }`}
                      >
                        {isActive ? 'Currently Timed In' : 'Timed Out'}
                      </span>
                      {isActive && (
                        <p className="mt-2 text-[0.82rem] text-[#64748b]">
                          Time In: <span className="font-semibold text-[#0f2542]">{formatDateTime(session.timeInAt)}</span>
                        </p>
                      )}
                    </div>
                  )
                })()}
              </div>

              <div className="flex gap-2">
                {(() => {
                  const session = activeSessionByStaffId.get(selectedStaff.id)
                  const isActive = Boolean(session)
                  return isActive ? (
                    <button
                      onClick={() => {
                        handleTimeOut(selectedStaff.id)
                        handleClear()
                      }}
                      className="flex-1 rounded-lg bg-[#ea580c] px-4 py-2.5 text-[0.9rem] font-semibold text-white hover:bg-[#c2410c]"
                    >
                      Time Out
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleTimeIn(selectedStaff)
                        handleClear()
                      }}
                      className="flex-1 rounded-lg bg-[#2563eb] px-4 py-2.5 text-[0.9rem] font-semibold text-white hover:bg-[#1d4ed8]"
                    >
                      Time In
                    </button>
                  )
                })()}
                <button
                  onClick={handleClear}
                  className="rounded-lg border border-[#d4dae6] px-4 py-2.5 text-[0.9rem] font-semibold text-[#334155] hover:bg-[#f8fafc]"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mb-5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
          <h2 className="mb-3 text-[1rem] font-bold text-[#0f2542]">Staff Currently Timed In</h2>
          {activeSessions.length === 0 ? (
            <p className="rounded-lg border border-dashed border-[#cbd5e1] p-3 text-[0.85rem] text-[#64748b]">
              No staff currently timed in.
            </p>
          ) : (
            <div className="space-y-2">
              {activeSessions.map((session) => (
                <div key={session.staffId} className="flex items-center justify-between rounded-lg border border-[#e2e8f0] bg-white p-3">
                  <div>
                    <p className="text-[0.8rem] text-[#64748b]">Code</p>
                    <p className="font-semibold text-[#0f2542]">{session.code}</p>
                  </div>
                  <div>
                    <p className="text-[0.8rem] text-[#64748b]">Name</p>
                    <p className="font-semibold text-[#0f2542]">{session.name}</p>
                  </div>
                  <div>
                    <p className="text-[0.8rem] text-[#64748b]">Timed In</p>
                    <p className="text-[0.85rem] font-semibold text-[#166534]">{formatDateTime(session.timeInAt)}</p>
                  </div>
                  <span className="rounded-full bg-[#dcfce7] px-3 py-1 text-[0.75rem] font-semibold text-[#166534]">
                    Active
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-2 text-[1rem] font-bold text-[#0f2542]">Attendance Logs</h2>
          {sortedLogs.length === 0 ? (
            <p className="rounded-lg border border-dashed border-[#cbd5e1] p-4 text-[0.86rem] text-[#64748b]">
              No attendance logs yet.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-[#e2e8f0]">
              <table className="w-full min-w-[680px] border-collapse text-left text-[0.84rem]">
                <thead className="bg-[#f8fafc] text-[#334155]">
                  <tr>
                    <th className="border-b border-[#e2e8f0] px-3 py-2 font-semibold">Code</th>
                    <th className="border-b border-[#e2e8f0] px-3 py-2 font-semibold">Staff</th>
                    <th className="border-b border-[#e2e8f0] px-3 py-2 font-semibold">Time In</th>
                    <th className="border-b border-[#e2e8f0] px-3 py-2 font-semibold">Time Out</th>
                    <th className="border-b border-[#e2e8f0] px-3 py-2 font-semibold">Minutes Worked</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLogs.map((record) => (
                    <tr key={record.id} className="text-[#0f172a] even:bg-[#fcfdff]">
                      <td className="border-b border-[#eef2f7] px-3 py-2">{record.code ?? '-'}</td>
                      <td className="border-b border-[#eef2f7] px-3 py-2">{record.name}</td>
                      <td className="border-b border-[#eef2f7] px-3 py-2">{formatDateTime(record.timeInAt)}</td>
                      <td className="border-b border-[#eef2f7] px-3 py-2">{formatDateTime(record.timeOutAt)}</td>
                      <td className="border-b border-[#eef2f7] px-3 py-2">{record.durationMinutes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default StaffAttendancePage
