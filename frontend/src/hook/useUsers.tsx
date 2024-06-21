import { gql, useQuery } from "@apollo/client";

const QUERY = gql`
  query{
  getUsers {
    id
    email
    fullname
  }
}
`;

export default function useUsers() {
    const { data, loading, error, } = useQuery(QUERY);

    return {
        data: data,
        loading: loading,
        error: error,
    }
}