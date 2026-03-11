import RoleIcon from './RoleIcon'

const iconAccentClasses = {
  blue: 'bg-[#dbe8ff] text-[#2563eb]',
  green: 'bg-[#d7f7e4] text-[#16a34a]',
  purple: 'bg-[#eadffd] text-[#9333ea]',
}

const buttonAccentClasses = {
  blue: 'bg-[#2563eb]',
  green: 'bg-[#16a34a]',
  purple: 'bg-[#9333ea]',
}

const cardClassName =
  'flex min-h-[255px] flex-col items-center rounded-xl border border-[#d6ddea] bg-white px-4 pt-5 pb-4 text-center'

const iconWrapperBaseClassName =
  'mb-[0.95rem] grid size-[62px] place-items-center rounded-full [&_svg]:size-7 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] [&_svg]:[stroke-width:1.8]'

const titleClassName = 'mb-2 text-[1.4rem] leading-tight font-bold text-[#0f2542]'
const descriptionClassName = 'min-h-[2.6em] text-[0.86rem] text-[#60708e]'
const buttonBaseClassName =
  'mt-auto cursor-pointer rounded-[0.45rem] border-none px-[0.95rem] py-[0.62rem] text-[0.9rem] font-semibold text-white'

function RoleCard({ role, onSelect }) {
  // Use a safe fallback so UI still renders if accent is missing.
  const iconAccentClassName = iconAccentClasses[role.accent] ?? iconAccentClasses.blue
  const buttonAccentClassName = buttonAccentClasses[role.accent] ?? buttonAccentClasses.blue

  return (
    <article className={cardClassName}>
      <div
        className={`${iconWrapperBaseClassName} ${iconAccentClassName}`}
        aria-hidden="true"
      >
        <RoleIcon name={role.icon} />
      </div>

      <h2 className={titleClassName}>{role.title}</h2>
      <p className={descriptionClassName}>{role.description}</p>
      <button type="button" onClick={onSelect} className={`${buttonBaseClassName} ${buttonAccentClassName}`}>
        {role.buttonText}
      </button>
    </article>
  )
}

export default RoleCard
