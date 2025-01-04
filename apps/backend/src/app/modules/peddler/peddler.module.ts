import { Module } from "@nestjs/common";
import { LuciaService, PrismaService } from "@db/client";
import { PeddlerService } from "./peddler.service";
import { DisabilityService } from "./disability.service";
import { PeddlerController } from "./peddler.controller";

@Module({
	providers: [PeddlerService, DisabilityService, PrismaService, LuciaService],
	controllers: [PeddlerController],
})
export class PeddlerModule {}
