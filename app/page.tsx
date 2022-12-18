'use client'

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import FileUpload from "./components/FileUpload";
import { colours } from "./config/colours";
import { shortMonths } from "./config/months";
import chatConverter from "./services/chat-converter";
import { IMessage } from "./models/message.model";
import { getMembers, getTotalMessageFrequencies } from "./services/data-collectors";

export default function Page() {

  const [messages, setMessages] = useState<IMessage[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

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
        <div className="mt-8 h-96 w-full">
          <ResponsiveContainer>
            <BarChart
              data={getTotalMessageFrequencies(messages)}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {getMembers(messages).map((m, i) => <Bar key={i} name={m} dataKey={`members.${i}.count`} fill={generateColour()} />)}
            </BarChart>
          </ResponsiveContainer>
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