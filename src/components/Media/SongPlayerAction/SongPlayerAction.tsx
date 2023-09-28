import { useEffect, useState } from 'react'

import IconButton from '../../Buttons/IconButton'
import SongPlayer, { SongPlayerProps } from '../SongPlayer/SongPlayer'

import AddCommentIcon from '@mui/icons-material/AddComment'
import CommentBox from '../../CommentBox/CommentBox'
import useGlobalStore from '../../GlobalStore/zustand'
import { Modal } from '@mui/material'
import { useSession } from 'next-auth/react'
import { gql, useMutation } from '@apollo/client'
import { CommentEntity } from '@/src/gql/graphql'
import { graphql } from '@/src/gql'

const CREATE_SONG_COMMENT = graphql(`
  mutation CreateComment(
    $content: String!
    $songId: Int!
    $fileId: Int!
    $timeRange: TimeRange!
  ) {
    createComment(
      data: {
        content: $content
        songId: $songId
        fileId: $fileId
        timeRange: $timeRange
      }
    ) {
      data {
        id
        attributes {
          content
          fileId
          timeRange
          user {
            data {
              id
              attributes {
                username
              }
            }
          }
        }
      }
    }
  }
`)

interface SongPlayerActionProps extends SongPlayerProps {}

const SongPlayerAction = ({
  audioIndex = 0,
  ...props
}: SongPlayerActionProps) => {
  const session = useSession()

  const { setHighlight } = useGlobalStore()

  const [comments, setComments] = useState<CommentEntity[]>(() => {
    const data = props.song.attributes?.comments?.data
    if (data) return data
    else return []
  })

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedComment, setSelectedComment] = useState<string>()

  const [commentValue, setCommentValue] = useState<string>('')

  const [createComment] = useMutation(CREATE_SONG_COMMENT, {
    onCompleted: (data) => {
      const newComment = data.createComment?.data

      if (newComment) {
        setComments((prev) => {
          if (prev.length === 0) return [newComment as CommentEntity]
          else return [...prev, newComment as CommentEntity]
        })
      }
    }
  })

  function handleCreateComment(event: React.MouseEvent<HTMLButtonElement>) {
    const songId = props.song.id as string
    const fileId = props.song.attributes?.audio?.data[audioIndex].id

    createComment({
      variables: {
        content: commentValue,
        songId: Number(songId),
        fileId: Number(fileId),
        timeRange: { from: 30, to: 40 }
      }
    })
  }

  return (
    <>
      <SongPlayer {...props}>
        <div className=" flex flex-row">
          <IconButton
            icon={<AddCommentIcon />}
            onClick={() => {
              setModalOpen(true)
            }}
          />
        </div>
      </SongPlayer>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div
          className={` absolute inset-5 p-5 bg-white border-2 border-gray-500 shadow-xl ${
            modalOpen ? 'bg-opacity-100' : 'bg-opacity-0'
          } transition-all ease-in-out`}>
          <SongPlayer {...props} />

          <div className=" flex flex-col gap-y-5 mt-5">
            <div className=" flex flex-col gap-y-2">
              <textarea
                className=" basic-input w-full resize-none"
                rows={3}
                placeholder="Napisz komentarz..."
                value={commentValue}
                onChange={(event) => setCommentValue(event.target.value)}
              />

              <button
                className=" basic-button"
                disabled={commentValue.length === 0}
                onClick={handleCreateComment}>
                Dodaj komentarz
              </button>
            </div>

            <div className=" flex flex-col gap-y-2">
              <span className=" font-bold text-lg">Dyskusja</span>

              <div className=" flex flex-col-reverse sm:items-center gap-y-5 h-[30vh] overflow-auto">
                {comments.map((comment) => {
                  return (
                    <CommentBox
                      data={comment}
                      userId={session.data?.user.user.id}
                      selected={comment.id === selectedComment}
                      onSelect={(id, timeRange) => {
                        setSelectedComment(id)
                        setHighlight(timeRange)
                      }}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default SongPlayerAction
