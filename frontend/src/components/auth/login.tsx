"use client"
import useUsers from "@/hook/useUsers";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import Link from "next/link";
import { Input } from "../ui/input";

const FormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
})

export default function Login() {
    // const { loading, error, data } = useQuery(QUERY);

    // const { data, loading, error } = useUsers()
    // console.log(data.getUsers);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {

        // setLoading(true);

        // setLoading(false);

        // if (error) {
        //     toast.error(error.message + "!",
        //         {
        //             style: {
        //                 borderRadius: '3px',
        //                 background: '#333',
        //                 color: '#fff',
        //             },
        //         });
        // } else {
        //     toast.success("Login successfully!",
        //         {
        //             style: {
        //                 borderRadius: '3px',
        //                 background: '#333',
        //                 color: '#fff',
        //             },
        //         });
        //     router.push('/quiz');
        // }
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
                                            <Input type="password" placeholder="********" {...field} />
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