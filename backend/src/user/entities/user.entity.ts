import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => String)
  id: string;

  @Field(() => String)
  fullname: string;

  @Field(() => String)
  bio: string;

  @Field(() => String)
  image: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
  // @Field(() => [Post], { description: 'Example field (placeholder)' })
  // posts: Post[];
  // @Field(() => [Comment], { description: 'Example field (placeholder)' })
  // comments: Comment[];
  // @Field(() => [Like], { description: 'Example field (placeholder)' })
  // likes: Like[];

}
