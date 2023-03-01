// import { Module } from '@nestjs/common';
// import { UserService } from './user.service';
// import { UserController } from './user.controller';
//
// import { JwtModule } from '@nestjs/jwt';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserEntity } from './user.entity';
// import { ConfigService } from '@nestjs/config';
//
// import { DevicesEntity } from './devices.entity';
//
//
// @Module({
//   imports: [
//     JwtModule.register({}),
//     TypeOrmModule.forFeature([
//       UserEntity,
//
//       DevicesEntity,
//     ]),
//   ],
//   providers: [UserService,  ConfigService],
//   controllers: [UserController],
// })
// export class UserModule {}
