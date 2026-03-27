interface Props {
  label: string
  text: string
  state: 'default' | 'selected' | 'correct' | 'incorrect'
  onClick: () => void
  disabled: boolean
}

const stateStyles: Record<Props['state'], string> = {
  default:   'bg-white border-gray-200 text-gray-800 hover:border-blue-400 hover:bg-blue-50',
  selected:  'bg-blue-50 border-blue-500 text-blue-900',
  correct:   'bg-green-50 border-green-500 text-green-900',
  incorrect: 'bg-red-50 border-red-400 text-red-900',
}

const labelStyles: Record<Props['state'], string> = {
  default:   'bg-gray-100 text-gray-600',
  selected:  'bg-blue-500 text-white',
  correct:   'bg-green-500 text-white',
  incorrect: 'bg-red-400 text-white',
}

export default function OptionButton({ label, text, state, onClick, disabled }: Readonly<Props>) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        'w-full flex items-center gap-3 rounded-lg border-2 py-3 px-4 text-left',
        'transition-colors duration-150',
        stateStyles[state],
        disabled && state === 'default' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      {/* Label circle */}
      <span
        className={[
          'shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
          'transition-colors duration-150',
          labelStyles[state],
        ].join(' ')}
      >
        {label}
      </span>

      {/* Option text */}
      <span className="flex-1 text-sm font-medium">{text}</span>

      {/* Result icon */}
      {state === 'correct' && (
        <span className="shrink-0 text-green-500 text-lg font-bold">✓</span>
      )}
      {state === 'incorrect' && (
        <span className="shrink-0 text-red-400 text-lg font-bold">✗</span>
      )}
    </button>
  )
}
