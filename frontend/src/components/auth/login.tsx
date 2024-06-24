"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { LOGIN_USER } from "@/graphql/mutations/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Link from "next/link";
import * as z from "zod";

const FormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
})

export default function Login() {
    const router = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const [loginUser, { loading, error, data }] = useMutation(LOGIN_USER, {
        onCompleted: (data) => {
            console.log("DATA", data)
        }
    })

    async function onSubmit(dataForm: z.infer<typeof FormSchema>) {

        try {
            const response = await loginUser({
                variables: {
                    email: dataForm.email,
                    password: dataForm.password,
                },
            });
            console.log(response);
            router.push('/home');
        } catch (_) {
            console.log("ERROR");
        }

        console.log(error)
        form.reset();
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} >
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="m@example.com" {...field} />
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
                                        <div className="flex flex-row justify-between">
                                            <FormLabel>Password</FormLabel>
                                            <Link href="/auth/fortgotpassword" className="text-xs text-primary underline" >Forgot Password?</Link>
                                        </div>
                                        <FormControl>
                                            <Input type="password" placeholder="********"  {...field} />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full hover:bg-transparent hover:text-primary border border-transparent hover:border-primary transition-all duration-300">
                            Login
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}