import { Module } from "@nestjs/common";
import { LuciaService, PrismaService } from "@db/client";
import { PeddlerService } from "./peddler.service";
import { DisabilityService } from "./disability.service";
import { PeddlerController } from "./peddler.controller";
import { RegionService } from "./region.service";

@Module({
	providers: [PeddlerService, DisabilityService, RegionService,  PrismaService, LuciaService],
	controllers: [PeddlerController],
})
export class PeddlerModule {}
