import Link from 'next/link'

type PopupMenuItem = {
  text: string
} & (
  | {
      onClick?: () => void
      href?: never
    }
  | {
      href?: string
      onClick?: never
    }
)

const PopupMenuItem = ({ text, href, onClick }: PopupMenuItem) => {
  return (
    <>
      {href && (
        <Link
          className=" px-2 py-1 text-pink-600 hover:text-white hover:font-bold hover:bg-pink-600 cursor-pointer"
          href={href}>
          {text}
        </Link>
      )}

      {onClick && (
        <div
          className=" px-2 py-1 text-pink-600 hover:text-white hover:font-bold hover:bg-pink-600 cursor-pointer"
          onClick={onClick}>
          {text}
        </div>
      )}
    </>
  )
}

export default PopupMenuItem
