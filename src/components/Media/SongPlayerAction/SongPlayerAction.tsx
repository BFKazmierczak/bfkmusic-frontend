import { useEffect, useRef, useState } from 'react'

import IconButton from '../../Buttons/IconButton'
import SongPlayer, { SongPlayerProps } from '../SongPlayer/SongPlayer'

import AddCommentIcon from '@mui/icons-material/AddComment'
import CommentBox from '../../CommentBox/CommentBox'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet'

import useHighlightStore from '../../../stores/highlightStore'
import { Modal } from '@mui/material'
import { useSession } from 'next-auth/react'
import { gql, useMutation } from '@apollo/client'
import { CommentEntity, UploadFileEntity } from '@/src/gql/graphql'
import { graphql } from '@/src/gql'
import Waveform from '../Waveform/Waveform'
import useGlobalPlayerStore from '@/src/stores/globalPlayerStore'
import formatTime from '@/src/utils/formatTime'

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

export interface CommentRange {
  start: number
  end: number
}

interface SongPlayerActionProps extends SongPlayerProps {}

const SongPlayerAction = ({
  audioIndex = 0,
  ...props
}: SongPlayerActionProps) => {
  const session = useSession()

  const {
    songData,
    pause,
    playing,
    playSong,
    changeTime,
    currentTime,
    source
  } = useGlobalPlayerStore()

  const { setHighlight } = useHighlightStore()

  const commentContainerRef = useRef<HTMLDivElement>(null)
  const waveformContainerRef = useRef<HTMLDivElement>(null)

  const [comments, setComments] = useState<CommentEntity[]>(() => {
    const data = props.song.attributes?.comments?.data
    if (data) return data
    else return []
  })

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedComment, setSelectedComment] = useState<string>()

  const [commentValue, setCommentValue] = useState<string>('')

  const [scrollPosition, setScrolLPosition] = useState<number>(0)

  const [rangeSelection, setRangeSelection] = useState<boolean>(false)

  const [commentRange, setCommentRange] = useState<CommentRange>({
    start: 0,
    end: 0
  })
  const [rangeSelected, setRangeSelected] = useState<boolean>(false)

  const peaks =
    props.song.attributes?.audio?.data[audioIndex].attributes?.waveform?.data
      ?.attributes?.peaks

  const file = props.song.attributes?.audio?.data[
    audioIndex
  ] as UploadFileEntity

  const duration = props.song.attributes?.audio?.data[audioIndex].attributes
    ?.duration as number

  const [createComment] = useMutation(CREATE_SONG_COMMENT, {
    onCompleted: (data) => {
      const newComment = data.createComment?.data

      if (newComment) {
        setComments((prev) => {
          if (prev.length === 0) return [newComment as CommentEntity]
          else return [newComment as CommentEntity, ...prev]
        })
      }
    }
  })

  useEffect(() => {
    if (comments) {
      commentContainerRef.current?.scrollTo({ top: 0 })
    }
  }, [comments])

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
      <SongPlayer {...props} audioIndex={audioIndex}>
        <div className=" flex flex-row">
          <IconButton
            icon={<AddCommentIcon />}
            onClick={() => {
              setModalOpen(true)
            }}
          />
        </div>
      </SongPlayer>

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setHighlight([undefined, undefined])
        }}>
        <>
          <div
            className={` absolute inset-5 p-5 bg-white border-2 border-gray-500 shadow-xl ${
              modalOpen ? 'bg-opacity-100' : 'bg-opacity-0'
            } overflow-y-auto transition-all ease-in-out`}>
            {peaks && (
              <div
                className=" relative w-full sm:w-[600px] lg:w-[800px]"
                ref={waveformContainerRef}>
                <Waveform
                  totalTime={duration}
                  currentTime={currentTime}
                  peaks={peaks}
                  selecting={rangeSelection}
                  rangeSelected={rangeSelected}
                  onTimeChange={changeTime}
                  onScroll={(left) => {
                    if (waveformContainerRef.current) {
                      waveformContainerRef.current.scrollBy({
                        left,
                        behavior: 'smooth'
                      })
                    }
                  }}
                  onRangeUpdate={(newRange) => {
                    setCommentRange(newRange)
                  }}
                />
              </div>
            )}

            <SongPlayer {...props} size="small" />
            <div className=" flex flex-col gap-y-5 mt-5">
              <div className=" flex flex-col gap-y-2">
                <textarea
                  className=" basic-input w-full resize-none"
                  rows={2}
                  placeholder="Napisz komentarz..."
                  value={commentValue}
                  onChange={(event) => setCommentValue(event.target.value)}
                />

                <div className=" flex flex-col gap-y-1">
                  <span
                    className=" flex justify-center items-center z-[40] px-1 gap-x-1 text-white bg-pink-500 cursor-pointer"
                    onClick={() => {
                      setRangeSelection((prev) => !prev)
                      setRangeSelected(true)
                    }}>
                    {rangeSelection ? (
                      'Zatwierdź zakres'
                    ) : (
                      <>
                        <SettingsEthernetIcon /> Zakres komentarza
                      </>
                    )}
                  </span>

                  <div className=" flex gap-x-1 justify-between z-[40] bg-white">
                    <span className=" flex z-[40]">
                      Od: {formatTime(commentRange.start)}
                    </span>

                    <span className=" flex z-[40]">
                      Do: {formatTime(commentRange.end)}
                    </span>
                  </div>
                </div>

                <button
                  className=" basic-button"
                  disabled={commentValue.length === 0}
                  onClick={handleCreateComment}>
                  Dodaj komentarz
                </button>
              </div>

              <div className=" flex flex-col gap-y-2">
                <span className=" font-bold text-lg">Dyskusja</span>

                <div className=" flex justify-center">
                  <div
                    className=" relative flex flex-col sm:items-center gap-y-5 w-full sm:w-fit h-[50vh] overflow-y-auto"
                    ref={commentContainerRef}
                    onScroll={(event) =>
                      setScrolLPosition(event.target.scrollTop)
                    }>
                    {commentContainerRef.current &&
                      comments.length > 1 &&
                      commentContainerRef.current?.scrollTop > 0 && (
                        <div className=" sticky flex justify-center items-center top-0 w-full bg-neutral-100 text-neutral-500 shadow-xl">
                          <ArrowDropUpIcon style={{ fontSize: '1rem' }} />
                        </div>
                      )}

                    {comments
                      .toSorted((a, b) => {
                        if (a.attributes?.createdAt > b.attributes?.createdAt)
                          return -1
                        else if (
                          a.attributes?.createdAt < b.attributes?.createdAt
                        )
                          return 1
                        else return 0
                      })
                      .map((comment, index) => {
                        return (
                          <CommentBox
                            data={comment}
                            userId={session.data?.user?.id}
                            selected={comment.id === selectedComment}
                            onSelect={(id, timeRange) => {
                              setSelectedComment(id)
                              setHighlight([timeRange, Number(file.id)])
                            }}
                          />
                        )
                      })}

                    {commentContainerRef.current &&
                      comments.length > 1 &&
                      commentContainerRef.current?.scrollTop !==
                        commentContainerRef.current.scrollHeight -
                          commentContainerRef.current.clientHeight && (
                        <div className=" sticky flex justify-center items-center bottom-0 w-full bg-neutral-100 text-neutral-500">
                          <ArrowDropDownIcon style={{ fontSize: '1rem' }} />
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={` ${
              rangeSelection ? 'visible' : 'hidden'
            } fixed inset-0 z-[30] bg-black bg-opacity-75 w-full h-full`}
          />
        </>
      </Modal>
    </>
  )
}

export default SongPlayerAction
