import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { nextauth: string[] } }) {

    const resolvedParams = await params;
    console.log(resolvedParams.nextauth);

    return NextResponse.json({
        message: "Handler",
    });
}

export function POST() {
    return NextResponse.json({
        message: "POST Handler"
    })
}