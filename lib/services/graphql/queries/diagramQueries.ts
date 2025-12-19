import { gql } from "@apollo/client";
import { cookies } from "next/headers";
import { createServerApolloClient } from "../serverClient";
import { DiagramsResponse } from "@/lib/types/diagram";

export const MY_DIAGRAMS = gql`
  # query GetDiagrams($limit: Int = 20, $offset: Int = 0) {
  #   diagrams(limit: $limit, offset: $offset) {
  query MyDiagrams {
    myDiagrams {
      _id
      title
      description
      public
      author {
        id
        name
        email
      }
      result {
        label
        value
        reference
      }
      nodes {
        id
        type
        position {
          x
          y
        }
        data
      }
      edges {
        id
        source
        target
        type
        data
      }
      viewport {
        x
        y
        zoom
      }
    }
  }
`;

export const CREATE_DIAGRAM_MUTATION = gql`
  mutation CreateDiagram($input: CreateDiagramInput!) {
    createDiagram(input: $input) {
      _id
      title
      description
      public
      author {
        name
        email
      }
    }
  }
`;

export async function getDiagrams() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    console.log("token", token);

    // Create Apollo client with token (if available)
    const serverClient = createServerApolloClient(token);

    const { data } = await serverClient.query<DiagramsResponse>({
      query: MY_DIAGRAMS,
      context: {
        fetchOptions: {
          next: { revalidate: 0 },
        },
      },
    });

    const diagrams = data?.diagrams || [];

    return { diagrams };
  } catch (error) {
    const errorObj = error as Record<string, unknown>;
    if (errorObj.code === "auth/argument-error") {
      return {
        diagrams: [],
        error: { message: "Invalid session", status: 401 },
      };
    }

    return {
      diagrams: [],
      error: {
        message: (error as Error).message || "Internal server error",
        status: 500,
      },
    };
  }
}
