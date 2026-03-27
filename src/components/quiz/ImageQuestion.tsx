import type { QuestionImage } from '../../types/question'

interface Props {
  image: QuestionImage
}

export default function ImageQuestion({ image }: Props) {
  const isSign = image.type === 'sign'

  return (
    <div className="flex flex-col items-center gap-2 mb-4">
      <div
        className={
          isSign
            ? 'flex items-center justify-center bg-gray-100 rounded-2xl p-4 w-[200px] h-[200px]'
            : 'w-full'
        }
      >
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          className={
            isSign
              ? 'max-w-full max-h-full object-contain'
              : 'w-full max-h-[300px] object-cover rounded-lg'
          }
        />
      </div>
      <p className="text-xs text-gray-400 text-center">{image.alt}</p>
    </div>
  )
}
