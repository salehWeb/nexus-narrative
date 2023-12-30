import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {

        try {
            const postId = Number(req.query["id"]);
            const UserIPAddress = req.socket.remoteAddress;

            if (typeof postId !== "number") return res.status(404).json({ massage: "post Id Not Found" });

            if (typeof UserIPAddress !== "string") return res.status(400).json({ massage: "Bad IP Address" });

            const view = await prisma.views.findFirst({
                where: { postId: postId, IPAddress: UserIPAddress },
                select: { id: true }
            })

            if (view?.id) return res.status(200).json({ massage: "all Ready Viewed" })

            await prisma.views.create({
                data: {
                    post: { connect: { id: postId } },
                    IPAddress: UserIPAddress,
                    monthAndYear: new Date().toISOString().substring(0, 7)
                }
            });

            return res.status(200).json({ massage: "Success" });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ massage: "internal Server Error" })
        }

    }
}
