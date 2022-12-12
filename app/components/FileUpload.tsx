'use client'

import { ChangeEvent, Dispatch, SetStateAction, useState } from "react"

interface IFileUploadProps<T> {
  setFile: Dispatch<SetStateAction<T>>
}

export default function FileUpload<T>({ setFile }: IFileUploadProps<T>) {

  const [input, setInput] = useState<File | null>(null)

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => setInput(e.target?.files?.item(0) ?? null)

  const upload = () => {
    let reader = new FileReader()

    if (!input) {
      return
    }

    reader.onload = (e) => {
      let text = e.target?.result as string
      let json = JSON.parse(text)

      setFile(json as T)
    }
    reader.readAsText(input)
  }

  return (
    <div className="flex space-x-2 items-center">
      <input className="block w-full h-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" onChange={handleChange} />
      <button className="bg-blue-500 px-3 h-full rounded-md hover:opacity-75 transition-opacity" onClick={upload}>Upload</button>
    </div>
  )
}