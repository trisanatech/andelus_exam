// import { NextResponse } from "next/server"
// import { prisma } from "@/prisma"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/auth"

// export async function POST(req: Request) {
//   const session = await getServerSession(authOptions)
//   if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

//   const data = await req.json()
  
//   try {
//     const exam = await prisma.exam.create({
//       data: {
//         ...data,
//         teacherId: session.user.id,
//         status: "DRAFT"
//       }
//     })
//     return NextResponse.json(exam)
//   } catch (error) {
//     return NextResponse.json({ error: "Database error" }, { status: 500 })
//   }
// }