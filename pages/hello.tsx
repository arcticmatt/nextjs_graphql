import * as React from "react";
import Layout from "../components/Layout";
import { useHelloQuery } from "../types/graphqlGen";

// TODO: at https://youtu.be/dvMByjOanbk?list=PLN3n1USn4xlkDk8vPVtgyGG3_1eXYPrW-&t=317
export default function HelloPage() {
  const { data } = useHelloQuery({
    variables: {},
  });
  return (
    <Layout title="Hello page">
      <div>{data && data.hello ? data.hello : "loading..."}</div>
    </Layout>
  );
}
