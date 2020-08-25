import { useRouter } from "next/router";
import { Field, Formik } from "formik";
import React from "react";
import { InputField } from "../components/fields/InputField";
import Layout from "../components/Layout";
import { RegisterInput, useRegisterMutation } from "../types/graphqlGen";

export default function RegisterPage() {
  const [registerMutation, {}] = useRegisterMutation();
  const router = useRouter();

  return (
    <Layout title="Register page">
      <Formik
        onSubmit={async (data: RegisterInput, { setErrors }) => {
          try {
            const response = await registerMutation({
              variables: {
                data,
              },
            });
            console.log(response);
            router.push("/check-email");
          } catch (err) {
            const errors: { [key: string]: string } = {};
            err.graphQLErrors[0].extensions.exception.validationErrors.forEach(
              (validationErr: any) => {
                Object.values(validationErr.constraints).forEach(
                  (message: any) => {
                    errors[validationErr.property] = message;
                  }
                );
              }
            );
            console.log(errors);
            setErrors(errors);
          }
        }}
        initialValues={{
          email: "",
          firstName: "",
          lastName: "",
          password: "",
        }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              name="firstName"
              placeholder="firstName"
              component={InputField}
            />
            <Field
              name="lastName"
              placeholder="lastName"
              component={InputField}
            />
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
