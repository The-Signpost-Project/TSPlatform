import { Module } from "@nestjs/common";
import { DbClientModule } from "@db/client";
import { PeddlerService } from "./peddler.service";
import { DisabilityService } from "./disability.service";
import { PeddlerController } from "./peddler.controller";
import { RegionService } from "./region.service";

@Module({
	imports: [DbClientModule],
	providers: [PeddlerService, DisabilityService, RegionService],
	controllers: [PeddlerController],
})
export class PeddlerModule {}
