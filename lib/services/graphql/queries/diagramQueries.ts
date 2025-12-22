import { gql } from "@apollo/client";
import { cookies } from "next/headers";
import { createServerApolloClient } from "../serverClient";
import {
  MyDiagramsResponse,
  PublicDiagramsResponse,
} from "@/lib/types/diagram";

export const MY_DIAGRAMS = gql`
  # query MyDiagrams($limit: Int = 20, $offset: Int = 0) {
  #   myDiagrams(limit: $limit, offset: $offset) {
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

export const PUBLIC_DIAGRAMS = gql`
  query PublicDiagrams {
    publicDiagrams {
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

export const UPDATE_DIAGRAM_MUTATION = gql`
  mutation UpdateDiagram($id: String, $input: UpdateDiagramInput!) {
    updateDiagram(id: $id, input: $input) {
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

// export async function getMyDiagrams(limit: number = 20, offset: number = 0) {
export async function getMyDiagrams() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    // Create Apollo client with sessionCookie (if available)
    const serverClient = createServerApolloClient(sessionCookie);

    const { data } = await serverClient.query<MyDiagramsResponse>({
      query: MY_DIAGRAMS,
      // variables: { limit, offset },
      context: {
        fetchOptions: {
          next: { revalidate: 0 },
        },
      },
    });

    const diagrams = data?.myDiagrams || [];

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

export async function getPublicDiagrams() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    const serverClient = createServerApolloClient(sessionCookie);

    const { data } = await serverClient.query<PublicDiagramsResponse>({
      query: PUBLIC_DIAGRAMS,
      // variables: { limit, offset },
      context: {
        fetchOptions: {
          next: { revalidate: 0 },
        },
      },
    });

    const diagrams = data?.publicDiagrams || [];

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
