import { Field, Formik } from "formik";
import React from "react";
import { InputField } from "../components/fields/InputField";
import Layout from "../components/Layout";
import { RegisterInput, useRegisterMutation } from "../types/graphqlGen";

export default () => {
  const [registerMutation, {}] = useRegisterMutation();

  return (
    <Layout title="Register page">
      <Formik
        onSubmit={async (data: RegisterInput) => {
          const response = await registerMutation({
            variables: {
              data,
            },
          });
          console.log(response);
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
};
