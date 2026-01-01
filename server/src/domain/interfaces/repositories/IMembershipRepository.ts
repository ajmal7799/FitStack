import { Membership } from '../../entities/membership/MembershipEntity';
import { IBaseRepository } from './IBaseRepository';
import { Subscription } from '../../entities/admin/subscriptionEntities';

export interface IMembershipRepository extends IBaseRepository <Membership>{
  findBySubscriptionId(subscriptionId: string): Promise<Membership | null>;
  findByUserId(userId: string): Promise<Membership | null>;
  updateStatus(id: string, status: string): Promise<Membership | null>;
  findActiveMembershipsWithSubscription(userId: string): Promise<{ membership: Membership; subscription: Subscription }[]>;
}
