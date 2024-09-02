import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";


const YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;
const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url:z.string()
})

export async function POST(req:NextRequest)
{
   try{
    const data = CreateStreamSchema.parse(await req.json());
    const isYt = data.url.match(YT_REGEX)
    if(!isYt){
        return NextResponse.json({
            message: "Wrong URL format"
        },{
            status:411
        })
    }

    const extractedId = data.url.split("?v=")[1];
    const res = await youtubesearchapi.GetVideoDetails(extractedId);
    // console.log(res);
    console.log(res.title);
    const thumbnails=res.thumbnail.thumbnails;
    //console.log(JSON.stringify(res.thumbnail.thumbnails));
    thumbnails.sort((a : {width:number},b:{width:number}) => a.width < b.width ? -1 : 1);
    const stream = await prismaClient.stream.create({
        data : {
            userId: data.creatorId,
            url : data.url,
            extractedId,
            type:"Youtube",
            title:res.title ?? "cant find video",
            smallImg:thumbnails.length > 1 ?  thumbnails[thumbnails.length - 2].url : thumbnails[thumbnails.length - 1].url ?? "data:image/png;base64,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",
            bigImg:thumbnails[thumbnails.length-1].url ?? "data:image/png;base64,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"
        }
        
    });
    
    return NextResponse.json({
        message : "Added stream",
        id : stream.id
    })

    }
    catch(e) {
        console.log(e)
        return NextResponse.json({
            message: "Error while adding a stream"
        },{
            status:411
        })
    }
}

export async function GET(req:NextRequest) {
    const creatorId = req.nextUrl. searchParams.get("creatorId");
    const streams = await prismaClient.stream.findMany({
        where : {
            userId : creatorId ?? ""
        }
    })

    return NextResponse.json({
        streams
    })
}
  