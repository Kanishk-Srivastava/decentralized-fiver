import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware";
const router = Router();
const prismaClient = new PrismaClient();

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

//Get presigned url endpoint
router.get("/presignedUrl", authMiddleware, async (req: any, res) => {
  const userId = req.userId;

  const command = new PutObjectCommand({
    Bucket: "decentralized-fiver-kanishk",
    Key: `${userId}/${Date.now()}/image.png`,
    ContentType: "image/png",
  });

  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });

  res.json({ presignedUrl, contentType: "image/png" });
});

//Sign in endpoint

router.post("/signin", async (req, res) => {
  const hardCodedWalletAddress = "F8CaWR7Q5PL9yGYvATBs4Kbkbwgb2e5rupnkuYJ7CKjs";
  const existingUser = await prismaClient.user.findFirst({
    where: {
      address: hardCodedWalletAddress,
    },
  });

  if (existingUser) {
    const token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET as string);
    res.json({ token });
  } else {
    const user = await prismaClient.user.create({
      data: {
        address: hardCodedWalletAddress,
      },
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);

    res.json({ token });
  }
});
export default router;
