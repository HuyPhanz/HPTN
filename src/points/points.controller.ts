import { Controller, Post, Param, Body } from '@nestjs/common';
import { PointsService } from './points/points.service';

@Controller('points')
export class PointsController {
  constructor(private pointsService: PointsService) {}

  @Post('add/:userId/:productPoints')
  addPoints(
    @Param('userId') userId: string,
    @Param('productPoints') productPoints: number,
  ) {
    this.pointsService.addPoints(userId, productPoints);
    return `Added ${productPoints} points for user ${userId}.`;
  }

  @Post('redeem/:userId/:redemptionPoints')
  redeemPoints(
    @Param('userId') userId: string,
    @Param('redemptionPoints') redemptionPoints: number,
  ) {
    return this.pointsService.redeemPoints(userId, redemptionPoints);
  }

  @Post('get/:userId')
  getUserPoints(@Param('userId') userId: string) {
    return `User ${userId} has ${this.pointsService.getUserPoints(userId)} points.`;
  }
}
