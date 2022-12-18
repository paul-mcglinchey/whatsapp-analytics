'use client'

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import FileUpload from "./components/FileUpload";
import { colours } from "./config/colours";
import chatConverter from "./services/chat-converter";
import { IMessage } from "./models/message.model";
import { getSenders, getTotalMessageFrequencies } from "./services/data-collectors";
import { ISender } from "./models/data.model";
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { Transition } from "@headlessui/react";
import SenderMultiSelect from "./components/SenderMultiSelect";

export default function Page() {

  const [messages, setMessages] = useState<IMessage[]>([])
  const [senders, setSenders] = useState<ISender[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [configOpen, setConfigOpen] = useState<boolean>(true)

  const toggleConfigOpen = () => setConfigOpen(!configOpen)

  const generateColour = (): string => {
    return colours[Math.floor(Math.random() * colours.length)] || "#f43f5e";
  }

  useEffect(() => {
    let localData = localStorage.getItem("messages")

    if (localData) {
      setMessages(JSON.parse(localData))
    }
  }, [])

  return (
    <>
      <div className="px-5 pt-2 flex justify-between">
        <div>
          <h1 className="text-blue-500 text-3xl font-bold tracking-wider">Bonjourno, friendo</h1>
        </div>
        <div>
          <FileUpload setFile={setMessages} localStorageKey="messages" converter={chatConverter} />
        </div>
      </div>
      {messages.length > 0 ? (
        <div className="px-5 pt-2">
          <div className="flex justify-end">
            <button type="button" onClick={toggleConfigOpen} className="flex">
              <EllipsisHorizontalIcon className="w-8 h-8" />
            </button>
          </div>
          <Transition
            show={configOpen}
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="">
              <h3 className="text-2xl font-semibold tracking-wide">Senders</h3>
              <div>
                {getSenders(messages).map(s => (
                  <div className="flex flex-grow justify-between">
                    <div>{s}</div>
                    <div className="w-72">
                      <SenderMultiSelect />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Transition>
          <div className="mt-8 h-96 w-full">
            <ResponsiveContainer>
              <BarChart
                data={getTotalMessageFrequencies(messages, senders)}
                margin={{
                  top: 5,
                  right: 0,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {getSenders(messages).map((m, i) => <Bar key={i} name={m} dataKey={`members.${i}.count`} fill={generateColour()} />)}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        isLoading ? (
          <span>Loading...</span>
        ) : (
          <div className="p-4 text-center mt-10">
            <h3 className="text-2xl font-bold tracking wide">
              You haven't imported any whatsapp chats yet
            </h3>
          </div>
        )
      )}
    </>
  )
}