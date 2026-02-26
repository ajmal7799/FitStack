import cron from 'node-cron';
import { IProcessExpiredSubscriptionsUseCase } from '../../application/useCase/user/subscription/IProcessExpiredSubscriptionsUseCase';

export class CheckExpirySubscription {
    constructor(
        private _processExpiredSubscriptionsUseCase: IProcessExpiredSubscriptionsUseCase
    ) {}

    start() {
        // Runs every hour at minute 0
        cron.schedule('0 * * * *', async () => {
            try {
                await this._processExpiredSubscriptionsUseCase.execute();
                console.log('[Cron] Successfully checked for expired subscriptions.');
            } catch (error) {
                console.error('[Cron Error] Failed to check for expired subscriptions:', error);
            }
        });
    }
}
