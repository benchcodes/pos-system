export const STAFF_STORAGE_KEY = 'pos-system-staff-members'

export function loadStoredStaff() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const rawValue = window.localStorage.getItem(STAFF_STORAGE_KEY)
    if (!rawValue) {
      return []
    }

    const parsedValue = JSON.parse(rawValue)
    if (!Array.isArray(parsedValue)) {
      return []
    }

    return parsedValue.filter((staff) =>
      staff && typeof staff.id === 'string' && typeof staff.name === 'string' && typeof staff.code === 'string'
    )
  } catch {
    return []
  }
}

export function getNextStaffCode(staffMembers) {
  const maxCode = staffMembers.reduce((maxValue, member) => {
    const digits = String(member.code).replace(/\D/g, '')
    const parsed = Number(digits)
    if (!Number.isInteger(parsed) || parsed <= maxValue) {
      return maxValue
    }

    return parsed
  }, 0)

  return `STF-${String(maxCode + 1).padStart(3, '0')}`
}
