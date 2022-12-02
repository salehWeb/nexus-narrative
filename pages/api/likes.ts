import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma'
import { GetUserIdMiddleware } from '../../middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const id = Number(req.query["id"]);

        const {id: userId, error} = GetUserIdMiddleware(req);


        if (typeof id !== "number") return res.status(404).json({massage: "Post Not Found"});
        
        const likes = await prisma.like.count({ where: { isLike: true, postId: id } })
            
        const dislikes = await prisma.like.count({ where: { isDislike: true, postId: id } })

        if (userId) {
            const isLiked = await prisma.like.findFirst({where: {  postId: id, userId: userId }, select: { isDislike: true, isLike: true } });
            return res.status(200).json({ likes, dislikes, isLiked: isLiked })

        } else {
            return res.status(200).json({ likes, dislikes })
        }
    }

    if (req.method === "PATCH") {

        const postId = Number(req.query["id"]);
        const { error, id } = GetUserIdMiddleware(req)

        if (error) return res.status(400).json({ massage: error });
        if (typeof id !== "number") return res.status(400).json({ massage: "User Not Found" });

        if (typeof postId !== "number") return res.status(400).json({ massage: "Post Not Found" });

        const user = await prisma.user.findFirst({ where: { id: id }, select: { id: true } });

        if (!user) return res.status(400).json({ massage: "User Not Found" })

        const likes = await prisma.like.findFirst({ where: {  postId: postId, userId: id }, select: { id: true, isDislike: true, isLike: true } })

        if (req.query["type"] === "like") {

            if (!likes) {
                await prisma.like.create({
                    data: {
                        isLike: true,
                        user: { connect: { id: id } },
                        post: { connect: { id: postId } }
                    }
                })

            } else if (likes.isDislike === true) {
                await prisma.like.update({
                    where: { id: likes.id },
                    data: { isLike: true, isDislike: false }
                })
                
            } else if (likes.isLike === true) {
                await prisma.like.update({
                    where: { id: likes.id },
                    data: { isLike: false, isDislike: false }
                })
            } else {
                await prisma.like.update({
                    where: { id: likes.id },
                    data: { isLike: true, isDislike: false }
                })
            }


            return res.status(200).json({ massage: "Success" })
        }

        if (req.query["type"] === "dislike") {

            if (!likes) {
                await prisma.like.create({
                    data: {
                        isDislike: true,
                        user: { connect: { id: id } },
                        post: { connect: { id: postId } }
                    }
                })

            } else if (likes.isLike === true) {
                await prisma.like.update({
                    where: { id: likes.id },
                    data: { isLike: false, isDislike: true }
                })

            } else if (likes.isDislike === true) {
                await prisma.like.update({
                    where: { id: likes.id },
                    data: { isLike: false, isDislike: false }
                })
            } else {
                await prisma.like.update({
                    where: { id: likes.id },
                    data: { isLike: false, isDislike: true }
                })
            }

            return res.status(200).json({ massage: "Success" })
        }
    }
}