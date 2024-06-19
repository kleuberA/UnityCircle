import { BadRequestException, UseGuards, UseFilters } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth/graphql-auth-guard';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { GraphQLErrorFilter } from 'src/filters/custom-exception.filter';
import { LoginResponse, RegisterResponse } from 'src/auth/types';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { RegisterDto } from 'src/auth/dto/register-auth.input';
import { LoginDto } from 'src/auth/dto/login-auth.input';
import { AuthService } from 'src/auth/auth.service';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { Response, Request } from 'express';
import { createWriteStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }

  @UseFilters(GraphQLErrorFilter)
  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException({
        confirmPassword: 'Password and confirm password are not the same.',
      });
    }
    try {
      const { user } = await this.authService.register(
        registerDto,
        context.res,
      );
      console.log('user!', user);
      return { user };
    } catch (error) {
      return {
        error: {
          message: error.message,
        },
      };
    }
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginDto: LoginDto,
    @Context() context: { res: Response },
  ) {
    return this.authService.login(loginDto, context.res);
  }

  @Mutation(() => String)
  async logout(@Context() context: { res: Response }) {
    return this.authService.logout(context.res);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => String)
  getProtectedData() {
    return 'This is protected data';
  }

  @Mutation(() => String)
  async refreshToken(@Context() context: { req: Request; res: Response }) {
    try {
      return this.authService.refreshToken(context.req, context.res);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => User)
  async updateUserProfile(
    @Context()
    context: { req: Request },
    @Args('fullname', { type: () => String, nullable: true }) fullname?: string,
    @Args('bio', { type: () => String, nullable: true }) bio?: string,
    @Args('image', { type: () => GraphQLUpload, nullable: true })
    image?: GraphQLUpload,
  ) {
    console.log('image!', image, 'fullname!', fullname, 'bio!', bio);
    let imageUrl;
    if (image) {
      imageUrl = await this.storeImageAndGetURL(image);
    }
    return this.userService.updateProfile(context.req.user.sub, {
      fullname,
      bio,
      image: imageUrl,
    });
  }

  @Query(() => [User])
  async getUsers() {
    return this.userService.getUsers();
  }

  private async storeImageAndGetURL(file: GraphQLUpload): Promise<string> {
    const { createReadStream, filename } = await file;
    const fileData = await file;
    console.log('fileData!', fileData);

    const uniqueFilename = `${uuidv4()}_${filename}`;
    const imagePath = join(process.cwd(), 'public', uniqueFilename);
    const imageUrl = `${process.env.APP_URL}/${uniqueFilename}`;
    const readStream = createReadStream();
    readStream.pipe(createWriteStream(imagePath));

    return imageUrl;
  }
}
