import { IsEmail, IsNotEmpty } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class LoginDto {
    @Field()
    @IsNotEmpty({ message: 'Email is required.' })
    @IsEmail({}, { message: 'Email must be valid.' })
    email: string;

    @Field()
    @IsNotEmpty({ message: 'Password is required.' })
    password: string;
}