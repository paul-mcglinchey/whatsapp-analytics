'use client'

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import FileUpload from "./components/FileUpload";
import { colours } from "./config/colours";
import { shortMonths } from "./config/months";
import { IMessage } from "./models/message.model";

export default function Page() {

  const [messages, setMessages] = useState<IMessage[]>(JSON.parse(localStorage.getItem("messages") ?? "[]"))

  const members = messages.reduce((p, c) => {
    if (!p.find(m => m === c.sender)) p.push(c.sender)

    return p
  }, [] as string[])

  const data = messages.reduce((p, c) => {
    let monthSent = new Date(c.sentDate).getMonth()
    let month = p.find(m => m.month === shortMonths[monthSent])
    
    if (month) {
      let key = c.sender as string
      if (!month.members.map(m => m.name).includes(key)) month.members.push({ name: c.sender, count: 0 })

      month.members.map(m => m.name === c.sender ? { ...m, count: m.count++ } : m)
    }

    return p
  },
  Array.from(shortMonths).map(m => ({ month: m, members: [] })) as { month: string, members: { name: string, count: number}[] }[])

  const generateColour = (): string => {
    return colours[Math.floor(Math.random() * colours.length)] || "#f43f5e" ;
  }

  return (
    <>
      <div className="px-5 pt-2 flex justify-between">
        <div>
          <h1 className="text-blue-500 text-3xl font-bold tracking-wider">Bonjourno, friendo</h1>
        </div>
        <div>
          <FileUpload setFile={setMessages} />
        </div>
      </div>
      <div className="mt-8 h-96 w-full">
        <ResponsiveContainer>
          <BarChart
            data={data}
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
            {members.map((m, i) => <Bar key={i} name={m} dataKey={`members.${i}.count`} fill={generateColour()} /> )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}