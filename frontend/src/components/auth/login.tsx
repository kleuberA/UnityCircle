"use client"
import useUsers from "@/hook/useUsers";
// import { gql, useQuery } from "@apollo/client";

// const QUERY = gql`
//   query{
//   getUsers {
//     id
//     email
//     fullname
//   }
// }
// `;

export default function Login() {
    // const { loading, error, data } = useQuery(QUERY);

    const { data, loading, error } = useUsers()
    console.log(data.getUsers);

    return (
        <div>
            {data.getUsers.map((user: any, index: number) => (
                <div key={index}>
                    <p>{user.id}</p>
                    <p>{user.email}</p>
                    <p>{user.fullname}</p>
                </div>
            ))}
        </div>
    )
}