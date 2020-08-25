import { GetServerSideProps } from "next";
import {
  ConfirmUserDocument,
  ConfirmUserMutation,
  ConfirmUserMutationVariables,
} from "../../../types/graphqlGen";
import { initializeApollo } from "../../../lib/apolloClient";

type Props = {
  error?: string;
  success?: string;
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
}): Promise<{ props: Props }> => {
  const apolloClient = initializeApollo();
  const token = params!.token as string;
  const response = await apolloClient.mutate<
    ConfirmUserMutation,
    ConfirmUserMutationVariables
  >({
    mutation: ConfirmUserDocument,
    variables: {
      token: token,
    },
  });
  if (response!.data!.confirmUser) {
    return { props: { success: "Success!" } };
  } else {
    return { props: { error: "Error..." } };
  }
};

export default function ConfirmPage(props: Props) {
  if (props.error) {
    return <div>{props.error}</div>;
  } else {
    return <div>{props.success}</div>;
  }
}
