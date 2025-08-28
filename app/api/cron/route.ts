// next
import { NextResponse } from "next/server"

// actions
import { ActiveTask } from "@/actions/settings"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// GET
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export async function GET(req: Request) {

    // code
    const secret = req.headers.get("x-cron-secret")
    if (secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // action
    const res = await ActiveTask()
    if ("success" in res) return NextResponse.json({ success: true })
    return NextResponse.json({ error: "Server error" }, { status: 500 })
}   