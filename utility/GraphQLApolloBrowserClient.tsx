import { createApolloClient } from "./GraphQLApolloClient";

export default function useGraphQLApolloClient(mycontext: boolean) {
  if (mycontext == null) {
    console.error(
      "Tried to use GraphQLApolloBrowserClient outside a PreviewContext. The client will never support preview."
    );
    return createApolloClient(false).getClient();
  }

  return createApolloClient(mycontext).getClient();
}
