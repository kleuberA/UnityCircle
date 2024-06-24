"use client"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Link from "next/link";
import { z } from "zod"
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "@/graphql/mutations/register";
import { GraphQLErrorExtensions } from "graphql";
import { useState } from "react";

const FormSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters." }),
    lastname: z.string().min(3, { message: "Last Name must be at least 3 characters." }),
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .nonempty({
            message: "Senha é obrigatório."
        })
        .min(8, { message: "A Senha deverá conter no mínimo 8 caracteres." })
        .regex(/[a-z]+/, { message: "A Senha deverá conter pelo menos 1 letra minúscula." })
        .regex(/[A-Z]+/, { message: "A Senha deverá conter pelo menos 1 letra maiúscula." })
        .regex(/[@$!%*#?&]/, { message: "A Senha deverá conter pelo menos 1 caractere especial." })
        .regex(/[0-9]+/, { message: "A Senha deverá conter pelo menos 1 número." }),
    confirmPassword: z
        .string()
        .nonempty({
            message: "Confirmar senha é obrigatório."
        }),
})
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "As senhas não coincidem.",
    })



export default function Register() {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            lastname: "",
            confirmPassword: ""
        },
    })

    const [errors, setErrors] = useState<GraphQLErrorExtensions>({})
    const [registerUser, { loading, error, data }] = useMutation(REGISTER_USER);

    async function onSubmit(data: z.infer<typeof FormSchema>) {

        try {
            setErrors({})
            await registerUser({
                variables: {
                    email: data.email,
                    password: data.password,
                    fullname: data.name + data.lastname,
                    confirmPassword: data.confirmPassword,
                },
            })
            console.log("DATA", data)
            console.log(error?.graphQLErrors[0].extensions)
        } catch (_) {
            if (error && error.graphQLErrors && error.graphQLErrors[0].extensions) {
                const validationErrors = error.graphQLErrors[0].extensions
                setErrors(validationErrors)
            }
        }

        // setLoading(true);

        // const { data: dataSignUp, error } = await supabase.auth.signUp({
        //     email: data.email,
        //     password: data.password,
        //     options: {
        //         data: {
        //             name: data.name,
        //             lastName: data.lastname
        //         }
        //     }
        // });

        // setLoading(false);

        // if (error) {
        //     toast.error(error.message,
        //         {
        //             style: {
        //                 borderRadius: '3px',
        //                 background: '#333',
        //                 color: '#fff',
        //             },
        //         });
        // } else {
        //     toast.success("Account created successfully!",
        //         {
        //             style: {
        //                 borderRadius: '3px',
        //                 background: '#333',
        //                 color: '#fff',
        //             },
        //         });
        // }
        form.reset();
        // router.push('/auth/signin');
    }

    return (
        <Card className="mx-auto max-w-sm ">
            <CardHeader>
                <CardTitle className="text-xl">Sign Up</CardTitle>
                <CardDescription>
                    Enter your information to create an account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Jonh" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Doe" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="emailexample@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="********" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>ConfirmPassword</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="********" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                            >
                                Create an account
                            </Button>
                        </div>
                    </form>
                </Form>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/auth/signin" className="underline">
                        Sign in
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}