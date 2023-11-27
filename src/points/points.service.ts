import { Injectable } from '@nestjs/common';

@Injectable()
export class PointsService {
  private userPoints = {};

  addPoints(userId: string, productPoints: number) {
    if (!this.userPoints[userId]) {
      this.userPoints[userId] = 0;
    }
    this.userPoints[userId] += productPoints;
  }

  getUserPoints(userId: string) {
    return this.userPoints[userId] || 0;
  }

  redeemPoints(userId: string, redemptionPoints: number) {
    if (this.userPoints[userId] >= redemptionPoints) {
      this.userPoints[userId] -= redemptionPoints;
      return `Redeemed ${redemptionPoints} points successfully.`;
    } else {
      return 'Insufficient points for redemption.';
    }
  }
}
