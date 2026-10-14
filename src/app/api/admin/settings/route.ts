import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.storeSetting.findMany();
    const dictionary: Record<string, string> = {};
    settings.forEach((s) => {
      dictionary[s.key] = s.value;
    });

    return NextResponse.json({ settings: dictionary, list: settings });
  } catch (error) {
    console.error("Fetch settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json(); // e.g. { store_name: "Valchandson Jewellers", ... }

    const entries = Object.entries(body);
    for (const [key, value] of entries) {
      if (typeof value === "string") {
        await prisma.storeSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }
    }

    const updated = await prisma.storeSetting.findMany();
    const dictionary: Record<string, string> = {};
    updated.forEach((s) => {
      dictionary[s.key] = s.value;
    });

    return NextResponse.json({
      success: true,
      message: "Store settings updated successfully",
      settings: dictionary,
    });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
