import { useRouter } from "next/router";
import { Field, Formik } from "formik";
import React from "react";
import { InputField } from "../components/fields/InputField";
import Layout from "../components/Layout";
import { LoginMutationVariables, useLoginMutation } from "../types/graphqlGen";

export default function LoginPage() {
  const [loginMutation, {}] = useLoginMutation();
  const router = useRouter();

  return (
    <Layout title="Login page">
      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={async (data: LoginMutationVariables, { setErrors }) => {
          const response = await loginMutation({
            variables: data,
          });
          console.log(response);
          if (response && response.data && !response.data.login) {
            setErrors({
              email: "invalid login",
            });
            return;
          }

          router.push("/");
        }}
        initialValues={{
          email: "",
          password: "",
        }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field name="email" placeholder="email" component={InputField} />
            <Field
              name="password"
              placeholder="password"
              type="password"
              component={InputField}
            />
            <button type="submit">submit</button>
          </form>
        )}
      </Formik>
    </Layout>
  );
}
