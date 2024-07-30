// src/db/for-feature.db.ts
import { User, UserSchema } from "src/module/user/entities/user.entity";

export default [
  { name: User.name, schema: UserSchema },
];
