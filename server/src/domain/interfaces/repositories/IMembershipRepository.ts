import { Membership } from "../../entities/membership/MembershipEntity";
import { IBaseRepository } from "./IBaseRepository";
import { Subscription } from "../../entities/admin/subscriptionEntities";

export interface IMembershipRepository extends IBaseRepository <Membership>{
  findBySubscriptionId(subscriptionId: string): Promise<Membership | null>;
  updateStatus(id: string, status: string): Promise<Membership | null>;
}
