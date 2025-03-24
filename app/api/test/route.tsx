export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  try {
    return Response.json(
      {
        status: "Success",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        status: "Internal Server Error",
        data: [],
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log("test api called");

    console.log("request", request);

    return Response.json(
      {
        status: "Success",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        status: "Internal Server Error",
        data: [],
      },
      {
        status: 500,
      }
    );
  }
}
