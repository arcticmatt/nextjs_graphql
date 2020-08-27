import { useRouter, NextRouter } from "next/router";
import { useMemo } from "react";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { concatPagination } from "@apollo/client/utilities";

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

function createApolloClient(router: NextRouter) {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );

        // Not actually sure how to do redirecting on the server, so just doing it client-side for now...
        // Should probably read more about how NextJS rendering actually works.
        if (
          typeof window !== "undefined" &&
          message.includes("not authenticated")
        ) {
          console.log("redirecting");
          router.push("/login");
        }
      });

    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  const httpLink = new HttpLink({
    uri: "http://localhost:4000/graphql", // Server URL (must be absolute)
    credentials: "include",
  });

  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: errorLink.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            allPosts: concatPagination(),
          },
        },
      },
    }),
  });
}

export function initializeApollo(initialState: any = null, router: NextRouter) {
  const _apolloClient = apolloClient ?? createApolloClient(router);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();
    // Restore the cache using the data passed from getStaticProps/getServerSideProps
    // combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState: any) {
  const router = useRouter();
  const store = useMemo(() => initializeApollo(initialState, router), [
    initialState,
  ]);
  return store;
}
