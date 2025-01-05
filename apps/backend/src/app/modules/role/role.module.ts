import { Module } from "@nestjs/common";
import { RoleService } from "./role.service";
import { PolicyService } from "./policy.service";
import { RoleController } from "./role.controller";
import { DbClientModule } from "@db/client";

@Module({
	imports: [DbClientModule],
	providers: [RoleService, PolicyService],
	controllers: [RoleController],
})
export class RoleModule {}
