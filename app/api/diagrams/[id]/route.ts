import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { createServerApolloClient } from "@/lib/services/graphql/serverClient";
import { UpdateDiagramInput } from "@/lib/types/diagram";
import { UPDATE_DIAGRAM_MUTATION } from "@/lib/services/graphql/queries/diagramQueries";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = (await request.json()) as Partial<UpdateDiagramInput>;

    // Prepare diagram data
    const diagramInput: UpdateDiagramInput = {
      title: body.title?.trim() || undefined,
      description: body.description?.trim() || undefined,
      public: body.public || undefined,
      result:
        body.result?.map((r) => ({
          label: r.label,
          value: r.value,
          reference: r.reference || "",
        })) || [],
      state: {
        nodes: body.state?.nodes || [],
        edges: body.state?.edges || [],
        viewport: body.state?.viewport,
      },
    };

    const apolloClient = createServerApolloClient(sessionCookie);
    const result = await apolloClient.mutate({
      mutation: UPDATE_DIAGRAM_MUTATION,
      variables: { id, input: diagramInput },
    });

    const data = result.data as { updateDiagram?: { _id: string } } | undefined;

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message || "Failed to create diagram" },
        { status: 400 }
      );
    }

    if (!data?.updateDiagram) {
      return NextResponse.json(
        { error: "Failed to create diagram" },
        { status: 500 }
      );
    }

    return NextResponse.json(data.updateDiagram, { status: 200 });
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
