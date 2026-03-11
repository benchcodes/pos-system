import { BoxIcon, CartIcon, ShieldIcon } from './icons/Icons'

const iconByName = {
  cart: CartIcon,
  box: BoxIcon,
  shield: ShieldIcon,
}

function RoleIcon({ name }) {
  // Get the matching component from the map (if it exists).
  const IconComponent = iconByName[name]

  if (!IconComponent) {
    return null
  }

  return <IconComponent />
}

export default RoleIcon
