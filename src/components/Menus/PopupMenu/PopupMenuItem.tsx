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
        <Link className=" px-2 py-1 bg-neutral-400 cursor-pointer" href={href}>
          {text}
        </Link>
      )}

      {onClick && (
        <div
          className=" px-2 py-1 bg-neutral-400 cursor-pointer"
          onClick={onClick}>
          {text}
        </div>
      )}
    </>
  )
}

export default PopupMenuItem
