import { MembershipAdminListResult, MembershipAdminResult } from '../../../dto/admin/subscription/MembershipDTO';
import { IGetAllMembershipsUseCase } from '../../../useCase/admin/membership/IGetAllMembershipsUseCase';
import { IMembershipRepository } from '../../../../domain/interfaces/repositories/IMembershipRepository';
import { IStorageService } from '../../../../domain/interfaces/services/IStorage/IStorageService';


interface PopulatedMembership {
  membership: {
    _id: string;
    status: string;
    currentPeriodEnd: Date | null;
  };
  user: {
    _id: string;
    name: string;
    email: string;
    profileImage: string | null;
  } | null;
  subscription: {
    _id: string;
    planName: string;
    price: number;
    durationMonths: number;
  } | null;
}

export class GetAllMembershipsUseCase implements IGetAllMembershipsUseCase {
  constructor(
    private _membershipRepository: IMembershipRepository,
    private _storageService: IStorageService
  ) {}

  async execute(
    page: number,
    limit: number,
    status?: string,
    search?: string
  ): Promise<MembershipAdminListResult> {
    const skip = (page - 1) * limit;

    const [memberships, totalMemberships] = await Promise.all([
      this._membershipRepository.findAllForAdmin(skip, limit, status, search) as Promise<PopulatedMembership[]>,
      this._membershipRepository.countAllForAdmin(status, search),
    ]);

    // ✅ Resolve all signed URLs in parallel
    const mappedMemberships: MembershipAdminResult[] = await Promise.all(
      memberships.map(async item => ({
        _id:             item.membership._id,
        userName:        item.user?.name                 ?? "Unknown User",
        planName:        item.subscription?.planName     ?? "Unknown Plan",
        price:           item.subscription?.price        ?? 0,
        durationMonths:  item.subscription?.durationMonths ?? 0,
        status:          item.membership.status,
        currentPeriodEnd: item.membership.currentPeriodEnd,
        profileImage:    item.user?.profileImage
          ? await this._storageService.createSignedUrl(item.user.profileImage, 10 * 60)
          : null,
      }))
    );

    return {
      memberships: mappedMemberships,
      totalMemberships,
      totalPages:  Math.ceil(totalMemberships / limit),
      currentPage: page,
    };
  }
}