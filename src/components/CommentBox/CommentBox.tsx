import { CommentEntity } from '@/src/gql/graphql'
import formatTimeRange from '@/src/utils/formatTimeRange'
import moment from 'moment'
import 'moment/locale/pl'
import { useSession } from 'next-auth/react'

import VisibilityIcon from '@mui/icons-material/Visibility'
import { useEffect, useState } from 'react'

interface CommentBoxProps {
  data: CommentEntity
  userId: string
  selected: boolean
  onSelect?: (id: string, timeRange: string) => void
}

const CommentBox = ({ data, userId, selected, onSelect }: CommentBoxProps) => {
  const formattedDate = moment(data.attributes?.createdAt).format('LLL')

  return (
    <div
      className={` flex flex-col gap-y-1 shadow-md p-3
        w-full md:w-[40rem] ${
          userId === data.attributes?.user?.data?.id && 'bg-pink-100'
        } ${selected && ' outline -outline-offset-2 outline-pink-700'}`}
      onClick={() => {
        if (!selected && onSelect && data.attributes && data.id) {
          onSelect(data.id, data.attributes.timeRange)
        }
      }}>
      <div className=" flex flex-row items-end justify-between border-b-2 border-neutral-300">
        <span className=" font-bold text-lg text-pink-700">
          {data.attributes?.user?.data?.attributes?.username}
        </span>

        <span className=" hidden sm:inline text-neutral-500">
          Dodano {formattedDate}
        </span>
      </div>

      <span className=" flex flex-row items-center text-neutral-500">
        Zakres czasu:{'   '}
        <span className=" font-bold">
          {data.attributes && formatTimeRange(data.attributes.timeRange)}
        </span>
        <VisibilityIcon className=" ml-1 hover:text-neutral-600 cursor-pointer" />
      </span>

      <span>{data.attributes?.content}</span>

      <span className=" sm:hidden text-neutral-500">
        Dodano {formattedDate}
      </span>
    </div>
  )
}

export default CommentBox
