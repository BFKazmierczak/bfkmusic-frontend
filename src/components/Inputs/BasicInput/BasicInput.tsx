import { ChangeEvent, HTMLInputTypeAttribute, useCallback } from 'react'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

interface BasicInputProps {
  className?: string
  placeholder?: string
  error?: boolean
  value?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: ChangeEvent<HTMLInputElement>) => void
  type?: HTMLInputTypeAttribute | undefined
}

const BasicInput = ({
  className,
  placeholder,
  error,
  value,
  onChange,
  onBlur,
  type,
  ...props
}: BasicInputProps) => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(event)
    },
    [onChange]
  )

  return (
    <div className=" relative flex flex-row items-center gap-x-5">
      <input
        className={` basic-input ${className}`}
        placeholder={placeholder || 'Wprowadź tekst'}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        type={type}
      />
      <p className=" absolute -right-10 text-pink-600">
        {error && <ErrorOutlineIcon style={{ fontSize: 32 }} />}
      </p>
    </div>
  )
}

export default BasicInput
