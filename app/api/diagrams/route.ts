import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { createServerApolloClient } from "@/lib/services/graphql/serverClient";
import { CreateDiagramInput } from "@/lib/types/diagram";
import {
  CREATE_DIAGRAM_MUTATION,
  getMyDiagrams,
  getPublicDiagrams,
} from "@/lib/services/graphql/queries/diagramQueries";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // const limit = parseInt(searchParams.get("limit") || "20", 10);
    // const offset = parseInt(searchParams.get("offset") || "0", 10);
    const isPublic = searchParams.get("public") === "true";

    const { diagrams, error } = isPublic
      ? await getPublicDiagrams()
      : // : await getMyDiagrams(limit, offset);
        await getMyDiagrams();
    // const { diagrams, error } = await getMyDiagrams();

    if (error) {
      return NextResponse.json({ error: error.message, status: error.status });
    }

    return NextResponse.json(diagrams, { status: 200 });
  } catch (error: unknown) {
    const errorObj = error as Record<string, unknown>;
    if (errorObj.code === "auth/argument-error") {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    return NextResponse.json(
      { error: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = (await request.json()) as Partial<CreateDiagramInput>;

    // Validate required fields
    if (!body.title || !body.description) {
      return NextResponse.json({ error: "Fields required" }, { status: 400 });
    }

    // Prepare diagram data
    const diagramInput: CreateDiagramInput = {
      title: body.title.trim(),
      description: body.description.trim(),
      author: body.author || "",
      public: body.public ?? false,
      result:
        body.result?.map((r) => ({
          label: r.label,
          value: r.value,
          reference: r.reference || "",
        })) || [],
      nodes: body.nodes || [],
      edges: body.edges || [],
      viewport: body.viewport,
    };

    const apolloClient = createServerApolloClient(sessionCookie);
    const result = await apolloClient.mutate({
      mutation: CREATE_DIAGRAM_MUTATION,
      variables: { input: diagramInput },
    });

    const data = result.data as { createDiagram?: { _id: string } } | undefined;

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message || "Failed to create diagram" },
        { status: 400 }
      );
    }

    if (!data?.createDiagram) {
      return NextResponse.json(
        { error: "Failed to create diagram" },
        { status: 500 }
      );
    }

    return NextResponse.json(data.createDiagram, { status: 201 });
  } catch (error: unknown) {
    const errorObj = error as Record<string, unknown>;
    if (errorObj.code === "auth/argument-error") {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    return NextResponse.json(
      { error: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
