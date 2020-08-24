import Link from "next/link";
import * as React from "react";
import Layout from "../components/Layout";
import { LoginMutationVariables, useLoginMutation } from "../types/graphqlGen";

const IndexPage: React.FunctionComponent = () => {
  const [loginMutation, {}] = useLoginMutation();

  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <h1>hello Next.js 👋</h1>
      <p>
        <Link href="/about">
          <a>About</a>
        </Link>
      </p>
      <button
        onClick={async () => {
          const mutationVariables: LoginMutationVariables = {
            password: "fafds",
            email: "test@test.com",
          };
          const response = await loginMutation({
            variables: mutationVariables,
          });
          console.log(response);
        }}
      >
        call login mutation
      </button>
    </Layout>
  );
};

export default IndexPage;
