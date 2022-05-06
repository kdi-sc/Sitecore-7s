import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, from } from '@apollo/client'


class GraphQLApolloClient {

    constructor(
        private endpoint: string,
        private graphql_secret: string
    ) { }

    //private isBrowser(): boolean {
    //    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
    //}




    public getClient<ApolloClient>() {
        //console.log("GetClient: START");

        const httpLink = createHttpLink({
            uri: `${this.endpoint}`,
        });
        //console.log("GetClient: After httpLink");

        const authMiddleware = new ApolloLink((operation, forward) => {
            // add the authorization to the headers
            operation.setContext(({ headers = {} }) => ({
                headers: {
                    ...headers,
                    'X-GQL-Token': `${this.graphql_secret}`
                },
                fetchOptions: {
                    mode: 'no-cors'
                }
            }));

            return forward(operation);
        });
        //console.log("GetClient: After authMiddleware");

        //console.log(`---------------------------------------------------------------------------------`);
        //console.log(`GQL-req ${this.endpoint}`);
        //console.log(`GQL-secret ${this.graphql_secret}`);
        //console.log(`---------------------------------------------------------------------------------`);

        var client = new ApolloClient({
            link: from([
                authMiddleware,
                httpLink
            ]),
            cache: new InMemoryCache(),

            defaultOptions: {
                query: {
                    fetchPolicy: 'no-cache',

                },
            }


        });
        return client;
    }



}

const previewGraphQLClient = new GraphQLApolloClient(
    process.env.GRAPHQL_ENDPOINT_PREVIEW,
    process.env.GRAPHQL_SECRET_PREVIEW,
);

const graphQLClient = new GraphQLApolloClient(
    process.env.GRAPHQL_ENDPOINT,
    process.env.GRAPHQL_SECRET
);

export const createApolloClient = (preview: boolean) => (preview ? previewGraphQLClient : graphQLClient);
